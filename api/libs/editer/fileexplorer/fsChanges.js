import renderSidebar from '/libs/editer/fileexplorer/renderSidebar.js';
import {fileToFileInfo} from '/libs/editer/fileexplorer/utils.js';
import {closeTab} from '/libs/editer/fileexplorer/refreshTabsBar.js';

const createFile = async (filepath) => {
	await fetch(`/save?file=${filepath}`, {
	    credentials: "include",
	    headers: {
	        "content-type": "application/json",
	    },
	    method: "POST",
	});
}

const deleteFolder = async (folderPath) => {
	let fp = folderPath;
	if (fp.startsWith('/')) fp = fp.substring(1);
	await fetch(`/explore/folder?folder=${fp}`, {
	    credentials: "include",
	    headers: {
	        "content-type": "application/json",
	    },
	    "method": "DELETE",
	});
}

const deleteFile = async (fileId) => {
	await fetch(`/explore/${fileId}`, {
	    credentials: "include",
	    headers: {
	        "content-type": "application/json",
	    },
	    "method": "DELETE"
	});
}

const openCreateNewFileDialogue = async (folderPath) => {
	const createNewFileModal = document.createElement('div');
	createNewFileModal.classList.add('modal');
	createNewFileModal.innerHTML = `
		<div class="modal-title"><h1>Create New File</h1></div>
		<div class="container">
			<div class="modal-description">
                <p>Enter a file name to create.</p>
            </div>
            <div class="col-lg-12">
                <div class="form-input filepath">
                    <div class="locationForNewFileContainer"><p>${folderPath + '/'}</p></div>
                    <div id="newFileName" class="input-items default empty">
                        <input type="text" placeholder="fileName.extension" class='fileName' required>
                    </div>
                </div>
            </div>
            <div class="buttons-container">
                <button id="cancelBtn" class="qoom-main-btn qoom-button-outline qoom-button-small" type="cancel">Cancel</button>
                <button id="submitBtn" class="qoom-main-btn qoom-button-full qoom-button-small" type="submit" disabled>Create</button>
            </div>
        </div>
	`.trim();

	const fileNameInput = createNewFileModal.querySelector('.fileName');
	const submitBtn = createNewFileModal.querySelector('#submitBtn');
	fileNameInput.addEventListener('input', e => {
		submitBtn.disabled = (fileNameInput.value.length <= 0);
	})
	createNewFileModal.querySelector('#cancelBtn').addEventListener('click', e => {
		console.log('cancel');
		createNewFileModal.remove();
	});
	submitBtn.addEventListener('click', async e => {
		console.log('submit');
		const filePath = folderPath + '/' + fileNameInput.value;
		console.log(filePath);
		createNewFileModal.remove();
		await createFile(filePath);
		await renderSidebar(undefined, true);
	});
	document.body.appendChild(createNewFileModal);
}


const openCreateNewFolderDialogue = async (folderPath) => {
	const createNewFolderModal = document.createElement('div');
	createNewFolderModal.classList.add('modal');
	createNewFolderModal.innerHTML = `
		<div class="modal-title"><h1>Create New Folder</h1></div>
		<div class="container">
			<div class="modal-description">
                <p>Enter a folder name to create.</p>
            </div>
            <div class="col-lg-12">
                <div class="form-input folderpath">
                    <div class="locationForNewFileContainer"><p>${folderPath + '/'}</p></div>
                    <div id="newFileName" class="input-items default empty">
                        <input type="text" placeholder="folderName" class='folderName' required>
                    </div>
                </div>
            </div>
            <div class="buttons-container">
                <button id="cancelBtn" class="qoom-main-btn qoom-button-outline qoom-button-small" type="cancel">Cancel</button>
                <button id="submitBtn" class="qoom-main-btn qoom-button-full qoom-button-small" type="submit" disabled>Create</button>
            </div>
        </div>
	`.trim();

	const folderNameInput = createNewFolderModal.querySelector('.folderName');
	const submitBtn = createNewFolderModal.querySelector('#submitBtn');
	folderNameInput.addEventListener('input', e => {
		submitBtn.disabled = (folderNameInput.value.length <= 0);
	})
	createNewFolderModal.querySelector('#cancelBtn').addEventListener('click', e => {
		console.log('cancel');
		createNewFolderModal.remove();
	});
	submitBtn.addEventListener('click', async e => {
		console.log('submit');
		const filePath = folderPath + '/' + folderNameInput.value + '/';
		console.log(filePath);
		createNewFolderModal.remove();
		await createFile(filePath);
		await renderSidebar(undefined, true);
	});
	document.body.appendChild(createNewFolderModal);
}

const openDeleteFolderDialogue = async (folderPath) => {
	const deleteFolderModal = document.createElement('div');
	deleteFolderModal.classList.add('modal');
	deleteFolderModal.innerHTML = `
		<div class="modal-title"><h1>Delete Folder</h1></div>
		<div class="container">
			<div class="modal-description">
                <p>Are you sure you want to delete this folder?</p>
                <br />
                <p>${folderPath}</p>
            </div>
            <div class="buttons-container">
                <button id="cancelBtn" class="qoom-main-btn qoom-button-outline qoom-button-small" type="cancel">Cancel</button>
                <button id="submitBtn" class="qoom-main-btn qoom-button-full qoom-button-small" type="submit">Delete</button>
            </div>
        </div>
	`.trim();
	const submitBtn = deleteFolderModal.querySelector('#submitBtn');
	deleteFolderModal.querySelector('#cancelBtn').addEventListener('click', e => {
		console.log('cancel');
		deleteFolderModal.remove();
	});
	submitBtn.addEventListener('click', async e => {
		console.log('delete');
		deleteFolderModal.remove();
		await deleteFolder(folderPath);
		await renderSidebar(undefined, true)
	});
	document.body.appendChild(deleteFolderModal);
}

const openDeleteFileDialogue = async (file) => {
	const fileInfo = fileToFileInfo(file);
	const filePath = '/' + fileInfo.filePath;
	const deleteFileModal = document.createElement('div');
	deleteFileModal.classList.add('modal');
	deleteFileModal.innerHTML = `
		<div class="modal-title"><h1>Delete File</h1></div>
		<div class="container">
			<div class="modal-description">
                <p>Are you sure you want to delete this file?</p>
                <br />
                <p>${filePath}</p>
            </div>
            <div class="buttons-container">
                <button id="cancelBtn" class="qoom-main-btn qoom-button-outline qoom-button-small" type="cancel">Cancel</button>
                <button id="submitBtn" class="qoom-main-btn qoom-button-full qoom-button-small" type="submit">Delete</button>
            </div>
        	<!--tong-->
        </div>
	`.trim();
	const submitBtn = deleteFileModal.querySelector('#submitBtn');
	deleteFileModal.querySelector('#cancelBtn').addEventListener('click', e => {
		console.log('cancel');
		deleteFileModal.remove();
	});
	submitBtn.addEventListener('click', async e => {
		console.log('delete');
		deleteFileModal.remove();
		await deleteFile(file._id);
		await Promise.all([renderSidebar(undefined, true), closeTab(fileInfo)]);
	});
	document.body.appendChild(deleteFileModal);
}

export {
	openCreateNewFileDialogue,
	openDeleteFileDialogue,
	openCreateNewFolderDialogue,
	openDeleteFolderDialogue
}