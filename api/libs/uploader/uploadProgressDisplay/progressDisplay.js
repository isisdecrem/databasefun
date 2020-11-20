import {removeUploaderProgressDisplay} from '/libs/uploader/uploadProgressDisplay/inject.js';


let queueIndex = 0;
let queue = [];
let fileStatus = [];
let uploading = false;
let allUploadsDone = false;
let currentXhr = null;
let stats = {
	uploaded: 0,
	canceled: 0,
	error: 0
}

// let changeInfoOnCoolDown = {
// 	coolDown: false
// }

function humanFileSize(bytes, si=false, dp=1) {
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



const possibleClasses = [
	"ic-spinner primary",
	"ic-check-circle-full green",
	"ic-alert-circle-full yellow",
	"ic-alert-circle-full red"
];

const statusToNumber = (status) => {
	
	if (!status) {
		return 0;
	}
	
	switch (status) {
		case 'uploading':
			return 0;
		case 'uploaded':
			return 1;
		case 'canceled':
			return 2;
		case 'error':
			return 3;
	}
}



const changeInfo = async (fileQueue) => {
	// if (changeInfoOnCoolDown.coolDown) return;
	// changeInfoOnCoolDown.coolDown = true;
	
	if (queueIndex > fileQueue.length-1) {
		queueIndex = fileQueue.length-1;
	}
	const mainInfoBar = document.querySelector("#uploaderProgressDisplay .maininfobar");
	document.querySelector("#uploaderProgressDisplay").style.display = 'block';
	let statusText = "";
	for (const key of Object.keys(stats)) {
		statusText += `${stats[key]} ${key} `;
	}

	
	mainInfoBar.innerHTML = `
		<div class="infobarContent">
			<i class="${allUploadsDone ? (stats.error ? possibleClasses[3] : stats.canceled ? possibleClasses[2] : possibleClasses[1]) : possibleClasses[statusToNumber(fileStatus[queueIndex])]}"></i>
			<p>${allUploadsDone ? statusText : fileQueue[queueIndex].file.name}</p>
			${allUploadsDone ? `<div class="closeButton"><p>Close</p></div>` : 
				`<p class="lessProminantText">${queueIndex+1} of ${fileQueue.length} files</p>
				<div class="cancelButton"><p>Cancel</p></div>`
			}
		</div>
	`.trim();
	const expandedInfoCube = document.querySelector("#uploaderProgressDisplay .expandedinfocubecontents");
	if (!allUploadsDone) {
		document.querySelector("#uploaderProgressDisplay .cancelButton").onclick = cancelUpload;
		document.querySelector("#uploaderProgressDisplay .maininfobar .infobarContent").style.gridTemplateColumns = '1.5rem auto 8rem 4rem';
	} else {
		document.querySelector("#uploaderProgressDisplay .closeButton").onclick = () => {
			document.querySelector("#uploaderProgressDisplay").style.display = 'none';
			queue = [];
			queueIndex = 0;
			fileStatus = [];
			uploading = false;
			allUploadsDone = false;
			currentXhr = null;
			stats = {
				uploaded: 0,
				canceled: 0,
				error: 0
			}
			expandedInfoCube.style.display = 'none';
		};
		document.querySelector("#uploaderProgressDisplay .maininfobar .infobarContent").style.gridTemplateColumns = '1.5rem auto 4rem';
	}

	expandedInfoCube.innerHTML = '';
	for (const [i, file] of fileQueue.entries()) {
		expandedInfoCube.innerHTML += `
			<div class="infobarContent .unselectable">
				<i class="${possibleClasses[statusToNumber(fileStatus[i])]}"></i>
				<p class="${(!fileStatus[i]) ? "disabledText" : ""}">${file.file.name}</p>
				<p class="${(!fileStatus[i]) ? "disabledText" : ""}">${humanFileSize(file.file.size)}</p>
			</div>
		`.trim();
	}
};





const setBar = async (total, loaded) => {
	const bar = document.querySelector('#uploaderProgressDisplay .progressbar');
	const percent = (loaded * 100 / total);
	// console.log(percent);
	bar.style.gridTemplateColumns = `${percent}% auto`;
}

const uploadFile = async () => {
	if (uploading) {
		return;
	}
	uploading = true;
	const file = queue[queueIndex].file;
	const folder = queue[queueIndex].folder;
	fileStatus[queueIndex] = 'uploading';
	// console.log(file);
	const xhr = new XMLHttpRequest();
	currentXhr = xhr;
	const formData = new FormData();
	formData.append("folder", folder);
	formData.append("mainFile", file);
	xhr.upload.onprogress = (e) => {
		setBar(e.total, e.loaded).then();
	}
	xhr.upload.onload = () => {
	}
	
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			setBar(1, 1).then();
			uploading = false;
			const resp = JSON.parse(xhr.response);
			fileStatus[queueIndex] = resp.err ? 'error' : 'uploaded';
			if (resp.err) {
				stats.error++;
			} else {
				stats.uploaded++;
			}
			window.dispatchEvent(new CustomEvent('uploadComplete', {detail: queue[queueIndex]}));
			if (queueIndex === queue.length - 1) {
				allUploadsDone = true;
				changeInfo(queue).then();
				return;
			}
			queueIndex++;
		}
	}

	
	xhr.upload.onerror = () => {
		setBar(1, 1).then();
		uploading = false;
		stats.error++;
		fileStatus[queueIndex] = 'error';
		if (queueIndex === queue.length - 1) {
			allUploadsDone = true;
			changeInfo(queue).then();
			return;
		}
		queueIndex++;
	}
	
	xhr.upload.onloadstart = () => {
		setBar(1, 0).then();
	}
	xhr.open('POST', '/upload/upload-file');
	xhr.send(formData);
}

// const proxyQueue = {
// 	set: (obj, prop, value) => {
// 		obj[prop] = value;
		
// 		changeInfo(obj).then();
// 		uploadFile().then();
// 		return true;
// 	}
// };


// const proxy = new Proxy(queue, proxyQueue);

const getQueue = () => {
	return queue;
	// return proxy;
}


const cancelUpload = async () => {
	currentXhr && currentXhr.abort();
	for (; queueIndex < queue.length; queueIndex++) {
		stats.canceled += 1;
		fileStatus[queueIndex] = 'canceled';
	}
	allUploadsDone = true;
	setBar(1, 1);
	await changeInfo(queue);
}


const main = async (node) => {
	const mainInfoBar = document.querySelector("#uploaderProgressDisplay .maininfobar");
	const expandedInfoCube = document.querySelector("#uploaderProgressDisplay .expandedinfocube");
	mainInfoBar.addEventListener('click', (e) => {
		console.log(e)
		if (e.target.classList.contains('cancelButton')) return;
		expandedInfoCube.style.display = (expandedInfoCube.getBoundingClientRect().width === 0) ? 'flex' : 'none';
	});
	window.setInterval(() => {
		if (queue.length < 1) return;
		if (queueIndex > queue.length-1) {
			queueIndex = queue.length-1;
		}
		if (allUploadsDone) {
			if (queue.length - 1 === queueIndex) {
				return;
			}
			queueIndex++;
		}
		changeInfo(queue).then();
		allUploadsDone = false;
		uploadFile().then();
	}, 100);
}


export {
	main,
	getQueue
}