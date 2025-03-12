import { type Plugin, type App, type Component } from "vue";
import { createPinia } from "pinia";
import Router from "./router";
import useStore from "./store";


export default function XhPlugin(): Plugin {
  return {
    async install(app: App): Promise<void> {
      const pinia=createPinia();
      app.use(pinia);
    }
  };
}

export  {
  Router,
  useStore
}
