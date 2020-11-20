import {removeGitIntegrationOverlayWindow} from '/libs/migrater/explorer-git-integration/inject.js';
import {connectToGit} from '/libs/migrater/gitCommon.js';


const handleInputChange = async (overlay, submitButton, inputs) => {
	if (Object.values(inputs).every((i) => !!i.value)) {
		submitButton.disabled = false;
	} else {
		submitButton.disabled = true;
	}
}

const parseGitInfo = async (inputs, gitInfo) => {
	const mapping = {
		'directory': 'folderNameInput',
		'token': 'gitTokenInput',
		'url': 'gitUrlInput',
		'username': 'gitUserNameInput',
	}
	for (const [key, val] of Object.entries(mapping)) {
		inputs[val].value = gitInfo[key];
	}
}

const changeMode = async (mode) => {
	const root = document.documentElement;
	if (mode === 'outputs') {
		root.style.setProperty('--git-integration-inputs-display', 'none');
		root.style.setProperty('--git-integration-outputs-display', 'flex');
	} else if (mode ==='inputs') {
		root.style.setProperty('--git-integration-inputs-display', 'flex');
		root.style.setProperty('--git-integration-outputs-display', 'none');
	}
}

const handleSubmit = async (values, getNewDirectoryFunction, outputsTextarea, mode='pull') => {
	let directory = values.folderName
		.replace(/<|>/g, '')
		.replace(/\/+/g, '/').trim()
	if(!directory) return alert('Invalid Directory');
	if(window.getFolderPath) directory = window.getFolderPath() + '/' + directory;
	if (directory.startsWith('/')) directory = directory.substring(1);	
	const options = {
		gitURL: values.gitUrl,
		directory: directory
	}
	
	const callbacks = {
		connectCallback: () => {
			console.log('connected');
			outputsTextarea.value += 'connected \n';
			outputsTextarea.scrollTop = outputsTextarea.scrollHeight;
		},
		disconnectCallback: () => {
			console.log('disconnected');
			outputsTextarea.value += 'done \n';
			outputsTextarea.scrollTop = outputsTextarea.scrollHeight;
			window.dispatchEvent(new Event('gitIntegrationDone'));
		},
		statusCallback: (msg) => {
			console.log(msg)
			outputsTextarea.value += msg + '\n';
			outputsTextarea.scrollTop = outputsTextarea.scrollHeight;
		}
	}
	connectToGit(mode, options, callbacks);
}

const setUpBindings = async (overlay, getNewDirectoryFunction, options) => {
	const folderNameInput = overlay.querySelector('.git-integration-overlay-folder-name');
	const gitUrlInput = overlay.querySelector('.git-integration-overlay-git-url');
	const submitButton = overlay.querySelector('.git-integration-overlay-submit-button');
	const closeButton = overlay.querySelector('.git-integration-close-button');
	const cancelButton = overlay.querySelector('.git-integration-cancel-button');
	const outputsTextarea = overlay.querySelector('.git-integration-outputs');
	
	closeButton.addEventListener('click', () => {
		removeGitIntegrationOverlayWindow();
		changeMode('inputs');
		location.reload();
	});
	cancelButton.addEventListener('click', removeGitIntegrationOverlayWindow);
	const inputs = {
		folderNameInput, 
		gitUrlInput
	}
	
	
	if (options) {
		if (options.gitInfo) {
			options.gitInfo.directory && (options.gitInfo.directory = options.gitInfo.directory.substring(options.gitInfo.directory.lastIndexOf('/')+1));
			await parseGitInfo(inputs, options.gitInfo);
			await handleInputChange(overlay, submitButton, inputs);
		}
		if (options.mode) {
			submitButton.innerText = options.mode;
		}
	}
	
	
	for (const input of [folderNameInput, gitUrlInput]) {
		input.addEventListener('input', () => handleInputChange(overlay, submitButton, inputs));
	}
	submitButton.addEventListener('click', () => {
		const values = {};
		for (const [key, val] of Object.entries(inputs)) {
			values[key.substring(0, key.length-5)] = val.value;
		}
		changeMode('outputs');
		handleSubmit(values, getNewDirectoryFunction, outputsTextarea, options && options.mode);
	})
}


const main = async (overlay, getNewDirectoryFunction, options) => {
	await setUpBindings(overlay, getNewDirectoryFunction, options);
}



export {
	main
}