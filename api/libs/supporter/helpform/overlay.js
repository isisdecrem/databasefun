import {refreshHelpFormStars} from '/libs/supporter/helpform/manageStars.js';
import manageCatagories from '/libs/supporter/helpform/manageCatagories.js';
import manageExperienceInput from '/libs/supporter/helpform/manageExperienceInput.js';
import manageFileInput from '/libs/supporter/helpform/manageFileInput.js';
import manageFileUpload from '/libs/supporter/helpform/manageFileUpload.js';
import manageActionButtons from '/libs/supporter/helpform/manageActionButtons.js';
import {initStates} from '/libs/supporter/helpform/utils.js';

const main = async (node) => {
	console.log(node);
	initStates();
	await Promise.all([
		refreshHelpFormStars, 
		manageCatagories,
		manageExperienceInput,
		manageFileInput,
		manageActionButtons,
		manageFileUpload,
	].map(fn => fn(node)));
}


export {
	main
}