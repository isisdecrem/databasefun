import {states, buildEditorUrl} from '/libs/editer/fileexplorer/utils.js';
import handleFileChange from '/libs/editer/fileexplorer/handleFileChange.js';



const closeTab = async (fileInfo) => {
	const editorUrl = buildEditorUrl(fileInfo);
	let lastFileState = null;
	if(states.fileStates[editorUrl]) {
		states.fileStates[editorUrl] = null;
		for (const url in states.fileStates) {
			console.log(url, states.fileStates[url]);
			if (states.fileStates[url] !== null && states.fileStates[url] !== undefined) {
				lastFileState = url;
			}
		}
	}
	states.fileStates[editorUrl] = null;
	
	
	for (const iframe of document.getElementsByClassName('fileexplorer-editor')) {
		if (iframe.src === editorUrl) {
			iframe.remove();
		}
	}
	for (const tab of document.getElementsByClassName('fileexplorer-editor-tab')) {
		if (tab.getAttribute('data-editor-url') === editorUrl) {
			tab.remove();
		}
	}
	
	console.log(lastFileState);

	lastFileState && handleFileChange(states.fileInfos[lastFileState]);
	
}



const refreshTabsBar = async (fileInfo) => {
	const tabsBar = document.getElementsByClassName('fileexplorer-editor-tabs')[0];
	const tabs = document.getElementsByClassName('fileexplorer-editor-tab');
	const urls = [];
	const url = buildEditorUrl(fileInfo);
	for (const tab of tabs) {
		const editorUrl = tab.getAttribute('data-editor-url');
		urls.push(editorUrl);
		if (editorUrl !== url) {
			tab.classList.remove('fileexplorer-editor-active-tab');
		} else {
			tab.classList.add('fileexplorer-editor-active-tab');	
		}
	}
	if (!urls.includes(url)) {
		const tab = document.createElement('div');
		tab.setAttribute('data-editor-url', url);
		tab.classList.add('fileexplorer-editor-active-tab');
		tab.classList.add('fileexplorer-editor-tab');
		tab.innerHTML = `
			<p class="fileexplorer-editor-tab-text no-select">${fileInfo.fileName}</p>
		`.trim();
		const tabCloseButton = document.createElement('span');
		tabCloseButton.innerHTML = `
			<i class="ic-cancel fileexplorer-editor-tab-close-button-icon"></i>
		`.trim();
		tabCloseButton.classList.add('fileexplorer-editor-tab-close-button');
		tabCloseButton.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			closeTab(fileInfo);
		})
		tab.appendChild(tabCloseButton);
		tabsBar.appendChild(tab);
		tab.addEventListener('click', () => {
			handleFileChange(fileInfo);
		})
	}
}


export default refreshTabsBar;
export {closeTab};