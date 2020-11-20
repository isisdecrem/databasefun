import {states} from '/libs/supporter/helpform/utils.js';

const manageExperienceInput = async (node) => {
	const experienceInput = node.querySelector('.help-form-overlay-experience-input');
	experienceInput.addEventListener('input', (e) => {
		states.experience = experienceInput.value;
	})
	
}

export default manageExperienceInput;