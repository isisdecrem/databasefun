import Modal from '/libs/modal/script.js';
import bindToWindow from "/libs/uploader/noModalUploaderBinder/bindToWindow.js";
let $fileUploadButton, $folderUploadButton;

let isSetup = false;

async function setUpUploader() {
    const $fileUploadButton = document.querySelector('#uploader_file_button')
    	, $folderUploadButton = document.querySelector('#uploader_folder_button');
    if(!$fileUploadButton || !$folderUploadButton) return setTimeout(setUpUploader, 100);
    
    setUpFileUploadButton($fileUploadButton, () => getFolderPath());
    setUpFolderUploadButton($folderUploadButton, () => getFolderPath());
    $fileUploadButton.addEventListener('click', () => {});
    $folderUploadButton.addEventListener('click', () => {});
	if(isSetup) return;
	
    isSetup = true;
    initUploader(document.body);
    window.addEventListener('uploadComplete', e => {
        window.explorer.navigateToFolder(location.pathname, true)
    })
    setUpDragAndDropForFolder(window, () => getFolderPath(), window.explorer.$tbody);
}

async function setUpDragAndDropForFolder(element, getFolderFuncton, overlayElement) {
    await setUpDragAndDrop(element, getFolderFuncton, true, overlayElement);
}

function getFolderPath() {
	return '/' + window.getFolderPath();
}

function createItem (creator) {

	creator.uploader = [
		{ text: 'File Upload', icon: 'ic-upload-file', id: 'uploader_file_button' }
		, { text: 'Folder Upload', icon: 'ic-upload-folder', id: 'uploader_folder_button' }
	]
	setTimeout(setUpUploader, 100);

}

function createTool() {}

bindToWindow();

export default { createItem, createTool }