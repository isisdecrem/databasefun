import Extension from '../extension.js';

const config = {
	author:"Zora Zhang"
	, email:"zorazrr@gmail.com"
	, domain: "zorazrr.cloud"
	, name: "Gradient Effect"
	, description: "Creates a gradient color effect on image"
	, version: "0.0.1"
	, buttonIcon: 'gradient/gradient.svg'
	, settings: 'gradient/settings.html'
}

class Gradient extends Extension {
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
		// NEED TO PUT THIS CODE BACK IN, IT'S JUST THAT THE ERRORS ARE ANNOYING
		// var p = {x: (e.x - canvasPosition.x) * (4 ** ((100/scal) - 1)), y:(e.y -canvasPosition.y) * (4 ** ((100/scal) - 1))};
		// console.log({scale: scal, px: p.x, py: p.y, cx: canvasPosition.x, cy: canvasPosition.y, width: wd, height: ht, cw: canvasPosition.width, ch: canvasPosition.height});
		const grad = document.createElement('div');
		this.$canvas.parentElement.appendChild(grad);
		grad.style.top = e.x + 'px';
		grad.style.left = e.y + 'px';
		grad.style.width = wd + 'px';
		grad.style.height = ht + 'px';
		grad.style.position = 'absolute';
	}
}

const gradient = new Gradient(config);

export default gradient;