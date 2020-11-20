import Extension from '../extension.js';
import Cropper from './cropper.js';

const config = {
	author: "Jared Lera"
	, email: "jared@wisen.space"
	, domain: "jared.qoom.io"
	, name: "Rotate"
	, settings: 'rotate/settings.html'
	, description: "This extension will allow a user to click on an image and rotate it"
	, version: "0.0.1"
	, buttonIcon: 'rotate/buttonicon.svg'
	, profile: 'https://intern.qoom.io/imageediter/extensions/rotate/duck.jpeg'
}

function undo() {
	alert('undo')
}

function redo() {
	alert('redo')
}

class Rotate extends Extension {
	
	imageclick(e) {
		if(!super.imageclick(e)) return;
	}
	
	destroy() {
		super.destroy();
		window.removeEventListener('undo', undo)
		window.removeEventListener('redo', redo)
		
		
		this.$canvas.style.display = 'block';
		if(this.cropper) {
			this.cropper.destroy();
		}
	}
	
	select(e) {
		// Calls the parent function to inject the settings html into the setting panel
		super.select(e); 
		
		const input = document.querySelector('#rotate-controls input')
			, buttons = document.querySelectorAll('#rotate-controls button')
			, resetButton = document.querySelector('#rotate-reset button')
			, self = this
			, $canvas = this.$canvas
		;
		
		this.cropper = new Cropper($canvas, {
			zoomable: false, autoCropArea: 1, background: false
		})
		
		function rotate() {
			const angle = parseInt(input.value);
			if(!isNaN(angle) && angle <= 360 && angle >= -360) {
				self.cropper.rotateTo(input.value)
			}
		}
		
		function reset() {
			self.cropper.reset();
		}
		
		// Bind the event listeners to the buttons on the settings panel
		buttons.forEach(button => {
			button.addEventListener('click', () => {
				const angle = parseInt(button.textContent);
				if(!isNaN(angle)) {
					input.value = angle;
					rotate();
				}
				
				const action = button.getAttribute('action')
					, cropperData = self.cropper.getData(true)
					, croppedCanvas = self.cropper.getCroppedCanvas()
				;

				switch(action) {
					case 'flipX':
						self.cropper.scale(-1*cropperData.scaleX, cropperData.scaleY);
						break;
					case 'flipY':
						self.cropper.scale(cropperData.scaleX, -1*cropperData.scaleY);
						break;
					case 'crop':
						let format = ['jpeg', 'jpg'].includes(location.pathname.split('?')[0].split('.').reverse()[0])
								? 'image/jpeg' : 'image/png'
							, croppedImage = croppedCanvas.toDataURL(format)
							, img = new Image()
						;
						img.src = croppedImage;
						$canvas.width = croppedCanvas.width;
						$canvas.height = croppedCanvas.height;
						$canvas.getContext('2d').drawImage(img, 0, 0, $canvas.width, $canvas.height);
						self.cropper.destroy();
						self.cropper = new Cropper($canvas, {
							zoomable: false, autoCropArea: 1, background: false
						})
						break;
				}
			});
		});
		resetButton.addEventListener('click', reset)
		
		
		input.addEventListener('keyup', rotate);
		
		$canvas.style.display = 'none';
		this.cropper.clear();
		
		window.addEventListener('undo', undo)
		window.addEventListener('redo', redo)
	}
	
	
	
}

const rotate = new Rotate(config);

export default rotate;