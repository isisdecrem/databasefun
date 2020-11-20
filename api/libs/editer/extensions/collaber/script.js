import Indicator from '/libs/indicator/script.js';

window.isShared = {{ISSHARED}};


const CATS = ["Abyssinian", "Aegean", "American Bobtail", "American Curl", "American Ringtail", "American Wirehair", "Aphrodite Giant", "Arabian Mau", "Asian cat", "Asian Semi-longhair", "Australian Mist", "Balinese", "Bambino", "Bengal", "Birman", "Bombay", "British Longhair", "Burmese", "Burmilla", "Chantilly-Tiffany", "Chartreux", "Chausie", "Cyprus", "Devon Rex", "Dwelf", "Egyptian Mau", "German Rex", "Havana Brown", "Japanese Bobtail", "Kanaani", "Khao Manee", "Kinkalow", "Lambkin", "LaPerm", "Lykoi", "Maine Coon", "Manx", "Mekong Bobtail", "Minskin", "Napoleon", "Munchkin", "Nebelung", "Ocicat", "Ojos Azules", "Oregon Rex", "Peterbald", "Pixie-bob", "Ragdoll", "Raas", "Russian Blue", "Sam Sawet", "Savannah", "Scottish Fold", "Selkirk Rex", "Serengeti", "Serrade Petit", "Singapura", "Snowshoe", "Sokoke", "Somali", "Sphynx", "Suphalak", "Tonkinese", "Toyger", "Turkish Van", "Turkish Vankedisi", "Ukrainian Levkoy", "Wila Krungthep"]
	, CONVERGENCE_URL = '{{COLLABURL}}'
	, OWNERSHIP = {{OWNERSHIP}}
	, convergenceId = `${location.host}/${location.pathname.replace('/edit/', '')}`
	, AceRange = ace.require("ace/range").Range
	, cursorKey = 'cursor'
	, selectionKey = 'selection'
	, colorAssigner = new ConvergenceColorAssigner.ColorAssigner([
	    '#1E88E5',
	    '#AB47BC',
	    '#EF5350',
	    '#B71C1C',
	    '#4A148C',
	    '#0D47A1',
	    '#004D40',
	    '#1A237E',
	    '#E65100',
	    '#F4511E',
	    '#3E2723',
	    '#424242',
	    '#455A64',
	    '#1E88E5',
	    '#EC407A'
	])
	, $shareIndicator = document.querySelector('#collabbtn')
;

let domain = null
	, cursorManager = null
	, cursorReference = null
	, suppressEvents = false
	, doc = null
	, selectionManager = null
	, selectionReference = null
	, isConnected = false
	, activity = null
	, disconnectTo
	, modelId
	, username = localStorage.getItem('collaberName') ? localStorage.getItem('collaberName') : CATS[Math.floor(Math.random() * CATS.length)]
;

function handleOpen(model, cb) {
	const session = window.editor.getSession();
	doc = session.getDocument();
	
	const textModel = model.elementAt("text");
	modelId = model._modelId;
	
	initModel(textModel);
	initSharedCursors(textModel);
	initSharedSelection(textModel);
	lastSaveData = window.editor.getValue().trim();
	
	document.querySelector(".ace_editor").style.width = "100%";

	const activityService = domain.activities()	
		, presenceService = domain.presence()
	;
	window.editor.setReadOnly(false);

	activityService.join(convergenceId).then((a) => {
		activity = a;
		isConnected = true;
		if(OWNERSHIP) {
			presenceService.setState("isOwner", "true");
			
			document.addEventListener('saved', function() {
				activity.setState("saved", "true");
			});  
			
			document.addEventListener('saving', function() {
				activity.setState("saving", "done");
			}); 
			
			return cb();
		}
		
		const currentParticipants = activity.participants()
			, currentUsers = currentParticipants.reduce((o, p) => {
				o[p.user.username] = p.user.displayName;
				return o;
			}, {})
			, usernames = Object.keys(currentUsers)
			, ownerUserName = usernames[0]
			, ownerDisplayName = currentUsers[ownerUserName]
		;
		
		
		activity.on('session_left', (e) => {
			if(e.user.username !== ownerUserName) return;
			disconnectTo = setTimeout(() => {
				window.editor.setReadOnly(true);
				dcNotification();
			}, 2000)

		});
		activity.on('state_set', (e) => {
			if(e.key === 'saving') {
				window.isSaving = true;
			}
			if(e.key === 'saved') {
				window.savedResponse = 200; 
				window.isSaving = false;
				document.dispatchEvent(new Event('saved'));
			}
		})
		document.querySelector('#collabbtn > span').innerHTML = `You are in ${ownerDisplayName}'s collab`;
		cb();
	});
}

function initModel(textModel) {
	const session = window.editor.getSession();
	session.setValue(textModel.value());
	
	textModel.on("insert", (e) => {
	const pos = doc.indexToPosition(e.index);
	suppressEvents = true;
	doc.insert(pos, e.value);
	suppressEvents = false;
	});
	
	textModel.on("remove", (e) => {
	const start = doc.indexToPosition(e.index);
	const end = doc.indexToPosition(e.index + e.value.length);
	suppressEvents = true;
	doc.remove(new AceRange(start.row, start.column, end.row, end.column));
	suppressEvents = false;
	});
	
	textModel.on("value", function (e) {
	suppressEvents = true;
	doc.setValue(e.value);
	suppressEvents = false;
	});
	
	window.editor.on('change', (delta) => {
	if (suppressEvents) {
	  return;
	}
	
	const pos = doc.positionToIndex(delta.start);
	switch (delta.action) {
	  case "insert":
	    textModel.insert(pos, delta.lines.join("\n"));
	    break;
	  case "remove":
	    textModel.remove(pos, delta.lines.join("\n").length);
	    break;
	  default:
	    throw new Error("unknown action: " + delta.action);
	}
	});
}

function initSharedCursors(textElement) {
	const session = window.editor.getSession();
	cursorManager = new AceCollabExt.AceMultiCursorManager(session);
	cursorReference = textElement.indexReference(cursorKey);
	
	const references = textElement.references({key: cursorKey});
	references.forEach((reference) => {
		if (!reference.isLocal()) {
		  addCursor(reference);
		}
	});
	
	setLocalCursor();
	cursorReference.share();
	
	session.selection.on('changeCursor', () => setLocalCursor());
	
	textElement.on("reference", (e) => {
		if (e.reference.key() === cursorKey) {
			addCursor(e.reference);
		}
	});
}

function setLocalCursor() {
	const position = window.editor.getCursorPosition();
	const index = doc.positionToIndex(position);
	cursorReference.set(index);
}

function addCursor(reference) {
	const color = colorAssigner.getColorAsHex(reference.sessionId());
	const remoteCursorIndex = reference.value();
	cursorManager.addCursor(reference.sessionId(), reference.user().displayName, color, remoteCursorIndex);
	
	reference.on("cleared", () => cursorManager.clearCursor(reference.sessionId()));
	reference.on("disposed", () => cursorManager.removeCursor(reference.sessionId()));
	reference.on("set", () => {
		const cursorIndex = reference.value();
		const pos = doc.indexToPosition(cursorIndex);
		cursorManager.setCursor(reference.sessionId(), cursorIndex);
	});
}			

function initSharedSelection(textModel) {
	const session = window.editor.getSession();
	selectionManager = new AceCollabExt.AceMultiSelectionManager(session);
	
	selectionReference = textModel.rangeReference(selectionKey);
	setLocalSelection();
	selectionReference.share();
	
	session.selection.on('changeSelection', () => setLocalSelection());
	
	const references = textModel.references({key: selectionKey});
	references.forEach((reference) => {
	if (!reference.isLocal()) {
	  addSelection(reference);
	}
	});
	
	textModel.on("reference", (e) => {
	if (e.reference.key() === selectionKey) {
	  addSelection(e.reference);
	}
	});
}

function setLocalSelection() {
	if (!window.editor.selection.isEmpty()) {
	const aceRanges = window.editor.selection.getAllRanges();
	const indexRanges = aceRanges.map((aceRagne) => {
	  const start = doc.positionToIndex(aceRagne.start);
	  const end = doc.positionToIndex(aceRagne.end);
	  return {start: start, end: end};
	});
	
	selectionReference.set(indexRanges);
	} else if (selectionReference.isSet()) {
	selectionReference.clear();
	}
}

function addSelection(reference) {
	const color = colorAssigner.getColorAsHex(reference.sessionId());
	const remoteSelection = reference.values().map(range => toAceRange(range));
	selectionManager.addSelection(reference.sessionId(), reference.user().username, color, remoteSelection);
	
	reference.on("cleared", () => selectionManager.clearSelection(reference.sessionId()));
	reference.on("disposed", () => selectionManager.removeSelection(reference.sessionId()));
	reference.on("set", () => {
	selectionManager.setSelection(
	  reference.sessionId(), reference.values().map(range => toAceRange(range)));
	});
}

function toAceRange(range) {
	if (typeof range !== 'object') {
	return null;
	}
	
	let start = range.start;
	let end = range.end;
	
	if (start > end) {
	const temp = start;
	start = end;
	end = temp;
	}
	
	const rangeAnchor = doc.indexToPosition(start);
	const rangeLead = doc.indexToPosition(end);
	return new AceRange(rangeAnchor.row, rangeAnchor.column, rangeLead.row, rangeLead.column);
}

function dcNotification() {
	const notifModal = new Modal({
		modalContainerId: 'notifModal'
		, modalTitleText: `Disconnected!`
		, modalContentsInnerHTML: `<p>The owner of this file has stopped collaborating. You are now unable to make changes to the file.</p>`
		, modalSubmitBtnText: 'OK'
		, modalSubmitBtnAction: function(){
			notifModal.destroy();
			location.reload();
		}
	})
	
	notifModal.show();
}

function cNotification() {
	const cnotifModal = new Modal({
		modalContainerId: 'cnotifModal'
		, modalTitleText: `Connected!`
		, modalContentsInnerHTML: `<p>The owner of this file has started collaborating. You are now able to make changes to the file.</p>`
		, modalSubmitBtnText: 'OK'
		, modalSubmitBtnAction: function(){
			cnotifModal.destroy();
		}
	})
	
	cnotifModal.show();
}

function setUsername(name) {
	username = name.trim().substr(0,25).replace(/</g, '&lt;').replace(/>/g, '&gt;');
	localStorage.setItem("collaberName", name)
}

function stopCollab() {
	stopShare()	
}

function startCollab() {
	const startCollabModal = new Modal({
		modalContainerId: 'startCollabModal'
		, modalTitleText: `Qoom Instant Collab`
		, modalContentsInnerHTML:
			`<form class="modal-description">
    			<div class="form-input">
					<p>File Link</p>
					<div class="input-items"><input type='text' disabled value='${location.href}'></div>
    			</div>
			    <div class="form-input">
    				<p>Enter Your Name</p>
					<div class="input-items"><input type='text' id='collabusername' value='${username}'></div>
				</div>
			</form>
			<p class='collab-msg'>⚠️ <span>Please turn off an ad blocker if it is on.</span> Qoom Collab uses WebSocket technology, which is usually blocked by ad blockers.
			</p>`
		, modalSubmitBtnText: 'Start Collab'
		, modalSubmitBtnAction: function(){
			startShare((err) => {
				if(err) return alert(err);
				setUsername(document.querySelector('#startCollabModal #collabusername').value);
				startCollabModal.destroy();
				showCollaborationOnModal();
			});
		}
		, modalCancelBtnText: 'Cancel'
		, modalCancelBtnAction: function() {
			startCollabModal.destroy()
		}
	})
	
	startCollabModal.show();
}

function joinCollab() {
	const joinCollabModal = new Modal({
		modalContainerId: 'joinCollabModal'
		, modalTitleText: `Join Collab`
		, modalContentsInnerHTML:
			`<div class="modal-description">
				<p>You are about to join a collaboration session.</p>
				<div class="form-input">
					<p>Enter Your Name</p>
					<div class="input-items"><input type='text' id='collabusername' value='${username}'></div>
				</div>
				<p class='collab-msg'>⚠️ <span>Please turn off an ad blocker if it is on.</span> Qoom Collab uses WebSocket technology, which is usually blocked by ad blockers.</p>
			</div>`
		, modalSubmitBtnText: 'Join'
		, modalSubmitBtnAction: function(){
			setUsername(document.querySelector('#joinCollabModal #collabusername').value);
			connectToConvergence((err) => {
				if(err) return alert(err);
				joinCollabModal.destroy();
			});
		}
		, modalCancelBtnText: 'Cancel'
		, modalCancelBtnAction: function() {
			joinCollabModal.destroy()
		}
	})
	
	joinCollabModal.show();
}

function showCollaborationOnModal() {
	const showCollabOnModal = new Modal({
		modalContainerId: 'showCollabOnModal'
		, modalTitleText: `Collaboration On`
		, modalContentsInnerHTML:
			`<div class="modal-description">
				<p>Collaboration mode is on. Copy and share the link to invite.</p>
				<div class="collab-info">
					<p>Your Name: ${username}</p>
					<p id='copylink'>${location.href}</p>
				</div>
			</div>`
		, modalSubmitBtnText: 'Copy Link'
		, modalSubmitBtnAction: function(){
			const copyLink = document.getElementById('copylink');
			navigator.clipboard.writeText(copyLink.innerText.trim())
			showCollabOnModal.destroy();
			if(isConnected) return;
			connectToConvergence((err) => {
				if(err) return alert(err);
				$shareIndicator.removeEventListener('click', startCollab);
				$shareIndicator.addEventListener('click', stopCollab);
			});
		}
		, modalSecondBtnText: 'Stop Collab'
		, modalSecondBtnAction: async function() {
			showCollabOnModal.destroy();

			if(activity) activity.leave();
			const resp = await fetch('/collab/unshare', {method: 'POST'})
				, json = await resp.json()
			;
			if(!json.success) err = JSON.stringify(json);
			$shareIndicator.classList.remove('enabled');
			setTimeout(function() {
				location.reload();
			}, 500);
		}
		, modalCancelBtnText: 'Close'
		, modalCancelBtnAction: function() {
			showCollabOnModal.destroy();
			if(isConnected) return;
			connectToConvergence((err) => {
				if(err) return alert(err);
				$shareIndicator.removeEventListener('click', startCollab);
				$shareIndicator.addEventListener('click', stopCollab);
			});
		}
	})
	
	showCollabOnModal.show();
}

function onClose() {
	if(!isConnected || !OWNERSHIP) return;
	fetch('/collab/unshare', {method: 'POST'});
	if(activity) activity.leave();
	return ""; //Leave page? This will kick everyone off the collaboration.";
}

function stopShare(cb) {
	if(!OWNERSHIP) return cb('It seems that you are not the owner');
	showCollaborationOnModal();
}

async function startShare(cb) {
	if(!OWNERSHIP) return cb('It seems that you are not the owner');
	let err = null;
	try {
		const resp = await fetch('/collab/share', {method: 'POST'})
			, json = await resp.json()
		;
		if(!json.success) err = JSON.stringify(json);
		else $shareIndicator.classList.add('enabled');
	} catch(ex) {
		err = ex;
	} finally {
		cb(err);
	}
}

function connectToConvergence(cb) {
	cb = cb || function() {};
	if(isConnected) return cb();
	Convergence.connectAnonymously(CONVERGENCE_URL, username)
	.then(d => {
		domain = d;
		return domain.models().openAutoCreate({
		  collection: location.host,
		  id: convergenceId,
		  ephemeral: true,
		  data: {
		    text: window.editor.getValue()
		  }
		})
	})
	.then((model) => {
		handleOpen(model, cb)
	})
	.catch(error => {
		cb("Could not open model ", error);
	});
}

window.onclose.collab = onClose;

window.addEventListener('load',() => {
	if( !OWNERSHIP && !isShared) return;
	
	if( !OWNERSHIP && isShared) {
		$shareIndicator.classList.add('show');
		$shareIndicator.classList.add('enabled');
		joinCollab();
		return
	}
	
	if( OWNERSHIP && isShared) {
		$shareIndicator.classList.add('show');
		$shareIndicator.classList.add('enabled');
		showCollaborationOnModal()
		$shareIndicator.addEventListener('click', stopCollab);
		return;
	}
	
	if( OWNERSHIP && !isShared) {
		$shareIndicator.classList.add('show');
		$shareIndicator.addEventListener('click', startCollab);
		return;
	}
})