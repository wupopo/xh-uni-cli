import { Router, useStore } from "@/xh";
import { Route } from "@/xh/constants/router.constant";

export default function baseRouterInterceptor(fromRoute : Route | null | undefined | void, toRoute : Route) {
	// console.log(fromRoute.name, toRoute.name);
	const noAuthPageNames = ['Login', 'Register'];
	const token = uni.getStorageSync('token');
	// console.trace()
	if (toRoute.auth && !token && toRoute.name != 'Login') {
		Router.go({ name: 'Login' }, uni.redirectTo);
		throw 'no auth';
	}
	if (toRoute.query.code) {
		uni.setStorageSync('code', toRoute.query.code)
		const newQuery = { ...toRoute.query }
		delete newQuery.code;
		Router.go({ name: toRoute.name, query: newQuery }, uni.redirectTo);
		throw 'code is set';
	}
	if (token) {
		if (noAuthPageNames.includes(toRoute.name)) {
			Router.go({ name: 'Index' });
			throw 'user has login,please go to index page';
		}
		const userInfo = useStore('user').userInfo;
		if (!userInfo) {
			useStore('user').getUserInfo();
		} else {
			const { is_bind_mobile } = userInfo;
			if (!is_bind_mobile && toRoute.name != "BindMobile") {
				Router.go({ name: 'BindMobile' }, uni.redirectTo);
				throw 'wait bind mobile';
			}
		}
		const config = useStore('user').config;
		if (!config) {
			useStore('user').getConfig();
		}
	}
	return toRoute;
}