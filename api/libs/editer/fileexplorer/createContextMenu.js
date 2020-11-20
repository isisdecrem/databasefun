import {fileToFilepath, getAbsolutePath} from '/libs/editer/fileexplorer/utils.js';
import {openCreateNewFileDialogue, openDeleteFileDialogue, openCreateNewFolderDialogue, openDeleteFolderDialogue} from '/libs/editer/fileexplorer/fsChanges.js';

const createFileMenus = async (menu, file) => {
	const copyFileNameButton = document.createElement('div');
	copyFileNameButton.classList.add('fileexplorer-context-menu-button');
	copyFileNameButton.addEventListener('click', async e => {
		await navigator.clipboard.writeText(file.name);
	});
	copyFileNameButton.innerText = `Copy File Name`.trim();
	menu.appendChild(copyFileNameButton);


	const copyFilepathButton = document.createElement('div');
	copyFilepathButton.classList.add('fileexplorer-context-menu-button');
	copyFilepathButton.addEventListener('click', async e => {
		await navigator.clipboard.writeText(fileToFilepath(file));
	});
	copyFilepathButton.innerText = `Copy File Path`.trim();
	menu.appendChild(copyFilepathButton);
	
	
	const copyFileViewURLButton = document.createElement('div');
	copyFileViewURLButton.classList.add('fileexplorer-context-menu-button');
	copyFileViewURLButton.addEventListener('click', async e => {
		await navigator.clipboard.writeText(getAbsolutePath('/' + fileToFilepath(file)));
	});
	copyFileViewURLButton.innerText = `Copy File View URL`.trim();
	menu.appendChild(copyFileViewURLButton);
	
	
	const copyFileEditURLButton = document.createElement('div');
	copyFileEditURLButton.classList.add('fileexplorer-context-menu-button');
	copyFileEditURLButton.addEventListener('click', async e => {
		await navigator.clipboard.writeText(getAbsolutePath('/edit2/' + fileToFilepath(file)));
	});
	copyFileEditURLButton.innerText = `Copy File Edit URL`.trim();
	menu.appendChild(copyFileEditURLButton);
	
	
	const deleteFileButton = document.createElement('div');
	deleteFileButton.classList.add('fileexplorer-context-menu-button');
	deleteFileButton.addEventListener('click', async e => {
		await openDeleteFileDialogue(file);
	});
	deleteFileButton.innerText = `Delete File`.trim();
	menu.appendChild(deleteFileButton);
}


const createFolderMenus = async (menu, folder) => {
	const copyFolderNameButton = document.createElement('div');
	copyFolderNameButton.classList.add('fileexplorer-context-menu-button');
	copyFolderNameButton.addEventListener('click', async e => {
		await navigator.clipboard.writeText(folder.folderName);
	});
	copyFolderNameButton.innerText = `Copy Folder Name`.trim();
	menu.appendChild(copyFolderNameButton);
	
	
	const copyFolderPathButton = document.createElement('div');
	copyFolderPathButton.classList.add('fileexplorer-context-menu-button');
	copyFolderPathButton.addEventListener('click', async e => {
		await navigator.clipboard.writeText(folder.folderPath);
	});
	copyFolderPathButton.innerText = `Copy Folder Path`.trim();
	menu.appendChild(copyFolderPathButton);
	
	const createNewFileButton = document.createElement('div');
	createNewFileButton.classList.add('fileexplorer-context-menu-button');
	createNewFileButton.addEventListener('click', async e => {
		await openCreateNewFileDialogue(folder.folderPath);
	});
	createNewFileButton.innerText = `Create New File`.trim();
	menu.appendChild(createNewFileButton);
	
	const createNewFolderButton = document.createElement('div');
	createNewFolderButton.classList.add('fileexplorer-context-menu-button');
	createNewFolderButton.addEventListener('click', async e => {
		await openCreateNewFolderDialogue(folder.folderPath);
	});
	createNewFolderButton.innerText = `Create New Folder`.trim();
	menu.appendChild(createNewFolderButton);
	
	
	const deleteFolderButton = document.createElement('div');
	deleteFolderButton.classList.add('fileexplorer-context-menu-button');
	deleteFolderButton.addEventListener('click', async e => {
		await openDeleteFolderDialogue(folder.folderPath);
	});
	deleteFolderButton.innerText = `Delete Folder`.trim();
	menu.appendChild(deleteFolderButton);
}


const addGeneralInteractionEventHandling = async (menu) => {
	menu.addEventListener('click', e => {
		e.preventDefault();
		e.stopPropagation();
	})
	
	for (const button of menu.querySelectorAll('.fileexplorer-context-menu-button')) {
		button.addEventListener('click', e => {
			menu.remove();
		})
	}
	
	window.addEventListener('click', e => {
		menu.remove();
	})
	window.addEventListener('contextmenu', e => {
		menu.remove();
	})
}


const createContextMenu = async (e, file=null, folder=null) => {
	const {x, y} = e;
	e.preventDefault();
	e.stopPropagation();
	window.dispatchEvent(new Event('contextmenu'));
	const menu = document.createElement('div');
	menu.classList.add('fileexplorer-context-menu');
	menu.style.top = `${y}px`;
	menu.style.left = `${x}px`;
	if (file) await createFileMenus(menu, file);
	if (folder) await createFolderMenus(menu, folder);
	document.body.appendChild(menu);
	await addGeneralInteractionEventHandling(menu);
}

export default createContextMenu;