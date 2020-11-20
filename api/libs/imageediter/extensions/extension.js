const extensions = {};
let currentExtension = null;
class Extension {
    constructor(config) {
        if (!config.buttonIcon)
            throw new Error("Please provide a button icon");
        this.buttonIcon = new URL(`${location.origin}/libs/imageediter/extensions/${config.buttonIcon}`);
        this.$canvas = document.querySelector("canvas");
        this.ctx = this.$canvas.getContext('2d');
        this.name = config.name;
        this.config = config;
        this.$section = document.querySelector("section");
        this.$settings = this.$section;
        config.settings && (this.settings = config.settings);
    }
    getExtensions() {
        return extensions;
    }
    async onload($container, options) {
        Object.assign(this, options);
        const $button = document.createElement("button");
        $button.innerHTML = `<img src='${this.buttonIcon}'>`;
        $container.appendChild($button);
        $button.addEventListener("click", this.select.bind(this));
        const self = this;
        this.$canvas.addEventListener("click", function (e) {
            self.imageclick(e);
        });
        this.$canvas.addEventListener("mousedown", function (e) {
            self.imagemousedown(e);
        });
        this.$canvas.addEventListener("mousemove", function (e) {
            self.imagemousemove(e);
        });
        this.$canvas.addEventListener("mouseup", function (e) {
            self.imagemouseup(e);
        });
        
        if (this.settings) {
            fetch(`/imageediter/extensions/${this.settings}`)
                .then((res) => {
                return res.text();
            })
                .then((data) => {
                self.settingsHtml = data;
            });
        }
        extensions[this.name] = this;
    }
    select(e) {
        if(currentExtension && extensions[currentExtension]) 
        	extensions[currentExtension].destroy();
        currentExtension = this.name;
        if (!this.$settings)
            return;
        this.$settings.innerHTML = this.settingsHtml || "";
        this.config.author &&
            (this.$settings.innerHTML += `<p>Created By ${this.config.author}</p>`);
        this.config.profile &&
            (this.$settings.innerHTML += `<img id="profile" src="${this.config.profile}" />`);
    }
    
	imagemousedown(e) {
		if (this.name !== currentExtension)
            return false;
        return true;
	}
	
	imagemousemove(e) {
		if (this.name !== currentExtension)
            return false;
        return true;
	}
	
	imagemouseup(e) {
		if (this.name !== currentExtension)
            return false;
        return true;
	}    
    
    imageclick(e) {
        if (this.name !== currentExtension)
            return false;
        return true;
    }
    
    destroy() { }
    
    get scale() {
        var _a;
        return parseInt(((_a = document.getElementById("zoomlabel")) === null || _a === void 0 ? void 0 : _a.innerText) || "1");
    }
    
    putImageData(imgData,x,y) {
    	stack.push(imgData);
    	redoStack = [];
    	this.ctx.putImageData(imgData,0,0);
    }
}
export default Extension;