import Extension from '../extension.js';

const config = {
	author: "Jenny Liu"
	, email: "yajingjenny@gmail.com"
	, domain: "jenny.qoom.io"
	, name: "Settings"
	, description: "This extension will allow a user to get info about the image"
	, version: "0.0.1"
	, buttonIcon:'settings/buttonicon.svg'
	, settings:'settings/settings.html'
};

class settingsExtension extends Extension {

	
	imageclick(e) {
		if(!super.imageclick(e)) return;
	}
	
	select(e) {
		super.select(e);
		document.getElementById('heightInput').value = this.image.height;
		document.getElementById('widthInput').value = this.image.width;
	}
	
}

function makeCopy (){
	
}
	


const settings = new settingsExtension(config);

export default settings;