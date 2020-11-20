import Modal from '/libs/modal/script.js';


function publish(menuItem, data) {
	
	const folderToCreate = data.isFolder ? '' : `
			<div class="form-input"
				style=" margin: 0 -12px 16px;
						padding: 16px 16px 8px;
						border-radius: 8px;
						background-color: var(--color-blue-10);">
				<p>A file needs to be in a folder to publish.</p>
				<div class="input-items default">
					<input type='text' placeholder='Enter a folder name to move this file to' id='publish_folder' required>
				</div>
			</div>`
		, publishToGit = window.allowGit ? `<label>Enter an existing Git Repository URL, if you want to push this project.</label>
				<div class="input-items default">
					<input type='text' placeholder='i.e. https://github.com/mygithandle/myrepo.git' name='giturl' pattern='(http[s]?:\/\/)([^\/\s]+\/)(.*)(.git$)'>
				</div>` : ''
		, publishHTML = `
			<div class="modal-description">
				<p>When you publish a project, it will be displayed in your <a href="/profile" target="_blank">Profile page</a>.</p>
				<p>It is <span style="color: var(--color-secondary);">visible to everyone</span> regardless of Privacy settings.</p>
			</div>
			${folderToCreate}
			<form class="form-input">
				<label>Project Name</label>
				<div class="input-items default">
					<input type='text' placeholder='Enter a project name' name='name' required>
				</div>
				<label>Select a default page to show</label>
				<div class="input-items default">
					<input placeholder='Select a default page to display' name='link' list='filelist' required value=${data.isFolder ? '' : data.name}>
					<datalist id='filelist'></datalist>
				</div>
				<label>Description</label>
				<div class="input-items default">
					<textarea type='text' placeholder='Add a brief description about this project' name='description' required></textarea>
				</div>
				<label>Screenshots</label>
				<div><input type='file' multiple name='media' accept="image/png, image/jpeg, image/jpg, image/gif"></div>
				${publishToGit}
				<div class="input-checkbox" style="margin-top: 24px;display: flex;align-items: center;">
					<input type='checkbox' value='push' name='submittoqoom' style='margin-right:10px'>
					<p>Submit to <b>Featured Projects</b> on Qoom website</p>
				</div>
			</form>`
		, publishModal = new Modal({
			modalContainerId: 'publishModal'
			, modalTitleText: `Publish Manager`
			, modalSubmitBtnText: 'Publish'
			, modalCancelBtnText: 'Cancel'
			, modalCancelBtnAction: function(){
				publishModal.destroy();
			}
		})
	;

	async function bindLinkSuggestions(resp) {
		const json = await resp.json()
			, $datalist = document.querySelector('#publishModal datalist')
			, $linkinput = document.querySelector('#publishModal input[name=link]')
			, filelist = json.resp.filter(r => !r.isFolder && r.fullpath)
			, folder = data.fullpath
		;
		$linkinput.value = '';
		filelist.forEach((item, i) => {
			const $option = document.createElement('option');
			$option.value = item.fullpath.replace(folder, '');
			if(!$linkinput.value && item.fullpath.endsWith('.html')) $linkinput.value = $option.value.replace(/^\/|\/$/g, '');
			$datalist.appendChild($option)
		})
		if(!$linkinput.value && filelist.length) $linkinput.value = filelist[0].fullpath.replace(folder, '').replace(/^\/|\/$/g, '')			
	}
	
	async function bindPublishUpdateForm(resp) {
		const json = await resp.json()
		
		if(!json.link) {
			publishModal.modalSubmitBtnAction = function() { publishProject() };
			publishModal.show();
			return json;
		}
		
		const projectId = json._id;
		if(!projectId) return alert('No id found for the project');
		
		publishModal.modalSecondBtnText = 'Unpublish';
		publishModal.modalSecondBtnAction = function() { unpublishProject(projectId) };
		
		publishModal.modalSubmitBtnText = 'Update';
		publishModal.modalSubmitBtnAction = function() { updateProject(projectId) };
		publishModal.show();
		
		const $linkinput = document.querySelector('#publishModal input[name=link]')
			, $nameinput = document.querySelector('#publishModal input[name=name]')
			, $descriptioninput = document.querySelector('#publishModal textarea[name=description]')
			, $submittoqoominput = document.querySelector('#publishModal input[name=submittoqoom]')
			, $gitselect = document.querySelector('#publishModal input[name=giturl]')
		;
		if(json.link) $linkinput.value = json.link;
		if(json.name) $nameinput.value = json.name;
		if(json.giturl && $gitselect) $gitselect.value = json.giturl;
		if(json.description) $descriptioninput.value = json.description;
		if(json.appStoreStatus && json.appStoreStatus !== 'private') $submittoqoominput.checked = true;
		return json;
	}
	
	async function packageInAFolderAndPublish() {
		try {
			const $folder = document.querySelector('#publish_folder')
				, folder = $folder && $folder.value.replace(/^\/|\/$/g, '').trim()
				, form = document.querySelector('#publishModal form')
			;
			
			if(!form.checkValidity()) return form.reportValidity();
			if(!folder) return;
			
			const parentfolder = window.getFolderPath()
				, newfolderpath = `${parentfolder}/${folder}`
				, newfilepath = `${newfolderpath}/${data.name}`
				, moveToFolderUrl = `/explore/move/${data.id}?name=${encodeURIComponent(newfilepath.replace(/^\/|\/$/g, ''))}`
				, resp = await fetch(moveToFolderUrl, { method: 'PATCH' })
				, json = await resp.json()
			;
			if(json.error) return alert(json.error);
			publishProject(newfolderpath.replace(/^\/|\/$/g, ''), data.name);
		} catch(ex) {
			if(ex) return alert(ex);
		}
	}
	
	function publishProject(folder, link) {
		folder = (folder || data.fullpath).replace(/^\/|\/$/g, '')
		const url = `/publish/project?folder=${encodeURIComponent(folder)}`
			, form = document.querySelector('#publishModal form')
			, fdata = new FormData(form)
		;
		
		if(!form.checkValidity()) return form.reportValidity();
		if(link) fdata.set('link', link.replace(/^\/|\/$/g, ''));
		window.explorer.fetchAndReload(
            url
            , {
            	method: 'POST'
            	, body: fdata
            	, modal: publishModal
            	, reloadUrl: location.href
            }, (ex, resp) => {
            	if(ex) alert(ex);
            	resp.json().then((json) => {
            		if(json.error) alert(json.error);
            	}).catch((ex) => alert(ex));
            }
       );
	}
	
	function unpublishProject(id) {
		const url = `/publish/project/${id}`;
		window.explorer.fetchAndReload(url, {
        	method: 'DELETE'
        	, modal: publishModal
        	, reloadUrl: location.href
        }, (ex, resp) => {
        	if(ex) alert(ex);
        	resp.json().then((json) => {
        		if(json.error) alert(json.error);
        	}).catch((ex) => alert(ex));
        }
       );
	}
	
	function updateProject(id) {
		const url = `/publish/project/${id}`
			, form = document.querySelector('#publishModal form')
			, fdata = new FormData(form)
		;
		if(!form.checkValidity()) return form.reportValidity();
		window.explorer.fetchAndReload(url, {
        	method: 'PATCH'
        	, body: fdata
        	, modal: publishModal
        	, reloadUrl: location.href
        }, (ex, resp) => {
        	if(ex) alert(ex);
        	resp.json().then((json) => {
        		if(json.error) alert(json.error);
        	}).catch((ex) => alert(ex));
        }
       );
	}

	if(data.isFolder) {
		const checkPublishStateUrl = `/publish/details?folder=${data.fullpath.replace(/^\/|\/$/g, '')}`
			, fetchFilesToSearchUrl = `/explore/search/${data.fullpath.replace(/^\/|\/$/g, '')}`
		;
		
		publishModal.modalContentsInnerHTML = publishHTML;
		fetch(checkPublishStateUrl).then(async resp => {
			try {
				const projectData = await bindPublishUpdateForm(resp);
				
				fetch(fetchFilesToSearchUrl).then(resp => bindLinkSuggestions(resp))

			} catch(ex) {
				alert(ex);
			}
		}).catch((ex) => alert(ex));
		return;
	}
	
	publishModal.modalContentsInnerHTML = publishHTML;
	publishModal.modalSubmitBtnAction = function() { packageInAFolderAndPublish() };
	publishModal.show();
	
	

}



async function addMessageToDeleteModal(e) {
	try {
		if(!e || !e.detail || !e.detail.data || !e.detail.data.isFolder) return;
		
		const folder = e.detail.data.fullpath
			, checkPublishStateUrl = `/publish/details?folder=${folder.replace(/^\/|\/$/g, '')}`
			, resp = await fetch(checkPublishStateUrl)
			, json = await resp.json()
		;
		if(!json.link) return;
		
		const $div = document.querySelector('#deleteModal .modal-description')
			, $p = document.createElement('p')
		;
		$p.className = 'error'
		$p.innerHTML = '<b>WARNING</b>: This will also delete your published project';
		$div.appendChild($p);
		
	} catch(ex) {
		console.log(ex)
		return false;
	}
}

function mutateTableRow (data) {
	if(['profile.html', 'home.html', 'planets.json'].includes(data.fullpath)) return;
	if(!data.isOwner) return;
	data.menuIcons.push({
		id: data.id
		, text: 'publish'
		, className: 'publish'
		, title: 'publish'
		, onclick: publish
	});
}

window.addEventListener('deleteModalOpened', addMessageToDeleteModal)

export default { mutateTableRow }