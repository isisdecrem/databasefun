import Extension from '../extension.js';

const config = {
	author: "Evan Li"
	, email: "evanlicubs@gmail.com"
	, domain: "evan.wizardcreator.com"
	, name: "Text"
	, description: "This extension will allow a user to click on an image and write text on it"
	, version: "0.0.1"
	, buttonIcon:'text/buttonicon.svg'
	, settings:'text/settings.html'
};

class textExtension extends Extension {

	
	imageclick(e) {
		if(!super.imageclick(e)) return;
		
		const clearText = document.querySelector('#clearText');
		if(clearText.checked) {
			return;
		}
		
		var textColor = document.querySelector('#textColor').value
		
		const text = document.querySelector('#textInput').value;
		var width = document.querySelector('#textWidth').value;
		
		var canvasPosition = this.$canvas.getBoundingClientRect();
		
		
		let mouseX = event.clientX - canvasPosition.x;
		let mouseY = event.clientY - canvasPosition.y;
		const self = this;
		
		// Generating Text
		const textDiv = document.createElement('div');
		this.$canvas.parentElement.appendChild(textDiv);
		const textBlock = document.createElement('h1');
		textDiv.style.top = mouseY + 'px';
		textDiv.style.left = mouseX + 'px';
		textDiv.style.position = 'absolute';
		if(textColor === '') {
			textColor = 'white';
		}
		textDiv.style.color = textColor;
		textDiv.appendChild(textBlock);
		if(width === '') {
			width = 40;
		}
		textBlock.style.fontSize = width + 'px';
		textBlock.innerHTML = text;
		
		textDiv.addEventListener('click',function(e){
			self.textClicked(e);
		});
		
	}
	
	// Clearing Text
	textClicked(e) {
		const clearText = document.querySelector('#clearText');
		if(clearText.checked) {
			e.target.parentElement.removeChild(e.target);
		}
	}
	
	select(e) {
		super.select(e);
		
	}
	
}

	


const text = new textExtension(config);

export default text;