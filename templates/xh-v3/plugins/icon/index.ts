import { Plugin } from "vite";
import path from "path";
import fs from "fs";
function scanAllIcon() {
  const names = fs
    .readdirSync(path.join(__dirname, "../../src/static/icon"))
    .map((item) => {
      const lastIndex = item.lastIndexOf(".");
      const name = item.substring(0, lastIndex);
      return name;
    });
  updateIconList(names);
}

function updateIconList(names:string[]) {
  const fileDir = path.join(__dirname, "../../src/xh/constants/components");
  const file = path.join(fileDir, "icon.auto-build.ts");
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }
  const code=`export type XhIcon=${names.map(item=>`"${item}"`).join("|")};`
  const fileWrite = fs.createWriteStream(file, "utf-8");
  fileWrite.write(code);
  fileWrite.end();
}

export default function iconPlugin(): Plugin {
  return {
    name: "iconPlugin",
    configureServer(server) {
      scanAllIcon();
      const watcher = server.watcher.add(
        path.join(__dirname, "../../src/static/icon")
      );
      watcher.on("add", scanAllIcon);
      watcher.on("unlink", scanAllIcon);
    },
  };
}
