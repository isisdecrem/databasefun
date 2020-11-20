import {main} from '/libs/cloner/clonerui/clonerui.js';

const sleep = (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const injectClonerUiWindow = async (node, folder, member, version) => {
	if (document.getElementsByClassName("cloner-ui-overlay").length > 0) return;
	const resp = await fetch('/libs/cloner/clonerui/clonerui.html');
	const mainDivHTML = await resp.text();
	const template = document.createElement('template');
	template.innerHTML = mainDivHTML.trim();
	const child = template.content.firstChild;
	child.style.display = 'none';
	node.appendChild(child);
	const ioScriptSrc = '/libs/socketio.js';
	const ioScript = document.createElement('script');
	ioScript.src = ioScriptSrc;
	node.appendChild(ioScript);
	main(child, folder, member, version).then();
}



const removeClonerUiWindow = async () => {
	const overlays = document.getElementsByClassName("cloner-ui-overlay");
	for (const overlay of overlays) {
		overlay.parentNode.removeChild(overlay);
	}
}


export {
	injectClonerUiWindow,
	removeClonerUiWindow
}