class Voice {
  private static instance: Voice;

  // bgStatus: boolean = false;

  // btnStatus: boolean = false;

  btnVolume: number = 0.5;

  bgVolume: number = 0.5;

  private bgPlay: boolean = false;

  private btnCtx: UniNamespace.InnerAudioContext | PlusAudioAudioPlayer | null =
    null;

  private bgCtx: PlusAudioAudioPlayer | UniNamespace.InnerAudioContext | null =
    null;
  private constructor() {
    const localBgVol = uni.getStorageSync("bg_volume");
    if (typeof localBgVol === "number") {
      this.bgVolume = localBgVol;
    } else {
      this.bgVolume = 0.5;
    }

    const localBtnVol = uni.getStorageSync("btn_volume");
    if (typeof localBtnVol === "number") {
      this.btnVolume = localBtnVol;
    } else {
      this.btnVolume = 0.5;
    }
  }

  public static getInstance(): Voice {
    if (!Voice.instance) {
      Voice.instance = new Voice();
    }
    return Voice.instance;
  }

  stopBg() {
    this.bgCtx?.stop();
  }

  //@ts-ignore
  setBtnVolume(volume: number) {
    if (!this.btnCtx) return;
    volume = Number(volume.toFixed(2));
    //#ifdef APP
    const ctx = this.btnCtx as PlusAudioAudioPlayer;
    ctx.setStyles({ volume: volume });
    //#endif
    //#ifdef H5
    // const _ctx = ;
    (this.btnCtx as UniNamespace.InnerAudioContext).volume = volume;
    //#endif
    this.btnVolume = volume;
    uni.setStorageSync("btn_volume", volume);
  }

  //@ts-ignore
  setBgVolume(volume: number) {
    if (!this.bgCtx) return;
    volume = Number(volume.toFixed(2));
    //#ifdef APP
    const ctx = this.bgCtx as PlusAudioAudioPlayer;
    ctx.setStyles({ volume: volume });
    //#endif
    //#ifdef H5
    // const _ctx = ;
    (this.bgCtx as UniNamespace.InnerAudioContext).volume = volume;
    //#endif
    this.bgVolume = volume;
    uni.setStorageSync("bg_volume", volume);
  }
  playBg() {
    // return
    // console.log(1)
    // if (!this.bgStatus) return;
    if (!this.bgCtx) {
      //#ifdef APP
      this.bgCtx = plus.audio.createPlayer("/static/mp3/bg.mp3");
      this.bgCtx.setSessionCategory("ambient");
      this.bgCtx.setStyles({
        volume: this.bgVolume,
      });
      this.bgCtx.addEventListener("ended", () => {
        this.bgPlay = false;
        this.playBg();
      });
      this.bgCtx.addEventListener("stop", () => {
        this.bgPlay = false;
      });
      this.bgCtx.addEventListener("error", (e) => {
        this.bgPlay = false;
      });
      this.bgCtx.addEventListener("pause", () => {
        this.bgPlay = false;
      });

      //#endif
      //#ifdef H5
      this.bgCtx = uni.createInnerAudioContext();
      this.bgCtx.src = "/static/mp3/bg.mp3";
      this.bgCtx.loop = true;
      this.bgCtx.volume = this.bgVolume;
      //#endif
    }
    if (!this.bgPlay) {
      this.bgCtx?.play();
    }
  }

  /**播放按钮音效 */
  playBtnVoice() {
    // return
    if (!this.btnCtx) {
      //#ifdef H5
      this.btnCtx = uni.createInnerAudioContext();
      this.btnCtx.src = "/static/mp3/btn.mp3";
      this.btnCtx.volume = this.btnVolume;
      //#endif
      //#ifdef APP
      this.btnCtx = plus.audio.createPlayer("/static/mp3/btn.mp3");
      this.btnCtx.setSessionCategory("ambient");
      this.btnCtx.setStyles({
        volume: this.btnVolume,
      });
      //#endif
    }
    this.btnCtx.stop();
    this.btnCtx.play();
    if (!this.bgPlay) {
      this.playBg();
    }
  }
}

export default Voice.getInstance();
