import {removeUploaderOverlayWindow} from '/libs/uploader/uploaderWindow/uploaderOverlayInjector.js';
import {getQueue} from '/libs/uploader/uploadProgressDisplay/progressDisplay.js';


const setUpDragAndDrop = async (dropArea) => {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, preventDefaults, false)
	})

	function preventDefaults (e) {
		e.preventDefault();
		e.stopPropagation();
	}
	
	dropArea.addEventListener('drop', (e) => {
		const folder = getFolderFunction();
		const files = e.dataTransfer.files;
		for (const file of files) {
			getQueue().push({folder, file});
		}
		
	})
}



const main = async (getFolderFunction) => {
	const doneButton = document.querySelector('#uploaderOverlayWindow .uploadDoneBtn');
	doneButton.addEventListener('click', removeUploaderOverlayWindow);
	
	
	const dragAndDropBox = document.querySelector('#uploaderOverlayWindow .dropBoxField');
	const uploadFoldersBtn = document.querySelector('#uploaderOverlayWindow .uploadFoldersBtn');
	const uploadFilesBtn = document.querySelector('#uploaderOverlayWindow .uploadFilesBtn');
	const uploaderUploadFileInput = document.querySelector('#uploaderOverlayWindow .uploaderUploadFileInput');
	const uploaderUploadFolderInput = document.querySelector('#uploaderOverlayWindow .uploaderUploadFolderInput');
	
	
	setUpDragAndDrop(dragAndDropBox, getFolderFunction).then();
	
	
	uploadFilesBtn.addEventListener('click', () => {
		uploaderUploadFileInput.click();
	});
	uploadFoldersBtn.addEventListener('click', () => {
		uploaderUploadFolderInput.click();
	});
	
	uploaderUploadFileInput.addEventListener('change', () => {
		const folder = getFolderFunction();
		for (const file of uploaderUploadFileInput.files) {
			getQueue().push({folder, file});
		}
		
		uploaderUploadFileInput.input = "";
	})
	uploaderUploadFolderInput.addEventListener('change', () => {
		const folder = getFolderFunction();
		for (const file of uploaderUploadFolderInput.files) {
			getQueue().push({folder, file});
		}
		
		uploaderUploadFolderInput.input = "";
	})
}


export {
	main
}