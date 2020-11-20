import {main} from '/libs/migrater/explorer-git-integration/overlay.js';


const sleep = (ms) => {
	return new Promise(r => setTimeout(r, ms));
}

const injectGitIntegrationOverlayWindow = async (node, getNewDirectoryFunction, options) => {
	if (document.getElementById("gitIntegrationOverlayWindow")) return;
	const resp = await fetch('/libs/migrater/explorer-git-integration/overlay.html');
	const mainDivHTML = await resp.text();
	const template = document.createElement('template');
	template.innerHTML = mainDivHTML.trim();
	const child = template.content.firstChild;
	node.appendChild(child);
	main(child, getNewDirectoryFunction, options).then();
}



const removeGitIntegrationOverlayWindow = async () => {
	const overlay = document.getElementById("gitIntegrationOverlayWindow");
	overlay.parentNode.removeChild(overlay);
}





export {
	injectGitIntegrationOverlayWindow,
	removeGitIntegrationOverlayWindow
}