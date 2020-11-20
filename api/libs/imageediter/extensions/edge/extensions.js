import Extension from '../extension.js';

const config = {
	author: "Shengkai Jiang"
	, email: "shengkai555@gmail.com"
	, domain: "shengkai.qoom.io"
	, name: "blur"
	, description: "blur an image"
	, version: "0.0.1"
	, buttonIcon:'edge/buttonicon.svg'
	, settings:'edge/settings.html'
	, profile:''
};

class settingsExtension extends Extension {

	
	imageclick(e) {
		if(!super.imageclick(e)) return;
	}
	
	select(e) {
		super.select(e);
		document.getElementById('heightInput').value = image.height;
		document.getElementById('widthInput').value = image.width;
	}
	
}

function makeCopy (){
	
}
	


const settings = new settingsExtension(config);

export default settings;