var $rollbackModalContainer = document.querySelector('.rollback-modal-container');
var rollbackModalContents = $rollbackModalContainer.innerHTML;

function showRollbackModal(file, items) {
	$rollbackModalContainer.innerHTML = rollbackModalContents.replace('{{ITEMS}}', (items || []).map(item => 
		`<option value='${item._id}'>${new Date(item.dateUpdated).toLocaleString()}</option>`
		)
	)
	
	var $rollbackModalClose = document.querySelector('.rollback-modal-close')
		, $rollbackModalCancel = document.querySelector('.rollback-modal-cancel')
		, $rollbackModalPreview = document.querySelector('.rollback-modal-preview')
		, $rollbackModalConfirm = document.querySelector('.rollback-modal-confirm')
		, $rollbackItems = document.querySelector('.rollback-items')
	;
	
	$rollbackModalContainer.style.display = 'block';
	$rollbackModalCancel.addEventListener('click', closeRollbackModal);
	$rollbackModalClose.addEventListener('click', closeRollbackModal);
	$rollbackModalPreview.addEventListener('click', function() {
		showRollbackPreview(file._id, $rollbackItems.value);
	});
	$rollbackModalConfirm.addEventListener('click', function(){
		var val = $rollbackItems.value;
		if(!val) return swal('Please select a date to rollback to')
		swal({
			buttons: {
				cancel: 'cancel',
				confirm: {text: 'Rollback'}
			}
			, title: 'Rollback. Are you sure?'
		})
		.then((doit) => {
			if (!doit) return;
			rollback(val);
		})
	});
}


function closeRollbackModal() {
	$rollbackModalContainer.style.display = 'none';
}

function showRollbackPreview(fileaId, filebId) {
	window.open(`/diff/${fileaId}/${filebId}`)
}

function rollback(rollbackId) {
	restfull.patch({
		path: '/rollback/' + rollbackId
		, loadDivs: document.querySelectorAll('.rollback-modal')
	}, function(err, data) {
		if(err) return alert(err.error || err);
		closeRollbackModal()
	})
}

window.showRollbackModal = showRollbackModal;