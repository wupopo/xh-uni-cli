import {
  type CanvasItem,
  type ImageItem,
  ItemType,
  type RectItem,
  type TextItem,
} from "@/xh/constants/components/canvas.constant";
import { getFileLocalPathByUrl, uuid } from "@/xh/utils/tools";

export default class XhCanvas {
  data: CanvasItem[];

  canvasId: string;

  canvasCtx: UniNamespace.CanvasContext;

  imgSourceMap: Map<string, string> = new Map();

  sourceReady: boolean = false;

  onStartLoadSource: Function = () => {};

  onSourceReady: Function = () => {};

  defaultFontColor: string = "#000000";

  width?: number;

  height?: number;
  constructor(data: CanvasItem[], canvasId: string) {
    this.sourceReady = false;
    if (data.length < 1) {
      throw new Error("canvas data is empty");
    }
    this.data = data;
    this.canvasId = canvasId;
    this.canvasCtx = uni.createCanvasContext(canvasId);
    this.updateResource();
  }

  private async loadFont(font: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      uni.loadFontFace({
        source: font,
        family: "fonts",
        success: () => {
          resolve();
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }

  async updateResource() {
    this.onStartLoadSource();
    const images = [
      ...new Set(
        this.data.filter((v) => v.type == ItemType.IMG).map((v) => v.url)
      ),
    ];
    const imageUrls = await Promise.all(images.map(getFileLocalPathByUrl));
    this.imgSourceMap.clear();
    imageUrls.forEach((v, i) => this.imgSourceMap.set(images[i], v));

    // const texts=this.data.filter(v=>v.type==ItemType.TEXT);

    // const fonts=texts.filter(v=>v.fontFamily).map(v=>v.fontFamily||"");

    // await Promise.all(fonts.map(this.loadFont));
    this.sourceReady = true;
    this.onSourceReady();
  }

  async draw() {
    if (!this.sourceReady) {
      throw new Error("source not ready");
    }
    for (let item of this.data) {
      switch (item.type) {
        case ItemType.REACT:
          await this.fillRect(item);
          break;
        case ItemType.IMG:
          await this.drawImage(item);
          break;
        case ItemType.TEXT:
          this.fillText(item);
          break;
      }
    }
    this.canvasCtx.draw();
  }

  fillText(item: TextItem): Promise<void> {
    return new Promise((resolve, reject) => {
      this.canvasCtx.save();
      this.canvasCtx.setTextBaseline("top");
      if (item.fontFamily) {
        this.canvasCtx.font = `${item.fontSize}px ${item.fontFamily}`;
      } else {
        this.canvasCtx.font = `${item.fontSize}px Microsoft YaHei`;
      }
      this.canvasCtx.setFillStyle(item.color ?? this.defaultFontColor);
      this.canvasCtx.fillText(item.text, item.x, item.y);
      this.canvasCtx.restore();
      resolve();
    });
  }

  fillRect(item: RectItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const radius = item.radius ?? 0;
      this.canvasCtx.save();
      this.canvasCtx.setFillStyle("rgba(0,0,0,0)");
      this.canvasCtx.beginPath();

      this.canvasCtx.moveTo(item.x + radius, item.y);

      this.canvasCtx.lineTo(item.x + item.width - radius, item.y);

      this.canvasCtx.quadraticCurveTo(
        item.x + item.width,
        item.y,
        item.x + item.width,
        item.y + radius
      );

      this.canvasCtx.lineTo(item.x + item.width, item.y + item.height - radius);

      this.canvasCtx.quadraticCurveTo(
        item.x + item.width,
        item.y + item.height,
        item.x + item.width - radius,
        item.y + item.height
      );

      this.canvasCtx.lineTo(item.x + radius, item.y + item.height);

      this.canvasCtx.quadraticCurveTo(
        item.x,
        item.y + item.height,
        item.x,
        item.y + item.height - radius
      );

      this.canvasCtx.lineTo(item.x, item.y + radius);

      this.canvasCtx.quadraticCurveTo(item.x, item.y, item.x + radius, item.y);

      this.canvasCtx.lineTo(item.x + radius, item.y);

      this.canvasCtx.closePath();

      this.canvasCtx.clip();

      this.canvasCtx.rect(item.x, item.y, item.width, item.height);

      if (item.bgColor) {
        this.canvasCtx.setFillStyle(item.bgColor);
        this.canvasCtx.fill();
      }
      this.canvasCtx.restore();
      resolve();
    });
  }

  drawImage(item: ImageItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const radius = item.radius ?? 0;
      this.canvasCtx.save();
      this.canvasCtx.setFillStyle("rgba(0,0,0,0)");
      this.canvasCtx.beginPath();

      this.canvasCtx.moveTo(item.x + radius, item.y);

      this.canvasCtx.lineTo(item.x + item.width - radius, item.y);

      this.canvasCtx.quadraticCurveTo(
        item.x + item.width,
        item.y,
        item.x + item.width,
        item.y + radius
      );

      this.canvasCtx.lineTo(item.x + item.width, item.y + item.height - radius);

      this.canvasCtx.quadraticCurveTo(
        item.x + item.width,
        item.y + item.height,
        item.x + item.width - radius,
        item.y + item.height
      );

      this.canvasCtx.lineTo(item.x + radius, item.y + item.height);

      this.canvasCtx.quadraticCurveTo(
        item.x,
        item.y + item.height,
        item.x,
        item.y + item.height - radius
      );

      this.canvasCtx.lineTo(item.x, item.y + radius);

      this.canvasCtx.quadraticCurveTo(item.x, item.y, item.x + radius, item.y);

      this.canvasCtx.lineTo(item.x + radius, item.y);

      this.canvasCtx.closePath();

      this.canvasCtx.clip();

      const dataUrl = this.imgSourceMap.get(item.url);
      if (dataUrl) {
        this.canvasCtx.drawImage(
          dataUrl,
          item.x,
          item.y,
          item.width,
          item.height
        );
      }
      this.canvasCtx.restore();
      resolve();
    });
  }

  updateCanvasSize() {
    const widths = this.data
      .filter((v) => v.type != ItemType.TEXT)
      .map((v) => v.width + v.x);
    const heights = this.data
      .filter((v) => v.type != ItemType.TEXT)
      .map((v) => v.height + v.y);
    this.width = Math.max(...widths);
    this.height = Math.max(...heights);
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    return {
      width: this.width,
      height: this.height,
    };
  }
}
