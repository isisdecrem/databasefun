import Modal from '/libs/modal/script.js';

const flow = 'deploy_latest_version';

let styles = ``;

let $deployer, $deployerDropdown, $deployerButton, $style, socket, log = [], input = {}, $log, $pre, deploying = false;


function addToLog(item) {
	if(!$pre || !$log) return;
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

async function push() {
	if($deployerDropdown.value.startsWith('--')) return alert('Please select a dyno');
	log = [];
	input = {};

	const planet = $deployerDropdown.value
		, deployModal = new Modal({
			modalContainerId: 'deployModal'
			, modalTitleText: `Deploy to ${planet}?`
			, modalContentsInnerHTML: `
			    <div id='deployer_log' style='max-height:40vh; overflow:auto;'>
					<pre></pre>
				</div>`
			, modalSubmitBtnText: 'Deploy'
			, modalSubmitBtnAction: async function() {
				if(deploying) return;
				try {
					log = [];
					input = {};
					$log = document.querySelector('#deployer_log');
					$pre = $log.querySelector('pre');
					addToLog('Starting');
					deploying = true;
					const resp = await fetch('/deploy/push', {
								method: 'POST'
								, headers: {'Content-Type': 'application/json'}
								, body: JSON.stringify({flowname: flow, dynoname: planet})
							})
						, json = await resp.json()
					;
					handleWorkIntiation(json);
				} catch(ex) {
					addToLog(ex);
				}
				
			}
			, modalCancelBtnText: 'Cancel'
			, modalCancelBtnAction: function(){
				log = [];
				input = {};
				deployModal.destroy();
			}
		})
	;
	deployModal.show();	
}

async function getPlanets() {
	const resp = await fetch('/deploy/planets')
		, planets = await resp.json()
	;
	planets.forEach(planet => {
		const $option = document.createElement('option');
		$option.innerHTML = planet;
		$option.value = planet;
		$deployerDropdown.appendChild($option);
	})
}

function createTool(options) {
	
	$deployer = document.createElement('div');
	$deployerDropdown = document.createElement('select');
	$deployerButton = document.createElement('button');
	
	$deployerDropdown.innerHTML = '<option>-- Choose a Planet --</option>'
	$deployerButton.innerHTML = 'Push';
	$style = document.createElement('style');
	
	$deployer.appendChild($deployerDropdown);
	$deployer.appendChild($deployerButton);
	$style.innerHTML = styles;
	
	window.explorer.$toolboxb.appendChild($deployer);
	document.head.appendChild($style);
	$deployerButton.addEventListener('click', push)
	getPlanets()
}

window.addEventListener('navigatestart', () => {
	if(!$deployer) return;
	$deployer.style.display = 'none';
});

window.addEventListener('navigateend', () => {
	if(!$deployer) return;
	const qs = new URLSearchParams(location.search.slice(1))
		, memberId = qs.get('member')
		, currentMember = memberId ? members.find(m => m._id === memberId) : {}
		, isOwner = !memberId || (currentMember.ship === location.host)
	;
	$deployer.style.display = isOwner ? 'block' : 'none'
})

export default { createTool }