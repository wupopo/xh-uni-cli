import { defineStore } from "pinia";

export default defineStore('app',{
	state() {
		return {
			showLogin: true,
		};
	},
	actions: {
		setShowLogin(value : boolean) {
			this.showLogin = value;
		}
	}
});