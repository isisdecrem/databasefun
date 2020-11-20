import { removeClonerUiWindow } from "/libs/cloner/clonerui/clonerui-inject.js";


let inUploadMode = false;
let filesToCopy;
let filesToCopyCloneState = {};


const updateFilesToCopyCloneState = async (fileName) => {
	for (const file in filesToCopy) {
		if (file === fileName) {
			filesToCopyCloneState[file] = 'Done';
			return;
		}
	}
} 

const connectToSocket = async (id) => {
	
	const socket = io('/clone/overwrite-progress/'+id);
	socket.on('connect', () => {
        socket.emit('execute');
	});
	socket.on('progress', (progress) => {
		updateFilesToCopyCloneState(progress);
		refreshFileDisplay(document);
	})
	socket.on('disconnect', () => {
	})
	
}

const refreshFileDisplay = async (overlay, diffs) => {
    const select = overlay.querySelector(".cloner-ui-file-type-selection");
    const fileType = select.options[select.selectedIndex].value;
    const display = overlay.querySelector(".cloner-ui-files-display");
    display.innerHTML = "";
    
    if (inUploadMode) diffs = filesToCopy;
    
    
    for (const diff in diffs) {
        if ((fileType === "all" || fileType === diffs[diff].state) && !!diffs[diff].state) {

	    	const nd = document.createElement('div');
			nd.addEventListener('click', () => {
				window.dispatchEvent(new CustomEvent('ClonerOpenMerger', {detail: diffs[diff]}))
			});
	    	
            display.appendChild(nd);
            
            nd.classList.add('cloner-ui-files-display-item');
            nd.classList.add(`cloner-ui-files-display-item-${diffs[diff].state}`);
	    	
	    	nd.innerHTML = `
				<p>${diff}${(inUploadMode ? ` --- ${filesToCopyCloneState[diff] || 'uploading'}` : '')}</p>
				<p>${diffs[diff].state}</p>
			`.trim();
			

        }
    }
};

const changeFiles = async (diffs, action) => {
    switch (action.toUpperCase()) {
        case "OVERWRITE":
            filesToCopy = diffs;
            break;
        case "NEW":
            filesToCopy = Object.keys(diffs).reduce((o, n) => {
                if (diffs[n].state !== "new") return o;
                o[n] = diffs[n];
                return o;
            }, {});
            break;
        case "NEWER":
            filesToCopy = Object.keys(diffs).reduce((o, n) => {
                if (diffs[n].state !== "newer") return o;
                o[n] = diffs[n];
                return o;
            }, {});
            break;
        case "OLDER":
            filesToCopy = Object.keys(diffs).reduce((o, n) => {
                if (diffs[n].state !== "older") return o;
                o[n] = diffs[n];
                return o;
            }, {});
            break;
        default:
            return;
    }
    
    filesToCopy = Object.keys(filesToCopy).reduce((o, n) => {
        if (!filesToCopy[n].state || filesToCopy[n].state === "same") return o;
        o[n] = filesToCopy[n];
        return o;
    }, {});
    
    if (!filesToCopy || Object.keys(filesToCopy).length < 1) return;
    
	inUploadMode = true;
    refreshFileDisplay(document);
        
    const resp = await fetch("/clone/overwrite-with-progress", {
        method: "POST",
        headers: new Headers({
        	'Content-Type': 'application/json'	
        }),
        body: JSON.stringify(filesToCopy),
    });
    const {id} = await resp.json();
    connectToSocket(id);
};



const main = async (overlay, folder, member, version) => {
	
	inUploadMode = false;
	filesToCopy;
	filesToCopyCloneState = {};
	
    for (const p of overlay.querySelectorAll(".cloning-info")) {
        p.innerText = `Cloning : ${folder} from ${member} at ${version}`;
    }

    const resp = await fetch('/clone/get-files', {
    	headers: new Headers({
    		'Content-Type': 'application/json'
    	}),
    	method: 'POST',
    	body: JSON.stringify({
    		folder: folder.substring(1) || '',
    		member, 
    		version
    	})
    })

    const diffs = await resp.json();

    refreshFileDisplay(overlay, diffs).then();
    overlay
        .querySelector(".cloner-ui-file-type-selection")
        .addEventListener("change", () => {
            refreshFileDisplay(overlay, diffs);
        });

    for (const closeBtn of overlay.querySelectorAll(
        ".cloner-ui-close-button"
    )) {
        closeBtn.addEventListener("click", () => {
            removeClonerUiWindow().then();
        });
    }
    
    for (const action of ['overwrite', 'new', 'newer', 'older']) {
    	const buttons = overlay.querySelectorAll(`.cloner-ui-action-button-${action}`);
    	for (const button of buttons) {
    		button.addEventListener('click', () => changeFiles(diffs, action));
    	}
    }
	overlay.style.display = 'block';
};

export { main };