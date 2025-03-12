import { Plugin } from "vite";
import path from "path";
import { initVueStyles, updateCssFile } from "./tools";


global.lastBuildtime=Date.now()-1000*60;
global.building=false;
export default function stylePlugin(): Plugin {
  return {
    name: "stylePlugin",
    buildStart(ctx){   
      const nowTime = Date.now(); 
      if ((nowTime - global.lastBuildtime) < 1000|| global.building) return; 
      global.lastBuildtime = nowTime;
      return initVueStyles(); 
    },
  
    async configureServer(server) {
      const dirPath = path.join(__dirname, "../../src");
      server.watcher.add(dirPath).on("change", (filePath: string) => {
        if (!filePath.endsWith(".vue")) return;
        updateCssFile(filePath);
      });
    },
  };
}
