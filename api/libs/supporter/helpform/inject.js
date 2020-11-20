import {main} from '/libs/supporter/helpform/overlay.js';


const sleep = (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const injectHelpFormOverlayWindow = async (node, getNewDirectoryFunction, options) => {
	console.log(12);
	if (document.getElementById("help-form-overlay-window")) return;
	const resp = await fetch('/libs/supporter/helpform/overlay.html');
	const mainDivHTML = await resp.text();
	const template = document.createElement('template');
	template.innerHTML = mainDivHTML.trim();
	const child = template.content.firstChild;
	node.appendChild(child);
	main(child).then();
}



const removeHelpFormOverlayWindow = async () => {
	const overlay = document.getElementById("help-form-overlay-window");
	overlay.parentNode.removeChild(overlay);
}





export {
	injectHelpFormOverlayWindow,
	removeHelpFormOverlayWindow
}