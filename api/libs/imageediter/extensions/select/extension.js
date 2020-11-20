import Extension from "../extension.js";
import * as wasm from "./wasm/image_select.js";
import wasm_init from "./wasm/image_select.js";
import "https://cdn.jsdelivr.net/npm/vue@2.6.11";
import "https://unpkg.com/vuetify@2.2.20/dist/vuetify.js";
const config = {
    author: "Tong Miao",
    email: "tonymiaotong@tioft.tech",
    domain: "tongmiao.cloud",
    name: "select",
    description: "This extension will provide a selection of the image as a array of indices for the R value of the image data",
    version: "0.0.1",
    buttonIcon: "select/buttonicon.svg",
    settings: "select/settings.html",
};
class SelectExtension extends Extension {
    mainSelect(e) {
        console.log("draw");
        const box = this.$canvas.getBoundingClientRect();
        let x = e.clientX - box.left;
        let y = e.clientY - box.top;
        x /= this.scale / 100;
        y /= this.scale / 100;
        const mainctx = this.$canvas.getContext("2d");
        const imageData = mainctx.getImageData(0, 0, this.$canvas.width, this.$canvas.height);
        const pointsOnEdge = wasm.flood_fill_get_border(x, y, this.selectSettings.tolerance ** 2, imageData.data, imageData.data.length, imageData.width, imageData.height);
        const pointsInRegion = wasm.flood_fill_get_region(x, y, this.selectSettings.tolerance ** 2, imageData.data, imageData.data.length, imageData.width, imageData.height);
        const overlayGenerationCanvas = document.createElement("canvas");
        overlayGenerationCanvas.height = this.$canvas.height;
        overlayGenerationCanvas.width = this.$canvas.width;
        const ctx = overlayGenerationCanvas.getContext("2d");
        const overlayImageData = ctx.getImageData(0, 0, overlayGenerationCanvas.width, overlayGenerationCanvas.height);
        for (let i = 0; i < pointsOnEdge.length; i++) {
            const index = pointsOnEdge[i];
            overlayImageData.data[index] = 0;
            overlayImageData.data[index + 1] = 255;
            overlayImageData.data[index + 2] = 0;
            overlayImageData.data[index + 3] = 255;
        }
        ctx.putImageData(overlayImageData, 0, 0);
        const image = overlayGenerationCanvas.toDataURL("image/png");
        this.overlayImageData.imgUrl = image;
        this.redrawOverlay();
        this.selectedRegionBounds = pointsOnEdge;
        this.selectedRegion = pointsInRegion;
    }
    redrawOverlay() {
        var _a;
        const canvasContainer = document.getElementById("canvasContainer");
        if (!this.$canvas || !((_a = this.overlayImageData) === null || _a === void 0 ? void 0 : _a.imgUrl) || !canvasContainer)
            return;
        let selectionOverlay = document.getElementById("selectionOverlay");
        const rect = canvasContainer.getBoundingClientRect();
        if (!selectionOverlay) {
            selectionOverlay = document.createElement("img");
            selectionOverlay.id = "selectionOverlay";
            canvasContainer.appendChild(selectionOverlay);
            selectionOverlay.style.pointerEvents = "none";
            selectionOverlay.style.position = "absolute";
            selectionOverlay.style.top = 0 + "px";
            selectionOverlay.style.left = 0 + "px";
            selectionOverlay.style.width = "100%";
            selectionOverlay.style.height = "100%";
        }
        selectionOverlay.src = this.overlayImageData.imgUrl;
    }
    async onload($container, options) {
        await super.onload($container, options);
        this.overlayImageData = {
            imgUrl: "",
        };
        this.selectSettings = {
            tolerance: 50,
        };
        await wasm_init();
    }
    select(e) {
        super.select(e);
        console.log("select");
        this.settingsDiv = document.querySelector("#selectSettingsDiv");
        this.vueApp = new Vue({
            el: this.settingsDiv,
            vuetify: new Vuetify({
                theme: {
                    dark: true,
                },
            }),
            data: {
                selectSettings: this.selectSettings,
                display: "none",
            },
            mounted: function () {
                this.$nextTick(() => {
                    const self = this;
                    self.display = "flex";
                });
            },
        });
    }
    imageclick(e) {
        if (!super.imageclick(e)) {
            return false;
        }
        console.log(this);
        console.log("click");
        this.mainSelect(e);
        return true;
    }
}
export { SelectExtension };
export default new SelectExtension(config);
