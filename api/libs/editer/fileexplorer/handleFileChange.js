import renderSidebar from '/libs/editer/fileexplorer/renderSidebar.js';
import openEditorFile from '/libs/editer/fileexplorer/openEditorFile.js';
import refreshTabsBar from '/libs/editer/fileexplorer/refreshTabsBar.js';
import {updateUrlBar} from '/libs/editer/fileexplorer/utils.js';



async function handleFileChange(fileInfo) {
	console.log(fileInfo);
	if (!fileInfo.folderPath && /(\.api|\.app)$/.test(fileInfo.fileName)) {
		fileInfo.folderPath = fileInfo.fileName.substring(0, fileInfo.fileName.length-4);
	}
	await Promise.all([renderSidebar(fileInfo), openEditorFile(fileInfo), refreshTabsBar(fileInfo), updateUrlBar(fileInfo)]);
}


export default handleFileChange;