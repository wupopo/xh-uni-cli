import { AdType } from '@/constants/api/ad.constant'
import { initAd } from "@/api/ad";
import { feedbackLog } from '@/api/log'
export class VideoAd {
	adType : AdType;

	initData ?: UniApp.RewardedVideoAdOptions;

	adCtx ?: UniApp.RewardedVideoAdContext;

	reCount : number = 0;

	onClose ?: Function;

	gameId ?: number;

	constructor(type : AdType, gameId ?: number) {
		this.adType = type;
		this.gameId = gameId;
		this.getAdData()
	}

	private async getAdData() {
		uni.showLoading({
			title: '广告准备中',
			mask: true
		})

		const res = await initAd({
			event: this.adType,
			game_id: this.gameId
		})

		this.initData = res.data;
		this.createCtx();
	}

	private async createCtx() {
		if (!this.initData) {
			return uni.showToast({
				title: "初始化数据不存在"
			})
		}
		uni.showLoading({
			title: '广告数据加载中',
			mask: true
		})

		this.adCtx = uni.createRewardedVideoAd(this.initData);
		this.adCtx.onError((err) => {
			console.log(err)
			uni.hideLoading()
			feedbackLog({
				event: "adInitError",
				memo: "广告初始化失败",
				data: JSON.stringify(err)
			});
			uni.showToast({
				icon: 'none',
				title: "广告加载失败，请稍后再试"
			})
		})
		this.adCtx.onLoad(() => {
			uni.hideLoading()
			if (this.adCtx) {
				this.adCtx.show();
			}
		})

		this.adCtx.onClose((res) => {
			if (this.onClose) {
				this.onClose(res);
			}
		})
	}



}