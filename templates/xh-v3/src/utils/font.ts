export function loadFont(name: string) {
  return new Promise((resolve, reject) => {
    let url = `/static/fonts/${name}.ttf`;
    //#ifdef APP
    url = plus.io.convertLocalFileSystemURL(`_www/static/fonts/${name}.ttf`);
    //#endif
    uni.loadFontFace({
      global: true,
      family: name,
      source: `url(${url})`,
      complete: () => {
        const paths = uni.getStorageSync("fontLoaded") || [];
        if (!paths.includes(name)) {
          paths.push(name);
          uni.setStorageSync("fontLoaded", paths);
        }
        resolve(name);
      },
    });
  });
}
