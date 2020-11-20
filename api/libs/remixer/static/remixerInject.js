import {main} from '/libs/remixer/static/remixer.js';

const sleep = (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const injectRemixerUiWindow = async (node, remixUrl, remixAppName) => {
	if (document.getElementsByClassName("remixer-overlay").length > 0) return;
	const resp = await fetch('/libs/remixer/static/remixer1.html');
	const mainDivHTML = await resp.text();
	const template = document.createElement('template');
	template.innerHTML = mainDivHTML.trim();
	const child = template.content.firstChild;
	const ioScriptSrc = '/libs/socketio.js';
	const ioScript = document.createElement('script');
	ioScript.src = ioScriptSrc;
	node.appendChild(ioScript);
	node.appendChild(child);
	main(child, remixUrl, remixAppName).then();
}



const removeRemixerUiWindow = async () => {
	const overlays = document.getElementsByClassName("remixer-overlay");
	for (const overlay of overlays) {
		overlay.parentNode.removeChild(overlay);
	}
}


export {
	injectRemixerUiWindow,
	removeRemixerUiWindow
}