import Modal from '/libs/modal/script.js';

import { injectGitIntegrationOverlayWindow, removeGitIntegrationOverlayWindow } from "/libs/migrater/explorer-git-integration/inject.js";

const getFolderNameFunction = () => {
	return ('/' + window.getFolderPath()).replace(/\/$/, '');
}

function importGit() {
	injectGitIntegrationOverlayWindow(document.body, getFolderNameFunction);
}

function menuClick(menuItem, data) {

}

function createItem (creator) {
	creator.migrater = [
		{ text: 'Git Import', icon: 'ic-git-import', onclick: importGit  }
	]

}

function mutateTableRow (data) {
	return;
}

window.addEventListener('gitIntegrationDone', () => { 
	
});

window.addEventListener('startGitIntegration', (e) => {
	injectGitIntegrationOverlayWindow(document.body, getFolderNameFunction, e.detail);
})

export default { createItem, mutateTableRow }