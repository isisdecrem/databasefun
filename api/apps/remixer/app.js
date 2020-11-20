const appName = 'remix';

let webcloner, saver, restricter;

const initialize = () => {
	webcloner = require('../webcloner/app');
	saver = require('../saver/app');
	renderer = require('../renderer/app');
	restricter = require('../restricter/app');
	restricter.initialize();
	saver.initialize();
	renderer.initialize();
	webcloner.initialize();
}


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}



const remixClone = async (domain, remixUrl, remixAppName) => {
	console.log('in remixer');
	console.log(domain, remixUrl, remixAppName)
	const files = await webcloner.cloneAndSave({
		url: remixUrl,
		fullDir: '/tmp' + '/' + create_UUID() + '/' + remixAppName.replace(' ', '-'),
		appName: remixAppName.replace(' ', '-'),
		sameDomainOnly: true,
		removeAllQoomSticker: true,
		domain
	}, (msg) => {
		console.log("webclone: ", msg);
	})
}



module.exports = {
	appName, initialize, remixClone
}