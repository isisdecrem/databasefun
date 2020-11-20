import {states} from '/libs/supporter/helpform/utils.js';

const manageCatagories = async (node) => {
	const catagoryInput = node.querySelector('.help-form-overlay-select-catagory-selector');
	catagoryInput.addEventListener('change', e => {
		states.catagory = catagoryInput.value;
		console.log(states);
	})
	
}

export default manageCatagories;