import Extension from '../extension.js';

const config = {
	author: "Jenny Liu"
	, email: "yajingjenny@gmail.com"
	, domain: "jenny.qoom.io"
	, name: "sharpen"
	, description: "This extension will allow a user to get info about the image"
	, version: "0.0.1"
	, buttonIcon:'sharpen/buttonicon.svg'
	, settings:'sharpen/settings.html'
	, profile:'https://i.pinimg.com/originals/d0/03/5b/d0035b04c563ead9000b2456ee99f910.jpg'
};
const radius = 1;
const sigma = radius/3;
function G(x, y) {
	const c = 1/(2*Math.PI*sigma**2)
		, ex = -1*(x**2 + y**2)/(2*sigma**2)
		, e = Math.exp(ex);
	return c*e;
}

function sharpenImage(ext, kernel, count) {
	const ctx = ext.$canvas.getContext('2d');
	const imageData = ctx.getImageData(0, 0, ext.$canvas.width, ext.$canvas.height);
	const newImageData = new ImageData(imageData.width, imageData.height);
	const start = performance.now();
	//const blur = [[1,2,1],[2,4,2],[1,2,1]];
	const rw = kernel;
	const gw = kernel;
	const bw = kernel;
	const rcount = count; //(2*radius + 1)**2;
	const gcount = count;
	const bcount = count;
	const width = imageData.width;
	const r = (width*radius + radius)*4;
	// looping through each pixel
	for(let i = 0; i < imageData.data.length; i += 4) {
		
		var red = 0;
		var green = 0;
		var blue = 0;
		var alpha = 0;
		
		if(i < r) {
			alpha = 0;
		} else if(i > imageData.data.length - r) {
			alpha = 0;
		} else {
		
			// looping through each row
			for(var row = -radius; row <= radius; row += 1) {	
				// looping through each cell
				for(var cell = -radius; cell <= radius; cell += 1) {
					const j4 = (row*width + cell)*4;
					const dx = cell + radius;
					const dy = row + radius;
					red += rw[dx][dy]*imageData.data[i + j4];
					green += gw[dx][dy]*imageData.data[i + j4 + 1];
					blue += bw[dx][dy]*imageData.data[i + j4 + 2];
					// alpha += w[dx][dy]*imageData.data[i + j4 + 3];
				}
			}
			red /= rcount;
			green /= gcount;
			blue /= bcount;
			// alpha /= count;
		}
		newImageData.data[i] = parseInt(red);
		newImageData.data[i + 1] = parseInt(green);
		newImageData.data[i + 2] = parseInt(blue);
		newImageData.data[i + 3] = imageData.data[i + 3];
		
	//	imageData.data[i] = Math.round(imageData.data[i]);
	}
	const end = performance.now();
	console.log("Time Took:", (end - start)/1000);
	console.log("Size:", imageData.data.length);
	ext.putImageData(newImageData, 0, 0);
	
}

class sharpenExtension extends Extension {
	
	imageclick(e) {
		if(!super.imageclick(e)) return;
		//this.$canvas.style.filter = 'blur(20px)';
	}
	sharpenall(){
		const kernel = [[-1,-1,-1],[-1,9,-1],[-1,-1,-1]];
		sharpenImage(this, kernel, 1);
	}
	sharpenx(){
		const kernel = [[0,-1,0],[-1,5,-1],[0,-1,0]];
		sharpenImage(this, kernel, 1);
	}
	
	select(e) {
		super.select(e);
		const allButton = document.getElementById('all');
		const xButton = document.getElementById('x');
		allButton.addEventListener('click', () => this.sharpenall());
		xButton.addEventListener('click', () => this.sharpenx())
	}
}

const sharpen = new sharpenExtension(config);

export default sharpen;