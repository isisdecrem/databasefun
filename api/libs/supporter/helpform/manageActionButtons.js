import {removeHelpFormOverlayWindow} from '/libs/supporter/helpform/inject.js';
import {submit} from '/libs/supporter/helpform/utils.js';


const bindCancelButton = async (node) => {
	const cancelButton = node.querySelector('.help-form-overlay-cancel-button');
	console.log(cancelButton);
	cancelButton.addEventListener('click', removeHelpFormOverlayWindow);
}

const bindSubmitButton = async (node) => {
	const submitButton = node.querySelector('.help-form-overlay-submit-button');
	submitButton.addEventListener('click', e => {
		if (submit()) {
			removeHelpFormOverlayWindow();
		};
	})
}


const manageActionButtons = async (node) => {
	console.log('fewffwfewf');
	await Promise.all([bindCancelButton, bindSubmitButton].map(f => f(node)));
}


export default manageActionButtons;