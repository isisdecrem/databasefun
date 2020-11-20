const download = async () => {
	const downloadPath = '/migrate/download-qoom';
	const form = document.createElement('form');
	form.action = downloadPath;
	form.method = 'post';
	const button = document.createElement('button');
	button.type = "submit";
	document.body.appendChild(form);
	form.appendChild(button);
	button.click()
	document.body.removeChild(form);
}

export default download;