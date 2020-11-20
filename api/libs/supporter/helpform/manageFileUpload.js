import {states} from '/libs/supporter/helpform/utils.js';


const humanFileSize = (bytes, si=false, dp=1) => {
	const thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}
	const units = si 
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10**dp;
	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
	return bytes.toFixed(dp) + ' ' + units[u];
}


const startUpload = async (status) => {
	const {file, fileStatusDiv, fileStatus} = status;
	// console.log(fileStatus);
	fileStatus.started = true;
	fileStatus.percent = 0;
	console.log(fileStatus.percent);
	const xhr = new XMLHttpRequest();
	const formData = new FormData();
	formData.append('mainFile', file);
	formData.append('tempId', states.tempId);
	xhr.upload.onprogress = (e) => {
		// console.log('wfwfwfefef');
		fileStatus.percent = (100 * e.loaded) / e.total;
		const bar = fileStatusDiv.querySelector('.help-form-overlay-file-upload-status-file-status-bar');
		// console.log(bar);
		bar.style.gridTemplateColumns = `${fileStatus.percent}% auto`;
	}
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			fileStatus.percent = 100;
			const bar = fileStatusDiv.querySelector('.help-form-overlay-file-upload-status-file-status-bar');
			bar.style.gridTemplateColumns = `${fileStatus.percent}% auto`;
		}
	}
	xhr.open('POST', '/support/upload-help-files');
	xhr.send(formData);
}


const updateStatus = async (node) => {
	const statusContainer = node.querySelector('.help-form-overlay-file-upload-status-container');
	for (const status of states.fileStatuses) {
		if (statusContainer.contains(status.fileStatusDiv)) return;
		const fileStatusDiv = document.createElement('div');
		fileStatusDiv.classList.add('help-form-overlay-file-upload-status-file')
		fileStatusDiv.innerHTML = `
			<div class="help-form-overlay-file-upload-status-file-info">
				<p class="help-form-overlay-file-upload-status-file-name">${status.file.name}</p>
				<p class="help-form-overlay-file-upload-status-file-size">${humanFileSize(status.file.size)}</p>
			</div>
			<div class="help-form-overlay-file-upload-status-file-status-bar">
				<div class="help-form-overlay-file-upload-status-file-status-bar-bar">
			</div>
		`.trim();
		// console.log('123123');
		statusContainer.appendChild(fileStatusDiv);
		status.fileStatusDiv = fileStatusDiv;
	}
}


const checkForUpdates = async (node) => {
	await updateStatus(node);
	for (const status of states.fileStatuses) {
		if (!status.fileStatus.started) {
			status.fileStatus.started = true;
			await startUpload(status);
		}
	}
	
}


const manageFileUpload = async (node) => {
	// setInterval(() => checkForUpdates(node), 300);
}

export default manageFileUpload;

export {checkForUpdates};