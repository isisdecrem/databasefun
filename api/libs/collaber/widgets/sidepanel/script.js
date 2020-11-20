document.getElementById("danger-test").addEventListener('click', (e) => {
	dangerTest()
})

function dangerTest() {
	restfull.del({path: '/collab/clear'}, (err, resp) => {
		console.log(err || resp)
	})
}


document.getElementById("close-sidepanel").addEventListener('click', (e) => {
	document.getElementById("share").style.display = "none";
	updateSidepanel("")
})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\||DATA||amp;');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var fileId = "";
var fileName = "";

var submit = document.getElementById("invite");

submit.addEventListener('click', addCollaber);

document.addEventListener('keypress', e => {
	if (e.which == 13) {
		addCollaber();
	}
})

window.updateSidepanel = function(id, name) {
	fileId = id;
	document.getElementById("file-name").innerHTML = fileId;
	// getCollabers();
}

function addCollaber() {
	const user = document.getElementById('collaber-input').value.trim();
	document.getElementById('collaber-input').value = "";
	if (user != '') {
		restfull.post({
			path: '/collab/share'
			, data: {
				fileId: fileId
				, collaber: user
				, date: new Date()
			}
		}, (err, resp) => {
			console.log(err || resp);
			// getCollabers()
		})
	}
}

function getCollabers() {
	restfull.post({
		path: '/collab/shared'
		, data: {
			file: fileName
		}
	}, (err, resp) => {
		console.log(err || "");
		let requests = JSON.parse(resp)
		console.log(requests)
		showCollabers(requests)
	})
}

function showCollabers(collabers) {
	document.getElementById('tbody').innerHTML = ''
	
	collabers.forEach(person => {
		var table = document.getElementById("tbody");

		var row = table.insertRow(0);
		
		// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		
		// Add some text to the new cells:
		cell1.innerHTML = person.collaber.person.ship.name;
		cell2.innerHTML = `<button collaber="${person.collaber.person.ship.name}" class="remove">REMOVE</button>`;
		
		cell2.setAttribute('class', 'right')
	})
	
	Array.from(document.getElementsByClassName("remove")).forEach(e => {
		e.addEventListener('click', function() {
			restfull.del({
				path: '/collab/shared',
				data: {
					file: fileName
					, collaber: e.getAttribute('collaber')
				}
			}, (err, resp) => {
				console.log(err || resp)
				getCollabers()
			})
		})
	})
}