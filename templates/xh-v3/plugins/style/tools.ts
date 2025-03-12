import fs from "fs";
import path from "path";
import * as glob from "glob";

export function initVueStyles():Promise<void> {
  console.log('----样式全局扫描中----')
  return new Promise((resolve, reject) => {
    const basePath = path.join(__dirname, "../../src");
    const files = glob.globSync("**/*.vue", { cwd: basePath });
    let cssMaps = {};
    for (const fileItem of files) {
      const localPath = path.join(basePath, fileItem); 
      let vueText = fs.readFileSync(localPath, "utf-8");
      const cssMap = getCssByContent(vueText);
      cssMaps = Object.assign(cssMaps, cssMap);
    }
    const scssPath = path.join(__dirname, "../../src/xh/styles/_global.scss");
    const file = fs.createWriteStream(scssPath, "utf-8");
    file.write(`//${new Date().toLocaleString()}\n`);
    file.end(() => {
      insertCssToFile(cssMaps).then(resolve)
    });
  });
}

function getClassNamesByContent(content: string): string[] {
  const extendRegex = /\.(.*?)\{/g;
  let extendMatch: RegExpExecArray | null = null;
  let classNames: string[] = [];
  while ((extendMatch = extendRegex.exec(content)) !== null) {
    classNames.push(extendMatch[1].replace(/\./g, "").trim());
  }
  return classNames; 
}

function insertCssToFile(cssMap: Record<string, string>):Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const scssPath = path.join(__dirname, "../../src/xh/styles/_global.scss");
    let scssContent = fs.readFileSync(scssPath, "utf-8");
    const hasClassNames = getClassNamesByContent(scssContent);
    for (let key in cssMap) { 
      const value = cssMap[key];
      if (!hasClassNames.includes(key)) {
        scssContent += `\n${value}\n`;
      }
    }
    const saveFile = fs.createWriteStream(scssPath);
    saveFile.write(scssContent);
    saveFile.end(()=>{
      resolve();
      global.building=false
    });
  });
}

export function updateCssFile(filePath: string) {
  let vueText = fs.readFileSync(filePath, "utf-8");
  const cssMap = getCssByContent(vueText);
  insertCssToFile(cssMap);
}

export function getCssByContent(content: string): Record<string, string> {
  const classList = getDomClassNames(content);
  const mapSource: Record<string, string> = {};
  for (let className of classList) {
    const data = getCssByClassName(className);
    if (data) {
      mapSource[className] = data;
    }
  }
  return mapSource;
}

export function getDomClassNames(domStr: string): string[] {
  const classRegex = /\sclass=["']([^"']+)["']/g;
  let match: RegExpExecArray | null = null;
  let classNames: string[] = [];
  while ((match = classRegex.exec(domStr)) !== null) {
    classNames = [...classNames, ...match[1].split(" ")];
  }
  classNames = classNames.filter((item) => !!item);

  const extendRegex = /@extend\s+(.*?)\;/g;
  let extendMatch: RegExpExecArray | null = null;
  while ((extendMatch = extendRegex.exec(domStr)) !== null) {
    classNames.push(...extendMatch[1].replace(/\./g, "").split(","));
  }
  return [...new Set(classNames)].map(v=>v.trim());
}

export function getCssByClassName(className: string) {
  const paddingAndMarginRegex = /^[pm][alrtb]{1,2}-\d+$/;
  //间距样式
  if (paddingAndMarginRegex.test(className)) {
    return getPaddingAndMargin(className);
  }
  //弹性样式
  if (className.startsWith("flex")) {
    return getFlex(className);
  }

  //字体大小
  if (/^font-size-\d+$/.test(className)) {
    return getTextSize(className);
  }
  return "";
}

function getTextSize(className: string) {
  let num = className.split("-")[2];
  if (!num) return ""; 
  return `.${className}{font-size:${Number(num)*2}rpx;}`;
}

function getFlex(className: string) {
  switch (className) {
    case "flex":
      return `.flex{display: flex;}`;
    case "flex-dir-col":
      return `.flex-dir-col{flex-direction: column;display: flex;}`;
    case "flex-dir-row":
      return `.flex-dir-row{flex-direction: row;display: flex;}`;
    case "flex-js-sb":
      return `.flex-js-sb{justify-content: space-between;display: flex;}`;
    case "flex-ai-center":
      return `.flex-ai-center{align-items: center;display: flex;}`;
    case "flex-ai-start":
      return `.flex-ai-start{align-items: flex-start;display: flex;}`;
    case "flex-ai-end":
      return `.flex-ai-end{align-items: flex-end;display: flex;}`;
    case "flex-js-start":
      return `.flex-js-start{justify-content: flex-start;display: flex;}`;
    case "flex-js-end":
      return `.flex-js-end{justify-content: flex-end;display: flex;}`;
    case "flex-1":
      return `.flex-1{flex: 1;}`;
    case "flex-center":
      return `.flex-center{justify-content: center;align-items: center;display: flex;}`;
    default:
      return ``;
  }
}

export function getPaddingAndMargin(className: string) {
  let styleKey = className.startsWith("p") ? "padding" : "margin";
  let num = className.split("-")[1];
  if (!num) return "";
  const dirsMap = {
    a: "",
    l: "-left",
    r: "-right",
    t: "-top",
    b: "-bottom",
  };

  const dir = className[1];
  if (!Object.keys(dirsMap).includes(dir)) return "";
  if(className[2]=='-'){
    return `.${className}{${styleKey}${dirsMap[dir]}:${Number(num) * 2}rpx;}`;
  }else{
    const dir2=className[2]
    return `.${className}{${styleKey}${dirsMap[dir]}:${Number(num) * 2}rpx;${styleKey}${dirsMap[dir2]}:${Number(num) * 2}rpx;}`;
  }
}

