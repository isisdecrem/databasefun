import Modal from '/libs/modal/script.js';

function menuClick(menuItem, data) {
	const tempPath = data.fullpath.split('/').reverse().map((p, i) => {
			if(i) return p;
			const pos = p.lastIndexOf('.');
			if(!pos) return p + '_copy';
			return p.substr(0, pos) + '_copy' + p.slice(pos) 
		}).reverse().join('/')
		, copyModal = new Modal({
			modalContainerId: 'copyModal'
			, modalTitleText: `Copy`
			, modalContentsInnerHTML: `
				<div class="modal-description">
					<p>Where would you like to save your copy of <b>${data.name}</b>?</p>
				</div>
				<div class="form-input">
					<div class="input-items default">
						<input type='text' value='${tempPath}' autofocus>
					</div>
				<div>
			`
			, modalSubmitBtnText: 'Copy'
			, modalSubmitBtnAction: function() {
				let name = copyModal.$modaler.querySelector('input').value.trim();
				if(!name || !name.trim()) return;
				name = name.replace(/\/+/g, '/').trim()
	            window.explorer.fetchAndReload(
		            `/explore/copy/${data.id}?name=${encodeURIComponent(name)}`
		            , {
		            	method: 'POST', modal: copyModal, reloadUrl: `/explore/list/${name.substring(0, name.lastIndexOf('/'))}`
		            }, (ex, resp) => {
		            	if(ex) alert(ex);
		            	resp.json().then((json) => {
		            		if(json.error) alert(json.error);
		            	}).catch((ex) => alert(ex));
		            }
		       );
				
			}
			, modalCancelBtnText: 'Cancel'
			, modalCancelBtnAction: function(){
				copyModal.destroy();
			}
		})
	;
	
	copyModal.show();	
}

function mutateTableRow (data) {
	if(data.isFolder) return;
	if(data.isApplet) return;
	if(!data.isOwner) return;
	data.menuIcons.push({
		id: data.id, text: 'copy', className: 'copy', title: 'copy', onclick: menuClick
	});
}

export default { mutateTableRow }