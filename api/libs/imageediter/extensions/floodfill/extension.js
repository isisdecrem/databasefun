import Extension from "../extension.js";
import * as wasm from "./wasm/flood_fill.js";
import wasm_init from "./wasm/flood_fill.js";
import "https://cdn.jsdelivr.net/npm/vue@2.6.11";
import "https://unpkg.com/vuetify@2.2.20/dist/vuetify.js";
const config = {
    author: "Tong Miao",
    email: "tonymiaotong@tioft.tech",
    domain: "tongmiao.cloud",
    name: "Flood Fill",
    description: "This extension will allow a user to click on part of a image and fill it in",
    version: "0.0.1",
    buttonIcon: "floodfill/buttonicon.svg",
    settings: "floodfill/settings.html",
    profile: "/libs/imageediter/extensions/floodfill/avatar.jpg",
};
class FloodFillExtension extends Extension {
    mainFill(e) {
        var _a, _b;
        const box = this.canvas.getBoundingClientRect();
        let x = e.clientX - box.left;
        let y = e.clientY - box.top;
        x /= this.scale / 100;
        y /= this.scale / 100;
        const floodFillSettings = this.floodFillSettings;
        const ctx = this.canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        if ((_a = this.otherFloodFillSettings) === null || _a === void 0 ? void 0 : _a.createSelection) {
            const pointsOnEdge = wasm.flood_fill_get_border(x, y, floodFillSettings.tolerence ** 2, imageData.data, imageData.data.length, imageData.width, imageData.height);
            console.log(pointsOnEdge);
            const overlayGenerationCanvas = document.createElement("canvas");
            overlayGenerationCanvas.height = this.canvas.height;
            overlayGenerationCanvas.width = this.canvas.width;
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
            console.log(image);
            this.overlayImageData.imgUrl = image;
            this.redrawOverlay();
            return;
        }
        if ((_b = this.otherFloodFillSettings) === null || _b === void 0 ? void 0 : _b.variance) {
            wasm.flood_fill_variance(x, y, floodFillSettings.tolerence ** 2, imageData.data, imageData.data, imageData.data.length, imageData.width, imageData.height, floodFillSettings.r, floodFillSettings.g, floodFillSettings.b, floodFillSettings.a);
        }
        else {
            wasm.flood_fill(x, y, floodFillSettings.tolerence ** 2, imageData.data, imageData.data, imageData.data.length, imageData.width, imageData.height, floodFillSettings.r, floodFillSettings.g, floodFillSettings.b, floodFillSettings.a);
        }
        ctx.putImageData(imageData, 0, 0);
    }
    redrawOverlay() {
        var _a;
        const canvasContainer = document.getElementById("canvasContainer");
        if (!this.canvas || !((_a = this.overlayImageData) === null || _a === void 0 ? void 0 : _a.imgUrl) || !canvasContainer)
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
    changeSettings(extension) {
        return (settings) => {
            extension.floodFillSettings = settings;
        };
    }
    initFloodFillSettings() {
        this.floodFillSettings = {
            r: 255,
            g: 255,
            b: 255,
            a: 255,
            tolerence: 50,
        };
        this.otherFloodFillSettings = {
            variance: true,
            createSelection: false,
        };
        this.overlayImageData = {
            imgUrl: "",
        };
    }
    select(e) {
        super.select(e);
        this.settingsDiv = document.querySelector("#floodFillSettingsDiv");
        this.vueApp = new Vue({
            el: this.settingsDiv,
            vuetify: new Vuetify({
                theme: {
                    dark: true,
                },
            }),
            data: {
                floodFillSettings: this.floodFillSettings,
                otherFloodFillSettings: this.otherFloodFillSettings,
                display: "none",
                pastSettings: [],
            },
            mounted: function () {
                this.loadPastSettings();
                this.$nextTick(() => {
                    const self = this;
                    self.display = "flex";
                });
            },
            methods: {
                capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                },
                savePastSettings() {
                    window.localStorage.setItem("floodFillPastSettings", btoa(JSON.stringify(this.pastSettings)));
                },
                loadPastSettings() {
                    const pastSettings = window.localStorage.getItem("floodFillPastSettings");
                    try {
                        if (pastSettings) {
                            this.pastSettings = JSON.parse(atob(pastSettings));
                        }
                    }
                    catch (e) { }
                },
                getValidationRules(setting) {
                    const rgbInputRules = [
                        (v) => {
                            const parsed = parseInt(v);
                            return ((parsed > -1 && parsed < 256) ||
                                "Value must be an integer between 0 and 255");
                        },
                    ];
                    const toleranceInputRules = [
                        (v) => {
                            const parsed = parseInt(v);
                            return (parsed > -1 ||
                                "Value must be an integer above 0");
                        },
                    ];
                    return ["r", "g", "b"].includes(setting)
                        ? rgbInputRules
                        : toleranceInputRules;
                },
                getColor(setting) {
                    switch (setting) {
                        case "r":
                            return "red";
                        case "g":
                            return "green";
                        case "b":
                            return "blue";
                        default:
                            return "purple";
                    }
                },
                getHexColor(setting) {
                    switch (setting) {
                        case "r":
                            return "#F44336";
                        case "g":
                            return "#4CAF50";
                        case "b":
                            return "#2196F3";
                        default:
                            return "#9C27B0";
                    }
                },
                changeFloodFillSettings(settings) {
                    Object.assign(this.floodFillSettings, settings);
                },
                rgbToHex(r, g, b) {
                    return ("#" +
                        [r, g, b]
                            .map((x) => {
                            const hex = x.toString(16);
                            return hex.length === 1 ? "0" + hex : hex;
                        })
                            .join(""));
                },
                saveFloodFillSettings() {
                    const settings = this.floodFillSettings;
                    this.pastSettings.unshift({ ...settings });
                    this.pastSettings.length > 5 &&
                        this.pastSettings.pop();
                    this.savePastSettings(this.pastSettings);
                },
            },
            computed: {
                rColor: function () {
                    return {
                        color: `rgb(${this.floodFillSettings.r}, 0, 0)`,
                    };
                },
                gColor: function () {
                    return {
                        color: `rgb(0, ${this.floodFillSettings.g}, 0)`,
                    };
                },
                bColor: function () {
                    return {
                        color: `rgb(0, 0, ${this.floodFillSettings.b})`,
                    };
                },
                allColor: function () {
                    return {
                        color: `rgb(${this.floodFillSettings.r}, ${this.floodFillSettings.g}, ${this.floodFillSettings.b})`,
                    };
                },
            },
            watch: {},
        });
    }
    async onload($container, options) {
        this.canvas = this.$canvas;
        super.onload($container, options);
        await wasm_init();
        const css = document.createElement("link");
        css.href = "/libs/imageediter/vuetify.css";
        css.rel = "stylesheet";
        document.body.appendChild(css);
        const iconStyles = document.createElement("link");
        iconStyles.rel = "stylesheet";
        iconStyles.href =
            "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css";
        document.body.appendChild(iconStyles);
        this.initFloodFillSettings();
    }
    imageclick(e) {
        if (!super.imageclick(e)) {
            return false;
        }
        this.mainFill(e);
        return true;
    }
}
const floodFill = new FloodFillExtension(config);
export default floodFill;
