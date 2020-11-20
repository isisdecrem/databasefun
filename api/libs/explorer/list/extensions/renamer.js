import Modal from '/libs/modal/script.js';

function menuClick(menuItem, data) {
	const tempPath = data.fullpath.split('/').reverse().map((p, i) => {
			// if(i) return p;
			// const pos = p.lastIndexOf('.');
			// if(!pos) return p + '_new';
			// return p.substr(0, pos) + '_new' + p.slice(pos) 
			return p;
		}).reverse().join('/')
		, renameModal = new Modal({
			modalContainerId: 'renameModal'
			, modalTitleText: `Rename`
			, modalContentsInnerHTML: `
				<div class="form-input">
					<div class="input-items default"><input type='text' value='${tempPath}' autofocus></div>
				</div>
			`
			, modalSubmitBtnText: 'rename'
			, modalSubmitBtnAction: function() {
				let name = renameModal.$modaler.querySelector('input').value; 
				if(!name || !name.trim()) return;
				name = name.replace(/<|>/g, '').replace(/\/+/g, '/').trim()
	            window.explorer.fetchAndReload(
		            `/explore/move/${data.id}?name=${encodeURIComponent(name)}`
		            , {
		            	method: 'PATCH', modal: renameModal, reloadUrl: `/explore/list/${name.substring(0, name.lastIndexOf('/'))}`
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
				renameModal.destroy();
			}
		})
	;
	
	renameModal.show();	

}

function mutateTableRow (data) {
	if(['profile.html', 'home.html', 'planets.json'].includes(data.fullpath)) return;
	if(data.isApplet) return;
	if(data.isFolder) return;
	if(!data.isOwner) return;
	data.menuIcons.push({
		id: data.id, text: 'rename', className: 'rename', title: 'rename', onclick: menuClick
	});
}

export default { mutateTableRow }