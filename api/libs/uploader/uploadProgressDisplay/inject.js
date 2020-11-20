import {main} from '/libs/uploader/uploadProgressDisplay/progressDisplay.js';

const sleep = (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const injectUploaderProgressDisplay = async (node) => {
	if (document.getElementById("uploaderProgressDisplay")) return;
	const resp = await fetch('/libs/uploader/uploadProgressDisplay/progressDisplay.html');
	const mainDivHTML = await resp.text();
	const template = document.createElement('template');
	template.innerHTML = mainDivHTML.trim();
	const child = template.content.firstChild;
	node.appendChild(child);
	await sleep(200);
	main().then();
}



const removeUploaderProgressDisplay = async () => {
	const overlay = document.getElementById("uploaderProgressDisplay");
	overlay.parentNode.removeChild(overlay);
}


export {
	removeUploaderProgressDisplay,
	injectUploaderProgressDisplay
}