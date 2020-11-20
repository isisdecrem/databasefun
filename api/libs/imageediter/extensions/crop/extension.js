import Extension from '../extension.js';

const config = {
	author: "Jared Lera"
	, email: "jared@qoom.io"
	, domain: "jared.qoom.io"
	, name: "Crop"
	, description: "This extension will allow a user to crop an image"
	, version: "0.0.1"
	, buttonIcon:'crop/crop.svg'
	, settings:'crop/settings.html'
};

let $div; // SELECTION DIV
let ismousedown = false;
let startpos = {}

class cropExtension extends Extension {
	
	destroy() {
		// REMOVE THE DIV
		if($div) $div.parentElement.removeChild($div);
		$div = undefined;
	}

	imagemousedown(e) {
		if(!super.imagemousedown(e)) return;
		ismousedown = true;
		// REMOVE THE DIV
		if($div) $div.parentElement.removeChild($div);
		
		// CREATE DIV
		$div = document.createElement('div');
		
		// GIVE THE DIV AN ID
		$div.id = 'cropdiv';
		
		// STYLE THE DIV
		$div.style.width = '2px';
		$div.style.height = '2px';
		$div.style.border = 'solid 1px red';
		
		// POSITION THE DIV
		const canvasposition = this.canvas.getBoundingClientRect();   // GETTING THE POSITION OF THE CANVAS
		$div.style.position = 'absolute';
		$div.style.top = (e.clientY - canvasposition.top) + 'px';	  // SUBTRACTING THE POSITION OF THE CANVAS FROM THE POSTION OF THE MOUSE CLICK
		$div.style.left  = (e.clientX - canvasposition.left) + 'px';
		startpos.x = (e.clientX - canvasposition.left)
		startpos.y = (e.clientY - canvasposition.top)
		startpos.offsetx = canvasposition.left;
		startpos.offsety = canvasposition.top;
		
		// ADD MOUSE EVENT LISTENERS ON DIV
		const self = this;
		$div.addEventListener('mouseup', function(e) {
			self.imagemouseup(e);
		})
		$div.addEventListener('mousedown', function(e) {
			self.imagemousedown(e);
		})
		$div.addEventListener('mousemove', function(e) {
			self.imagemousemove(e);
		})
		
		// PUT THE DIV WITH THE CANVAS
		this.canvas.parentElement.appendChild($div);		
	}
	
	imagemousemove(e) {
		if(!super.imagemousemove(e)) return;
		if(!ismousedown) return;
		if(!$div) return;
		
		
		let x = (e.clientX - startpos.offsetx);
		let y = (e.clientY - startpos.offsety);
		let w = x - startpos.x;
		let h = y - startpos.y;
		
		$div.style.width = w + 'px';
		$div.style.height = h + 'px';
		
	}
	
	imagemouseup(e) {
		if(!super.imagemouseup(e)) return;
		ismousedown = false;
		if(!$div) return;
	}
	
	imageclick(e) {
		if(!super.imageclick(e)) return;
		ismousedown = false;
	}
	
	select(e) {
		super.select(e);
		const cropButton = document.querySelector('#cropControls');
		const self = this;
		cropButton.addEventListener("click", function() {
			doCrop.call(self);
		});
	}
	
}

function doCrop() {
	const croppedImage = this.ctx.getImageData(this.x,this.y,this.w,this.h);
	this.$canvas.width = this.w;
	this.$canvas.height = this.h;
	this.putImageData(croppedImage, 0, 0);
	this.destroy();
}


const crop = new cropExtension(config);

export default crop;