// import qrcode from "qrcode";
//@ts-ignore
import UQRCode from "../qrcode.js";

export function getQueryString(query: Record<string, string>) {
  return Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&");
}

function splitArray<T = any>(arr: T[], chunkSize: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  console.log(result)
  return result;
}

export function getQrcodeArr(text: string): Record<string,any>[][] {
  const qr = new UQRCode();
  qr.data = text;
  qr.make();
  return  qr.modules
}

export function gcd(a: number, b: number) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}


export function uuid(prixfix: string='xh-uid'):string{
  const str=new Array(3).fill('_').map(v=>Math.random().toString(36).substring(2, 8)).join('-')
  return prixfix + '-' + str
}


export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}

export function getFileLocalPathByUrl(url:string):Promise<string>{
  return new Promise((resolve, reject) => {
	//#ifdef APP
	if(!url.startsWith('http')){
		return resolve(url);
	}
	//#endif
    uni.downloadFile({
      url,
	
      success: (res) => {
		
        resolve(url);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}