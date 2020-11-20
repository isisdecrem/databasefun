import handleFileChange from '/libs/editer/fileexplorer/handleFileChange.js';
import {states} from '/libs/editer/fileexplorer/utils.js';

const main = async (startingFileInfo) => {
	states.ogFileInfo = startingFileInfo;
	await handleFileChange(startingFileInfo);
}

export {
	main
}