import { injectUploaderProgressDisplay } from "/libs/uploader/uploadProgressDisplay/inject.js";
import { getQueue } from "/libs/uploader/uploadProgressDisplay/progressDisplay.js";

const traverseFileTree = async (item, path, folder) => {
    path = path || "";
    if (item.isFile) {
        item.file((file) => {
        	console.log(file);
        	const folderPath = file.webkitRelativePath ? folder : folder+"/"+path;
            getQueue().push({folder: folderPath, file})
        });
    } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries((entries) => {
            for (const entry of entries || []) {
                traverseFileTree(entry, path + item.name + "/", folder)
            }
        });
    }
}

function setUpDragAndDrop(
    dropArea,
    getFolderFunction,
    showOverlay,
    overlayElement
) {
    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const overlayContainer = document.createElement("div");

    const createOverlay = async () => {
        overlayContainer.style.width = "0px";
        overlayContainer.style.height = "0px";
        overlayContainer.style.position = "absolute";
        overlayContainer.style.left = "0";
        overlayContainer.style.top = "0";
        overlayContainer.innerHTML = "";

        const borderOverlay = document.createElement("div");
        const box = (overlayElement || dropArea).getBoundingClientRect();
        const { top, left, width, height } = box;
		borderOverlay.style.position = 'fixed';
		borderOverlay.style.top = `${top - 2}px`;
		borderOverlay.style.left =  `${left - 2}px`;
		borderOverlay.style.width = `${width + 2 * 2}px`;
		borderOverlay.style.height = `${height + 2 * 2}px`;
		borderOverlay.style.minHeight = `4rem`;
		borderOverlay.style.background = `#0067f438`;
		borderOverlay.style.border = '2px solid var(--color-secondary)';
		borderOverlay.style.borderRadius = '4px';
        overlayContainer.appendChild(borderOverlay);

        const folderIndicator = document.createElement("div");
        const folder = getFolderFunction();
        folderIndicator.style.position = "fixed";
        folderIndicator.style.minwidth = `20rem`;
        folderIndicator.style.lineHeight = `1.5`;
        folderIndicator.style.gap = "1rem";
		folderIndicator.style.bottom = `1rem`;
		folderIndicator.style.left = `50vw`;
        folderIndicator.style.transform = "translate(-50%, -10%)";
		folderIndicator.style.background = 'var(--color-blue-10)';
		folderIndicator.style.color = 'var(--text-dark-high)';
		folderIndicator.style.padding = '1rem 2rem';
		folderIndicator.style.border = '1px solid var(--color-secondary)';
		folderIndicator.style.borderRadius = '4px';
		folderIndicator.style.fontWeight= '300';
		folderIndicator.style.textAlign = 'center';
		folderIndicator.style.zIndex = '10000';
        folderIndicator.innerHTML = `
			<p style="line-height: 1.5;">Drop your files to upload to
			<br />
			<span style="color: var(--color-secondary);">${(folder === '/') ? 'your coding space' : folder.split('/').reverse()[0]}</span></p>
		`.trim();
        borderOverlay.style.pointerEvents = "none";
        overlayContainer.appendChild(folderIndicator);
    };

    const appendOverlay = async () => {
        await createOverlay();
        if (document.body.contains(overlayContainer)) return;
        document.body.appendChild(overlayContainer);
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    dropArea.addEventListener("dragenter", async (e) => {
        if (showOverlay) await appendOverlay();
    });

    dropArea.addEventListener("dragleave", (e) => {
        if (overlayContainer) overlayContainer.remove();
    });

    dropArea.addEventListener("dragover", async (e) => {
        if (showOverlay) await appendOverlay();
    });

    dropArea.addEventListener("drop", async (e) => {
        // injectUploaderProgressDisplay(document.body);
        const folder = getFolderFunction();
        if (overlayContainer) overlayContainer.remove();
        // console.log(e.dataTransfer);
        // console.log(e.dataTransfer.items);
        // console.log(e.dataTransfer.items[0]);
        for (const item of e.dataTransfer.items) {
        	const entryItem = item.webkitGetAsEntry();
        	// console.log(folder);
        	traverseFileTree(entryItem, "", folder);
        }
    })
}

const setUpFileUploadButton = async (clickNode, getFolderFunction) => {
    // injectUploaderProgressDisplay(document.body);
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("multiple", "");
    fileInput.setAttribute("accept", "*");
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    clickNode.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
        const folder = getFolderFunction();
        for (const file of fileInput.files) {
            getQueue().push({ folder, file });
        }
        fileInput.input = "";
    });
};

const setUpFolderUploadButton = async (clickNode, getFolderFunction) => {
    // injectUploaderProgressDisplay(document.body);
    const folderInput = document.createElement("input");
    folderInput.setAttribute("type", "file");
    folderInput.setAttribute("multiple", "");
    folderInput.setAttribute("accept", "*");
    folderInput.setAttribute("webkitdirectory", "");
    folderInput.setAttribute("directory", "");
    folderInput.style.display = "none";
    document.body.appendChild(folderInput);
    clickNode.addEventListener("click", () => folderInput.click());
    folderInput.addEventListener("change", () => {
        const folder = getFolderFunction();
        for (const file of folderInput.files) {
            getQueue().push({ folder, file });
        }
        folderInput.input = "";
    });
};


const initUploader = async (node) => {
    await Promise.all([injectUploaderProgressDisplay(node)]);
};

export {
    initUploader,
    setUpFileUploadButton,
    setUpFolderUploadButton,
    setUpDragAndDrop,
};