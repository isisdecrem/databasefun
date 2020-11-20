import Extension from '../extension.js';

const config = {
	author: "Shengkai Jiang"
	, email: "shengkai555@gmail.com"
	, domain: "shengkai.qoom.io"
	, name: "edge"
	, description: "blur an image"
	, version: "0.0.1"
	, buttonIcon:'edge/buttonicon.svg'
	, settings:'edge/settings.html'
	, profile:'https://shengkai.qoom.io/imageediter/extensions/shapes/penguin.gif'
};

function edge(ext, kernel, count){
	// this.$canvas.style.filter = 'blur(20px)';
	const ctx = ext.$canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, ext.$canvas.width, ext.$canvas.height);
    const newImageData = new ImageData(imageData.width, imageData.height);
    const radius = 1;
    const width = imageData.width;
    const start = performance.now();
    // const count = (2*radius + 1)**2;
    for(let i = 0; i < imageData.data.length; i += 4) {
    	var red = 0;
    	var green = 0;
    	var blue = 0;
    	var alpha = 0;
    	
    	var r = (width*radius + radius)*4;
    	if(i < r) {
    		alpha = 0;
    	} else if(i >= imageData.data.length - r) {
    		alpha = 0;
    	} else {
    	
        	for(var row = -radius; row <= radius; row += 1) {
        		for(var cell = -radius; cell <= radius; cell += 1) {
        			
        			const j4 = (row*width + cell)*4;
        			const dx = cell + radius;
        			const dy = row + radius;
        			red += kernel[dx][dy]*imageData.data[i + j4];
        			green += kernel[dx][dy]*imageData.data[i + j4 + 1];
        			blue += kernel[dx][dy]*imageData.data[i + j4 + 2]*4;
        			alpha += kernel[dx][dy]*imageData.data[i + j4 + 3];
        		}
        	}
    		
    		red /= count;
    		green /= count;
    		blue /= count;
    		alpha /= count;
    	}
    	newImageData.data[i] = parseInt(red);
    	newImageData.data[i + 1] = parseInt(green);
    	newImageData.data[i + 2] = parseInt(blue);
    	newImageData.data[i + 3] = imageData.data[i+3];
    	
    	// imageData.data[i] = Math.round(255 - imageData.data[i]);
    }
    const end = performance.now();
    console.log((end - start)/1000);
    console.log(imageData.data.length);
    ext.putImageData(newImageData, 0, 0);
}

class edgeExtension extends Extension {
	imageclick(e) {
		if(!super.imageclick(e)) return;
	}
	
	button1(){
		const kernel = [[1,0,-1],[0,0,0],[-1,0,1]];
		edge(this, kernel, 1);
	}
	
	button4(){
		const kernel = [[0,-1,0],[-1,4,-1],[0,-1,0]];
		edge(this, kernel, 1);
	}
	
	button8(){
		const kernel = [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]];
		edge(this, kernel, 1);
	}
	
	select(e) {
		super.select(e);
		const button1 = document.getElementById('button1');
		const button4 = document.getElementById('button4');
		const button8 = document.getElementById('button8');
		button1.addEventListener('click', () => this.button1() );
		button4.addEventListener('click', () => this.button4() );
		button8.addEventListener('click', () => this.button8() );
	}
	
}

const blur = new edgeExtension(config);

export default blur;