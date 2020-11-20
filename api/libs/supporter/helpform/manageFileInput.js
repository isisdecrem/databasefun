import {states} from '/libs/supporter/helpform/utils.js';
import {checkForUpdates} from '/libs/supporter/helpform/manageFileUpload.js';


const renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}


const bindInput = async (node, input) => {
	input.addEventListener('change', () => {
		for (const file of input.files) {
			const names = states.fileStatuses.map(s => s.file.name);
			const numberOfTimesUsed = names.filter((v) => (v === file.name)).length;
			if (numberOfTimesUsed > 0) renameFile(file, `${file.name} (${numberOfTimesUsed})`);
			states.fileStatuses.push({
				file,
				fileStatusDiv: null,
				fileStatus: {
					started: false,
					percent: 0
				}
			})
		}
		checkForUpdates(node);
		console.log(states);
	})
}

const bindUploadClick = async (node, input) => {
	const fileSelectButton = node.querySelector('.help-form-overlay-file-upload-file-select-button');
	console.log(fileSelectButton);
	fileSelectButton.addEventListener('click', () => {
		input.click();
	});
}

const bindDragAndDrop = async (node, input) => {
	const dropArea = node.querySelector('.help-form-overlay-file-upload-box');
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, preventDefaults, false)
	})
	
	const removeBorder = () => {
		dropArea.style.border = "var(--text-dark-medium) dashed 1px";
	}
	
	const addBorder = () => {
		dropArea.style.border = "var(--color-primary) solid 3px";
	}
	
	dropArea.addEventListener('dragleave', () => {
		removeBorder();
	})
	
	dropArea.addEventListener('dragenter', () => {
		addBorder();
	})
	
	dropArea.addEventListener('dragover', () => {
		addBorder();
	})
	
	

	function preventDefaults (e) {
		e.preventDefault();
		e.stopPropagation();
	}
	
	dropArea.addEventListener('drop', (e) => {
		removeBorder();
		
		for (const file of e.dataTransfer.files) {
			const names = states.fileStatuses.map(s => s.file.name);
			const numberOfTimesUsed = names.filter((v) => (v === file.name)).length;
			if (numberOfTimesUsed > 0) renameFile(file, `${file.name} (${numberOfTimesUsed})`);
			states.fileStatuses.push({
				file,
				fileStatusDiv: null,
				fileStatus: {
					started: false,
					percent: 0
				}
			})
		}
		checkForUpdates(node);
	})
}




const manageFileInput = async (node) => {
	const input = node.querySelector('.help-form-overlay-file-upload-input');
	await Promise.all([
		bindInput,
		bindUploadClick,
		bindDragAndDrop,
	].map(f => f(node, input)));
}

export default manageFileInput;