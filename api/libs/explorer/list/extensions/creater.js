import Modal from '/libs/modal/script.js'

function createNewFile() {
	const createNewFileModal = new Modal({
		modalContainerId: 'createNewFileModal'
		, modalTitleText: `Create New File`
		, modalContentsInnerHTML: `
			<div class="modal-description">
				<p>Enter a file name to create.</p>
			</div>
			<div class="form-input">
				<p class="code">${[location.origin,window.getFolderPath(), ''].join('/').replace(/\/\/$/, '/')}</p>
				<div class="input-items default">
					<input type='text' placeholder='file name'>
				</div>
				<label></label>
			<div>
		`
		, modalSubmitBtnText: 'Create'
		, modalSubmitBtnAction: function() {
			const $input = document.querySelector('#createNewFileModal input');
			if(!$input.value.trim()) return;
			
		    const ext = $input.value.trim().split(".").reverse()[0].toLowerCase()	
				, filePath = window.getFolderPath()
				, fileName = [filePath, $input.value.trim()].join('/').trim()
		    	, $alertLabel = document.querySelector('#createNewFileModal label')
		    ;
		    if (
		        !ext ||
		        !contentTypes[ext] ||
		        /\.api$|\.app$|\.schemas$/.test(fileName.toLowerCase())
		    ){	

		    	$alertLabel.innerText = 'Please enter a valid file extension';
		    	$alertLabel.style.margin = '4px 0 8px auto';
		    	$alertLabel.style.color = 'var(--color-red)';
		    	return;
		    }
		    window.explorer.fetchAndReload(`/save?file=${encodeURIComponent(fileName.replace(/\/+/g, '/').trim())}`, {
		    	modal: createNewFileModal
		    	, method: 'POST'
		    }, (err) => {
		    	if(err) return alert(err);
		    
		    	const $a = document.querySelector(`a[title='${fileName}']`);
		    	if($a) $a.click();
		    });
		}
		, modalCancelBtnText: 'Cancel'
		, modalCancelBtnAction: function(){
			createNewFileModal.destroy();
		}
	})
	
	createNewFileModal.show();
}

function createNewFolder() {
	const createNewFolderModal = new Modal({
		modalContainerId: 'createNewFolderModal'
		, modalTitleText: `Create New Folder`
		, modalContentsInnerHTML: `
			<div class="modal-description">
				<p>Enter a folder name to create.</p>
			</div>
			<div class="form-input">
				<p class="code">${[location.origin,window.getFolderPath(), ''].join('/').replace(/\/\/$/, '/')}</p>
				<div class="input-items default">
					<input type='text' placeholder='folder name'>
				</div>
				<label></label>
			<div>
		`
		, modalSubmitBtnText: 'Create'
		, modalSubmitBtnAction: function() {
			const $input = document.querySelector('#createNewFolderModal input');
			if(!$input.value.trim()) return;
			
		    const ext = $input.value.trim().split(".").reverse()[0].toLowerCase()	
				, filePath = window.getFolderPath()
				, folderPath = [filePath, $input.value.trim()].join('/').trim()
		    	, $alertLabel = document.querySelector('#createNewFolderModal label')
		    ;
		    
		    window.explorer.fetchAndReload(`/save?file=${encodeURIComponent(folderPath + '/').replace(/\/+/g, '/').trim()}`, {
		    	modal: createNewFolderModal
		    	, method: 'POST'
		    	, headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
			    body: JSON.stringify({
	                file: folderPath  + '/',
	                domain: location.host,
	                allowBlank: true,
	                data: "",
	                title: undefined,
	                updateFile: true,
	                backup: true,
	            })
		    }, (err) => {
		    	if(err) return alert(err);
		    
		    	const $a = document.querySelector(`a[title='${folderPath}']`);
		    	if($a) $a.click();
		    });		
		}
		, modalCancelBtnText: 'Cancel'
		, modalCancelBtnAction: function(){
			createNewFolderModal.destroy();
		}
	})
	
	createNewFolderModal.show();
}


function createItem (creator) {
	creator.creater = [
		{ text: 'File', icon: 'ic-new-file', onclick: createNewFile  }
		, { text: 'Folder', icon: 'ic-new-folder', onclick: createNewFolder  }
	]

}

export default { createItem }