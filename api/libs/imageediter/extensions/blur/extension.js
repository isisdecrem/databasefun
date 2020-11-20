import Extension from "../extension.js";
import init from "./wasm/image_blur.js";
import { boxBlur, gaussianBlur } from "./wasm/image_blur.js";
const config = {
    author: "Tong Miao",
    email: "tonymiaotong@tioft.tech",
    domain: "tongmiao.cloud",
    name: "blur",
    description: "An extension to blur image",
    version: "0.0.1",
    buttonIcon: "blur/buttonicon.svg",
    settings: "blur/settings.html",
};
var BlurType;
(function (BlurType) {
    BlurType[BlurType["box"] = 0] = "box";
    BlurType[BlurType["gaussian"] = 1] = "gaussian";
})(BlurType || (BlurType = {}));
class BlurExtension extends Extension {
    async onload($container, options) {
        await super.onload($container, options);
        await init();
    }
    imageclick(e) {
        if (!super.imageclick(e))
            return false;
        return true;
    }
    imageBlur(canvas, type) {
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return true;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const radius = 10;
        console.log(imageData.data);
        const start = performance.now();
        if (type === BlurType.box) {
            boxBlur(imageData.data, imageData.data.length, radius, imageData.width);
        }
        else if (type === BlurType.gaussian) {
            gaussianBlur(imageData.data, imageData.data.length, radius, imageData.width);
        }
        const end = performance.now();
        console.log("time:", (end - start) / 1000, "sec");
        console.log("size:", imageData.data.length);
        console.log(imageData.data);
        this.putImageData(imageData, 0, 0);
    }
    select(e) {
        super.select(e);
        this.blurDiv = document.querySelector("#blurDiv");
        console.log(this.blurDiv);
        this.vueApp = new Vue({
            el: this.blurDiv,
            vuetify: new Vuetify({
                theme: {
                    dark: true,
                },
            }),
            mounted: function () {
                this.$nextTick(() => {
                    const self = this;
                    self.display = "flex";
                });
            },
            data: {
                display: "none",
            },
            methods: {
                boxBlur: () => {
                    this.imageBlur(this.$canvas, BlurType.box);
                },
                gaussianBlur: () => {
                    this.imageBlur(this.$canvas, BlurType.gaussian);
                },
            },
        });
        console.log(this.vueApp);
    }
}
export default new BlurExtension(config);
