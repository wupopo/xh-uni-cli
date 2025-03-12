import pageJson from "@/pages.json";
import {
	type UniPageItem,
	type UniPages,
} from "../constants/uni/page.constant";
import {
	GoParams,
	Route,
	RouterIntercepotr,
	RouterInterceptorItem,
} from "../constants/router.constant";
import { UniTabbarItem } from "../constants/uni/page.constant";

class Router {
	private static instance : Router;

	private uniPages : UniPages | null = null;

	private pages : UniPageItem[] = [];

	private tabPages : UniTabbarItem[] = [];

	private interceptors : RouterInterceptorItem[] = [];
	private constructor() {
		this.uniPages = pageJson as UniPages;
		if (this.uniPages.tabBar && this.uniPages.tabBar.list) {
			this.tabPages = this.uniPages.tabBar.list.map((v) => {
				v.pagePath = "/" + v.pagePath;
				return v;
			});
		}
		this.pages = this.uniPages.pages.map((v) => {
			v.path = "/" + v.path;
			v.auth = v.auth ?? false;
			return v;
		});
		const _this = this;
		uni.addInterceptor("switchTab", {
			invoke: (e) => {
				const to = _this.getRouterByPath(e.url);
				const route = _this.doRouterInterceptors(to);
				e.url = route.fullPath
			}
		})
	}

	static getInstance() {
		if (!Router.instance) {
			Router.instance = new Router();
		}
		return Router.instance;
	}

	getRouterByPath(path : string) : Route {
		if (!path.startsWith("/")) path = "/" + path;
		const query : Record<string, any> = {};
		if (path.includes("?")) {
			const queryStr = path.split("?")[1];
			path = path.split("?")[0];
			// console.log(path)
			queryStr.split("&").forEach((v) => {
				const [key, value] = v.split("=");
				query[key] = value;
			});
		}
		const hasPath = this.pages.find((v) => v.path == path);
		if (!hasPath) {
			throw new Error(`${path}页面不存在`);
		}
		return {
			path,
			fullPath: path,
			title: hasPath.style.navigationBarTitleText,
			query,
			name: hasPath.name ?? "",
			auth: hasPath.auth,
		};
	}

	getCurrentPageRoute() : Route | void {
		const pages = getCurrentPages();
		if (!pages.length) return;
		const page = pages[pages.length - 1] as Record<string, any>;
		const path = `/${page.route}`;
		if (!path) return;
		let fullPath = path;
		const query = page.options ?? {};
		if (Object.keys(query).length) {
			fullPath += `?${Object.keys(query)
				.map((key) => `${key}=${query[key]}`)
				.join("&")}`;
		}

		const uniPageItme = this.pages.find((v) => v.path == path);
		if (!uniPageItme) return;
		return {
			path,
			fullPath,
			query,
			title: uniPageItme.style.navigationBarTitleText,
			name: uniPageItme.name,
			auth: uniPageItme.auth,
		};
	}

	buildRouteByNameAndQuery(
		name : string,
		query : Record<string, any> = {}
	) : Route {
		const page = this.pages.find((v) => v.name == name);
		if (!page) throw new Error(`${name}页面不存在`);
		let fullPath = page.path;
		if (Object.keys(query).length) {
			fullPath += `?${Object.keys(query)
				.map((key) => `${key}=${query[key]}`)
				.join("&")}`;
		}
		return {
			path: page.path,
			fullPath,
			query,
			title: page.style.navigationBarTitleText,
			name: page.name,
			auth: page.auth,
		};
	}

	back(num : number = 1) {
		if (num < 0) return;
		const pages = ([...getCurrentPages()] as Record<string, any>[]).reverse();
		const page = pages[num];
		if (!page) {
			this.go({ name: "Index" });
			return;
		}
		const path = page.$page.fullPath;
		let route = this.getRouterByPath(path);
		route = this.doRouterInterceptors(route);
		uni.navigateBack({
			delta: num,
		});
	}

	addInterceptor(interceptor : RouterIntercepotr, order : number = Date.now()) {
		this.interceptors.push({
			interceptor,
			order,
		});
		this.interceptors.sort((a, b) => a.order - b.order);
	}

	private doRouterInterceptors(toRoute : Route) : Route {
		let reslut = toRoute;
		this.interceptors.forEach((item) => {
			reslut = item.interceptor(this.getCurrentPageRoute(), reslut);
		});
		return reslut;
	}

	go(option : GoParams, goMethod = uni.navigateTo) {
		// console.trace()
		let route = {} as Route;
		if (typeof option == "string") {
			route = this.getRouterByPath(option);
		}
		if (typeof option == "object" && option.name) {
			route = this.buildRouteByNameAndQuery(option.name, option.query);
		}
		route = this.doRouterInterceptors(route);
		const isTab = this.tabPages.find((v) => v.pagePath == route.path);
		const current = this.getCurrentPageRoute();
		if (current && current.fullPath == route.fullPath) {
			return;
		}
		if (isTab) {
			uni.switchTab({
				url: route.path,
			});
		} else {
			goMethod({
				url: route.fullPath,
			});
		}
	}
}

export default Router.getInstance();