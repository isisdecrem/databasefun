import {buildEditorUrl, states} from '/libs/editer/fileexplorer/utils.js';

const openEditorFile = async (fileInfo) => {
	const editorUrl = buildEditorUrl(fileInfo);
	const container = document.getElementsByClassName('fileexplorer-editors-container')[0];
	
	const iframes = document.getElementsByClassName('fileexplorer-editor');
	for (const iframe of iframes) {
		// console.log(iframe.src, editorUrl);
		if (iframe.src === editorUrl) {
			iframe.style.display = 'block';
			states.fileStates[editorUrl] = true;
		} else {
			iframe.style.display = 'none';
			states.fileStates[iframe.src] = false;
		}
	}
	
	
	if (!states.fileStates[editorUrl]) {
		states.fileStates[editorUrl] = true;
		states.fileInfos[editorUrl] = fileInfo;
		const iframe = document.createElement('iframe');
		iframe.frameBorder = "0"
		iframe.src = editorUrl;
		iframe.classList.add('fileexplorer-editor');
		container.appendChild(iframe);
		iframe.style.display = 'none';
		iframe.addEventListener('load', () => {
			iframe.style.display = 'block';
			iframe.contentWindow.addEventListener('click', () => {
				window.dispatchEvent(new Event('click'));	
			});
			iframe.contentWindow.addEventListener('contextmenu', () => {
				window.dispatchEvent(new Event('contextmenu'));	
			});
		});
	}
}

export default openEditorFile;