import Extension from '../extension.js';

const config = {
	author: "Shengkai Jiang"
	, email: "none"
	, domain: "shengkai.qoom.io"
	, name: "Shape"
	, description: "This extension will allow a user to click on an image and add shapes to it"
	, version: "0.0.1"
	, buttonIcon:'shapes/buttonicon.svg'
	, settings:'shapes/settings.html'
	, profile:'https://shengkai.qoom.io/imageediter/extensions/shapes/penguin.gif'
};

class shapeExtension extends Extension {

	
	imageclick(e) {
		var self = this;
		if(!super.imageclick(e)) return;
		const clearShape = document.querySelector('#clearShape');
		if(clearShape.checked) {
			return;
		}
		
		var shapeColor = document.querySelector('#shapeColor').value;
		var width = document.querySelector('#shapeWidth').value;
		
		var shapes = {Square:'<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ width +'" viewBox="0 0 24 24" fill="none" stroke="'+ shapeColor +'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>', Circle:'<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ width +'" viewBox="0 0 24 24" fill="none" stroke="'+ shapeColor +'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>', Octogon:'<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ width +'" viewBox="0 0 24 24" fill="none" stroke="'+ shapeColor +'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon></svg>', Hexagon:'<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ width +'" viewBox="0 0 24 24" fill="none" stroke="'+ shapeColor +'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 4.9V17L12 22l-9-4.9V7z"/></svg>', Heart:'<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ width +'" viewBox="0 0 24 24" fill="none" stroke="'+ shapeColor +'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', Triangle:'<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ width +'" viewBox="0 0 24 24" fill="none" stroke="'+ shapeColor +'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18L12 4z"/></svg>'};

		const shape = shapes[document.querySelector('#shapess').value];
		
		var canvasPosition = this.$canvas.getBoundingClientRect();
		
		// Generating Shape
		const shapeDiv = document.createElement('div');
		this.$canvas.parentElement.appendChild(shapeDiv);
		const shapeBlock = document.createElement('h1');
		shapeDiv.style.top = 50 + 'px';
		shapeDiv.style.left = 50 + 'px';
		shapeDiv.style.position = 'absolute';
		if(shapeColor === '') {
			shapeColor = '#ffffff';
		}
		shapeDiv.style.color = shapeColor;
		shapeDiv.appendChild(shapeBlock);
		if(shapeWidth === '') {
			width = 40;
		}
		shapeBlock.style.fontSize = width + 'px';
		shapeBlock.innerHTML = shape;
		shapeDiv.addEventListener('click',function(e){
			self.shapeClicked(e, shapeDiv, shapeBlock);
		});
		dragElement(shapeDiv);
		shapeDiv.style.color = shapeColor;
		shapeDiv.style.fontSize = width + 'px';
	}
		
	// Clearing Shape
	shapeClicked(e, shapeDiv, shapeBlock) {
		const clearShape = document.querySelector('#clearShape');
		if(clearShape.checked) {
			e.target.parentElement.removeChild(e.target);
		}
		var shapeColor = document.querySelector('#shapeColor').value;
		var width = document.querySelector('#shapeWidth').value;
		shapeDiv.querySelector('svg').setAttribute('stroke', shapeColor);
		shapeDiv.querySelector('svg').setAttribute('width', width);
		shapeDiv.querySelector('svg').setAttribute('height', width);
	}
	
	select(e) {
		super.select(e);
		
	}
	
}


function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt)) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt).onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    document.onmouseup = closeDragElement;
	    // call a function whenever the cursor moves:
	    document.onmousemove = elementDrag;
	  }
	
	function elementDrag(e) {
	    e = e || window.event;
	    e.preventDefault();
	    // calculate the new cursor position:
	    pos1 = pos3 - e.clientX;
	    pos2 = pos4 - e.clientY;
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    // set the element's new position:
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	  }
	
	function closeDragElement() {
	    // stop moving when mouse button is released:
	    document.onmouseup = null;
	    document.onmousemove = null;
	}
}

const shape = new shapeExtension(config);

export default shape;