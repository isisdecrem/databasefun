import {states, getFolderFiles, fileToFilepath, processFolderPath} from '/libs/editer/fileexplorer/utils.js';
import handleFileChange from '/libs/editer/fileexplorer/handleFileChange.js';
import createContextMenu from '/libs/editer/fileexplorer/createContextMenu.js';




export const renderFolder = async (fileInfo, element, folderstructure, layer=0, prevFolderPath='/') => {
	for (const folderName in folderstructure.folders) {
		const folderDiv = document.createElement('div');
		const currentFolderPath = prevFolderPath + '/' + folderName;
		folderDiv.classList.add('fileexplorer-files-folder');
		
		if (states.folderStates[currentFolderPath] === null || states.folderStates[currentFolderPath] === undefined) {
			states.folderStates[currentFolderPath] = false;
		}
		
		
		folderDiv.innerHTML = `
			<p class="fileexplorer-files-folder-text no-select">${folderName}</p>
			<div class="fileexplorer-files-folder-open-indicator-container">
				<i class="${states.folderStates[currentFolderPath] ? 'ic-chevron-down' : 'ic-chevron-up'} fileexplorer-files-folder-open-indicator"></i>
			</div>
		`.trim();
		element.appendChild(folderDiv);
		folderDiv.style.paddingLeft = `calc(${window.getComputedStyle(folderDiv).getPropertyValue('padding-left') || '0em'} + ${layer}em)`;
		folderDiv.addEventListener('click', () => {
			states.folderStates[currentFolderPath] = !states.folderStates[currentFolderPath];
			renderSidebar(fileInfo);
		})
		folderDiv.addEventListener('contextmenu', e => {
			const folderInfo = {
				folderName: folderName,
				folderStructure: folderstructure.folders[folderName],
				folderPath: currentFolderPath,
			};
			createContextMenu(e, null, folderInfo);
		})
		if (states.folderStates[currentFolderPath]) {
			await renderFolder(fileInfo, element, folderstructure.folders[folderName], layer+1, currentFolderPath);
		}
	}
	
	folderstructure.files.sort((a, b) => a.name.localeCompare(b.name));
	
	for (const file of folderstructure.files) {
		if (file.name === '__hidden') continue;
		console.log(file);
		const fileDiv = document.createElement('div');
		fileDiv.classList.add('fileexplorer-files-file');
		fileDiv.innerHTML = `<p class="no-select">${file.name}</p>`.trim();
		(fileInfo.filePath === fileToFilepath(file)) && (fileDiv.classList.add('fileexplorer-files-selected-file'));
		fileDiv.addEventListener('click', () => {
			const newFileInfo = {
				...fileInfo,
				filePath: fileToFilepath(file),
				fileName: file.name,
				folderPath: file.directory || ''
			};
			handleFileChange(newFileInfo);
		});
		// console.log(fileDiv.style.paddingLeft);
		element.appendChild(fileDiv);
		console.log(window.getComputedStyle(fileDiv).getPropertyValue('padding-left'));
		fileDiv.style.paddingLeft = `calc(${window.getComputedStyle(fileDiv).getPropertyValue('padding-left') || '0em'} + ${layer}em)`;
		fileDiv.addEventListener('contextmenu', (e) => {
			createContextMenu(e, file);
		})
	}
}

const renderSidebar = async (fileInfo=states.currentFileInfo, refreshStructure=false) => {
	const folderstructure = (!states.pastFolderStructure || refreshStructure) ? await getFolderFiles(states.ogFileInfo) : states.pastFolderStructure;
	states.pastFolderStructure = folderstructure;
	states.currentFileInfo = fileInfo;
	const fileexplorerFilesDivs = document.getElementsByClassName('fileexplorer-files');
	for (const div of fileexplorerFilesDivs) {
		div.innerHTML = '';
		const rootFolderPath = processFolderPath(states.ogFileInfo.folderPath);
		div.addEventListener('contextmenu', e => {
			const folderInfo = {
				folderName: rootFolderPath.substring(rootFolderPath.lastIndexOf('/')+1),
				folderStructure: folderstructure,
				folderPath: rootFolderPath,
			};
			createContextMenu(e, null, folderInfo);
		});
		renderFolder(fileInfo, div, folderstructure, 0, rootFolderPath);
	}
}


export default renderSidebar;