import Extension from '../extension.js';

const config = {
	author:"Zora Zhang"
	, email:"zorazrr@gmail.com"
	, domain: "zorazrr.cloud"
	, name: "Replace Color"
	, description: "Replace a color in an image with another color"
	, version: "0.0.1"
	, buttonIcon: 'replace/replace.svg'
	, settings: 'replace/settings.html'
}

class Replace extends Extension {
	select(e){
		super.select(e);
		var col = document.getElementById("inputcolor");
		var tol = document.getElementById("inputtolerance");
		
		this.myColor = "#000000";
		this.tolerance = 100;
		const self = this;
		
		col.addEventListener('change', (e) => {
			self.myColor = col.value;
			document.getElementById("yourColor").style.backgroundColor=this.myColor;
			console.log(self.myColor);
		})
		
		tol.addEventListener('change', (e) => {
			self.tolerance = tol.value;
			console.log(self.tolerance);
		})
	}
	
	imageclick(e) {
		if(!super.imageclick(e)) return;

		const context = this.$canvas.getContext('2d');
		const wd = this.$canvas.width;
		const ht = this.$canvas.height;
		var scal = this.scale;
		const tol = this.tolerance;
		const imgData = context.getImageData(0,0,wd,ht);
		var canvasPosition = this.$canvas.getBoundingClientRect();
		var p = {x: (e.x - canvasPosition.x) * (4 ** ((100/scal) - 1)), y:(e.y -canvasPosition.y) * (4 ** ((100/scal) - 1))};
		console.log({scale: scal, px: p.x, py: p.y, cx: canvasPosition.x, cy: canvasPosition.y, width: wd, height: ht, cw: canvasPosition.width, ch: canvasPosition.height});
	
		const variance = document.querySelector('#variance');
	
		function hexToRgb(hex) {
			hex = hex.replace("#", "");
		    var bigint = parseInt(hex, 16);
		    var r = (bigint >> 16) & 255;
		    var g = (bigint >> 8) & 255;
		    var b = bigint & 255;
		    return {r,g,b};
		}
		
		var myColor = hexToRgb(this.myColor);

		function getColor(index){
			const r = imgData.data[index];
			const g = imgData.data[index+ 1];
			const b = imgData.data[index + 2];
			return {r,g,b};
		}
		
		function setColor(p){
			imgData.data[i] = myColor.r;
			imgData.data[i+1] = myColor.g;
			imgData.data[i+2] = myColor.b;
		}
		
		function setVarianceColor(p){
			imgData.data[i] = myColor.r + (pointColor.r - imgData.data[i])*2;
			imgData.data[i+1] = myColor.g + (pointColor.g - imgData.data[i+1])*2;
			imgData.data[i+2] = myColor.b + (pointColor.b - imgData.data[i+2])*2;
		}
		
		function withinTolerance(pixel){
			const dist = (pixel.r - pointColor.r)**2 + (pixel.g - pointColor.g)**2 + (pixel.b - pointColor.b)**2;
			return dist < (tol * 5);
		}
		
		const index = (((imgData.width * p.y) + p.x) * 4);
		const pointColor = getColor(index);
		document.getElementById("selectedColor").style.backgroundColor="rgb(" + pointColor.r + ", " + pointColor.g + ", " + pointColor.b + ")";
		var i = 0;
		for(i; i < imgData.data.length; i+=4){
			var pixelColor = getColor(i);
			if (withinTolerance(pixelColor)){
				if(variance.checked) {
					setVarianceColor(i);
				}
				else {
					setColor(i);
				}
			}
		}
		context.putImageData(imgData, 0, 0);
	}
}

const replace = new Replace(config);

export default replace;