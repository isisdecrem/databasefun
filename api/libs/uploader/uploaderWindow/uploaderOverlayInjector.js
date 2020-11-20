import {main} from '/libs/uploader/uploaderWindow/overlay.js';
import {injectUploaderProgressDisplay} from '/libs/uploader/uploadProgressDisplay/inject.js';


const sleep = (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const injectUploaderOverlayWindow = async (node, getFolderFunction) => {
	if (document.getElementById("uploaderOverlayWindow")) return;
	const resp = await fetch('/libs/uploader/uploaderWindow/overlay.html');
	const mainDivHTML = await resp.text();
	const template = document.createElement('template');
	template.innerHTML = mainDivHTML.trim();
	const child = template.content.firstChild;
	node.appendChild(child);
	await sleep(200);
	injectUploaderProgressDisplay(node).then();
	main(getFolderFunction).then();
}



const removeUploaderOverlayWindow = async () => {
	const overlay = document.getElementById("uploaderOverlayWindow");
	overlay.parentNode.removeChild(overlay);
}





export {
	injectUploaderOverlayWindow,
	removeUploaderOverlayWindow
}