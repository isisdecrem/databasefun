import {cloneAndSave} from './webclone.js';


/**
 * Bind inputs for test page
 * @author Tong Miao
 */
const bind = async () => {
	const websiteUrlInput = document.querySelector('#websiteUrl');
	const directoryInput = document.querySelector('#directory');
	const submitButton = document.querySelector('#submit');
	const usePuppeteerCheckbox = document.querySelector('#usePuppeteer');
	const outputArea = document.querySelector('#outputArea');
	const recursiveDepthInput = document.querySelector('#recursiveDepth');
	const sameDomainOnlyCheckbox = document.querySelector('#sameDomainOnly');
	const removeAllQoomStickerCheckbox = document.querySelector('#removeAllQoomSticker');
	submitButton.addEventListener('click', async () => {
		outputArea.value = '';
		await cloneAndSave({
			url: websiteUrlInput.value,
			dir: directoryInput.value,
			usePuppeteer: usePuppeteerCheckbox.checked,
			recursiveDepth: recursiveDepthInput.value,
			sameDomainOnly: sameDomainOnlyCheckbox.checked,
			removeAllQoomSticker: removeAllQoomStickerCheckbox.checked
		}, (status) => {
			console.log(status);
			outputArea.value += status + '\n';
		})
	})
}

bind();