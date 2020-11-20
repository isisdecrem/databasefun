const $updaterPull = document.getElementById('updater_pull')
	, $updaterModal = document.getElementById('updater_modal')
	, $log = document.getElementById('updater_log')
	, $pre = $log.querySelector('pre')
	, $close = document.getElementById('updater_modal_close')
	, flow = 'update_latest_version'
	, $menuContainer = document.querySelector('.navMenuHeader')
;    

let socket, log = [], input = {};

async function pull() {
	try {
		log = [];
		input = {};
		$updaterModal.style.display = 'block';
		$pre.innerHTML = '';
		addToLog('Starting');

		const resp = await fetch('/update/pull'
				, {
					method: 'POST'
					, headers: {'Content-Type': 'application/json'}
					, body: JSON.stringify({flowname: flow, version: 'latest'})
				})
			, json = await resp.json()
		;
		handleWorkIntiation(json);
		
	} catch(ex) {
		addToLog(ex);
	}
}

function close() {
	$updaterModal.style.display = 'none';
}

function addToLog(item) {
	log.push(typeof(item) === 'object' ? JSON.stringify(item, null, '\t') : item + '');
	$pre.innerHTML = log.map(l => l.replace(/"/g, '')).join('\n\n');
	$log.scrollTo(0,$log.scrollHeight);
}

function handleWorkIntiation(workDetails) {
	socket = io(`/work/${workDetails.socketId}`);
	socket.on('workupdate', function(data) {
		if(data.error) return addToLog(data.error);
		if(data.data && data.data.stepName) return addToLog(`${data.message}: ${data.data.stepName}`);
		addToLog(data.message);
	});
}

$updaterPull.addEventListener('click', pull);
$close.addEventListener('click', close);
$menuContainer.appendChild($updaterPull)