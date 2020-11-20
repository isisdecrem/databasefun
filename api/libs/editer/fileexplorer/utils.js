const states = {
	pastFolderStructure: null,
	folderStates: {},
	fileStates: {},
	fileInfos: {},
	ogFileInfo: {},
	currentFileInfo: {},
}


const getAbsolutePath = (path) => {
    const link = document.createElement("a");
    link.href = path;
    const res = link.href;
    link.remove();
    return res;
}




const fileToFilepath = (file) => (file.directory || '') + file.name;



const fileToFileInfo = (file) => {
	return {
		fileName: file.name,
		domain: file.domain,
		filePath: fileToFilepath(file),
		folderPath: file.directory || (/.(api|app)$/g.test(file.name)) ? file.name.substring(0, file.name.length-4) : ''
	}
}

const buildEditorUrl = (fileInfo) => getAbsolutePath(`/edit/${fileInfo.filePath}`);

const updateUrlBar = (fileInfo) => {
	console.log(fileInfo.filePath);
	if (window.history.replaceState) {
		window.history.replaceState('', fileInfo.fileName, `/edit2/${fileInfo.filePath}`);
	}
}

const processFolderPath = (fp) => {
	let folderPath = fp;
	if (!folderPath.startsWith('/')) folderPath = '/' + folderPath;
	if (folderPath.endsWith('/')) folderPath = folderPath.substring(0, folderPath.length-1);
	return folderPath;
}

const getFolderFiles = async (fileInfo) => {
	let {domain, folderPath} = fileInfo;

	folderPath = processFolderPath(folderPath);
	
	console.log(domain, folderPath);
	
	const resp = await fetch(`/edit/folder-structure`, {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({
			folder: folderPath,
			domain
		})
	});
	
	let folderstructure = await resp.json();
	folderstructure = folderstructure['/'];
	const levelsDown = (folderPath.match(/\//g)||[]).length;
	console.log(folderstructure);
	for (let i = 0; i < levelsDown; i++) {
		folderstructure = folderstructure['folders'][Object.keys(folderstructure['folders'])[0]];
		console.log(folderstructure);
	}
	return folderstructure;
}


export {states, getFolderFiles, fileToFilepath, updateUrlBar, buildEditorUrl, getAbsolutePath, processFolderPath, fileToFileInfo};