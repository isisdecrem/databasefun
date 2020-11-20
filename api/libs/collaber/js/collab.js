const CATS = ["Abyssinian", "Aegean", "American Bobtail", "American Curl", "American Ringtail", "American Wirehair", "Aphrodite Giant", "Arabian Mau", "Asian cat", "Asian Semi-longhair", "Australian Mist", "Balinese", "Bambino", "Bengal", "Birman", "Bombay", "British Longhair", "Burmese", "Burmilla", "Chantilly-Tiffany", "Chartreux", "Chausie", "Cyprus", "Devon Rex", "Dwelf", "Egyptian Mau", "German Rex", "Havana Brown", "Japanese Bobtail", "Kanaani", "Khao Manee", "Kinkalow", "Lambkin", "LaPerm", "Lykoi", "Maine Coon", "Manx", "Mekong Bobtail", "Minskin", "Napoleon", "Munchkin", "Nebelung", "Ocicat", "Ojos Azules", "Oregon Rex", "Peterbald", "Pixie-bob", "Ragdoll", "Raas", "Russian Blue", "Sam Sawet", "Savannah", "Scottish Fold", "Selkirk Rex", "Serengeti", "Serrade Petit", "Singapura", "Snowshoe", "Sokoke", "Somali", "Sphynx", "Suphalak", "Tonkinese", "Toyger", "Turkish Van", "Turkish Vankedisi", "Ukrainian Levkoy", "Wila Krungthep"]

const CONVERGENCE_URL = 'wss://qoom.rocks/api/realtime/convergence/default';

var defaultEditorContents = {{FILECONTENTS}};

const OWNERSHIP = {{OWNERSHIP}};

// Connect to the domain.  See ../config.js for the connection settings.

convergenceId = `${location.host.split('.')[0]}/${location.href.split("?file=")[1]}`;

const username = localStorage.getItem('collaberName') ? localStorage.getItem('collaberName') : CATS[Math.floor(Math.random() * CATS.length)];

let domain = null
let editingAbilities = true

Convergence.connectAnonymously(CONVERGENCE_URL, username)
.then(d => {
	domain = d;
	console.log(domain)
	// Now open the model, creating it using the initial data if it does not exist.
	return domain.models().openAutoCreate({
	  collection: "example-ace",
	  id: convergenceId,
	  ephemeral: true,
	  data: {
	    "text": defaultEditorContents
	  }
	})
})
.then(handleOpen)
.catch(error => {
	console.error("Could not open model ", error);
});

const AceRange = ace.require("ace/range").Range;

const colorAssigner = new ConvergenceColorAssigner.ColorAssigner();

let editor = null;
let session = null;
let doc = null;

function handleOpen(model) {
	editor = ace.edit("ace-editor");
	editor.setTheme('ace/theme/monokai');
	
	session = editor.getSession();
	//session.setMode('ace/mode/{{LANGUAGE}}');
	session.setMode('ace/mode/javascript');
	
	doc = session.getDocument();
	
	const textModel = model.elementAt("text");
	
	//setLastSaveData();
	
	initModel(textModel);
	initSharedCursors(textModel);
	initSharedSelection(textModel);
	
	//const radarViewElement = document.getElementById("radar-view");
	//initRadarView(textModel, radarViewElement);
	
	let editorDiv = document.querySelector(".wrapped-editor");
	editorDiv.style.width = window.innerWidth + "px";
	editorDiv.style.height = window.innerHeight + "px";
	editorDiv.style.top = "0px";
	editorDiv.style.left = "0px";
	
	window.addEventListener('resize', e => {
		let editorDiv = document.querySelector(".wrapped-editor");
		editorDiv.style.width = window.innerWidth + "px";
		editorDiv.style.height = window.innerHeight + "px";
	})
	
	document.getElementById('set-name').addEventListener('click', e => {
		let name = prompt("Select a name you wish to display:")
		localStorage.setItem("collaberName", name)
		
		location.reload()
	})
	
	document.getElementById('toggle-share').style.display = "inline" ? OWNERSHIP : null
	document.getElementById('toggle-share').addEventListener('click', e => {
		stopShare()
	})
	
	document.querySelector(".ace_editor").style.width = "100%"
	
	OWNERSHIP ? document.getElementById('toggle-share').style.display = 'inline' : null
	
	startShare()
	
	checkForOwner()
	
	session.on('disconnect', (e) => {
		if (!OWNERSHIP) {
			alert("Editing has been disabled")
			editor.setReadOnly(true);
			editingAbilities = false
		}
	})
	// A GLOBAL RECEIVE HERE
}

/////////////////////////////////////////////////////////////////////////////
// Text Binding /////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
let suppressEvents = false;

function initModel(textModel) {
  const session = editor.getSession();
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

  editor.on('change', (delta) => {
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

/////////////////////////////////////////////////////////////////////////////
// Cursor Binding
/////////////////////////////////////////////////////////////////////////////
const cursorKey = "cursor";
let cursorReference = null;
let cursorManager = null;

function initSharedCursors(textElement) {
  cursorManager = new AceCollabExt.AceMultiCursorManager(editor.getSession());
  cursorReference = textElement.indexReference(cursorKey);

  const references = textElement.references({key: cursorKey});
  references.forEach((reference) => {
    if (!reference.isLocal()) {
      addCursor(reference);
    }
  });

  setLocalCursor();
  cursorReference.share();

  editor.getSession().selection.on('changeCursor', () => setLocalCursor());

  textElement.on("reference", (e) => {
    if (e.reference.key() === cursorKey) {
      this.addCursor(e.reference);
    }
  });
}

function setLocalCursor() {
  const position = editor.getCursorPosition();
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
  
    
    // if (radarView.hasView(reference.sessionId())) {
    //   radarView.setCursorRow(reference.sessionId(), cursorRow);
    // }
  });
}

/////////////////////////////////////////////////////////////////////////////
// Selection Binding
/////////////////////////////////////////////////////////////////////////////
let selectionManager = null;
let selectionReference = null;
const selectionKey = "selection";

function initSharedSelection(textModel) {
  selectionManager = new AceCollabExt.AceMultiSelectionManager(editor.getSession());

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
  if (!editor.selection.isEmpty()) {
    const aceRanges = editor.selection.getAllRanges();
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


/////////////////////////////////////////////////////////////////////////////
// The auto saving stuff ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
var $container = document.getElementsByTagName("body")[0];
$container.onkeyup = keyUpHandler;

var lastSaveData = null;
var isEditing = false;
var isSaving = false;

function setLastSaveData() {
	lastSaveData = editor.getValue().trim();
}

function keyUpHandler(e) {
	if (isEditing) return;
    isEditing = true;
    setTimeout(function() {
        isEditing = false
    }, 2000);
    if (e.ctrlKey && e.keyCode === 83) return saveContents();
}

function saveContents() {
    var val = editor.getValue().trim();
    if (isSaving || val === lastSaveData || isEditing) return;
    isSaving = true;
    post(val, function() {
        lastSaveData = val;
        isSaving = false;
    });
    return false;
}

function post(data, callback) {
    var req = new XMLHttpRequest();
    req.open("POST", "/save" + location.search, true);
    req.setRequestHeader("content-type", "application/json")
    if(localStorage && localStorage.passcode) {
        req.setRequestHeader("secret", localStorage.passcode)
    }
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if(req.status == 200) console.log("saved");
            callback();
        }
    }
    req.send(JSON.stringify({
        text: data
    }));
}

window.onbeforeunload = function() {
	OWNERSHIP ? stopShare() : null
	
	var val = editor.getValue().trim();
    saveContents();
    if (val === lastSaveData) return;
	return 'Are you sure you want to exit?';
}

/////////////////////////////////////////////////////////////////////////////
// Miscellaneaous ///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function stopShare() {
	if (OWNERSHIP && confirm("Are you sure you want to stop sharing with everyone? This will kick everyone off the collaboration.")) {
		async function post() {
			const resp = await fetch('/collab/disconnect', {
			    method: 'POST'
			    , body: JSON.stringify({data: convergenceId}) 
			    , headers: {
			      'Content-Type': 'application/json'
			    }
			})
		  const json = await resp.json();
		  console.log(json);
		}
		post()
		
		var oldButton = document.getElementById("toggle-share");
		var newButton = oldButton.cloneNode(true);
		oldButton.parentNode.replaceChild(newButton, oldButton);
		newButton.innerText = "Start Share"
		
		newButton.addEventListener('click', e => {
			startShare()
		})
	}
}

function startShare() {
	if (OWNERSHIP) {
		async function post() {
			const resp = await fetch('/collab/connect', {
			    method: 'POST'
			    , body: JSON.stringify({data: convergenceId}) 
			    , headers: {
			      'Content-Type': 'application/json'
			    }
			})
		  const json = await resp.json();
		  console.log(json);
		}
		post()
		
		var oldButton = document.getElementById("toggle-share");
		var newButton = oldButton.cloneNode(true);
		oldButton.parentNode.replaceChild(newButton, oldButton);
		newButton.innerText = "Stop Share"
		
		newButton.addEventListener('click', e => {
			stopShare()
		})
	}
}

function checkForOwner() {
	if (!OWNERSHIP) {
		async function post() {
			const resp = await fetch('/collab/check', {
			    method: 'POST'
			    , body: JSON.stringify({data: convergenceId}) 
			    , headers: {
			      'Content-Type': 'application/json'
			    }
			})
		  const json = await resp.json();
		  console.log(json);
		  
		  if (!json && editingAbilities) {
		  	editingAbilities = false;
			alert("Editing has been disabled")
			editor.setReadOnly(true);
		  } else if (json && !editingAbilities) {
		  	editingAbilities = true;
			alert("Editing has been enabled")
			editor.setReadOnly(false);
		  }
		}
		post()
	}
}

setInterval(saveContents, 1000);
setInterval(checkForOwner, 1000)

// If accessing the page as owner, should have a button that says start/stop, stop = everyone gets kicked off
// Make it so if the original owner is not on, you should not be able to access it

// Use fetch to do this