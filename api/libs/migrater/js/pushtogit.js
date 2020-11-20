const $pushToGitUrl = document.querySelector('#pushToGitUrl')
	, $pushToGitBtn = document.querySelector('#pushToGitBtn')
;

let pushed = false;
function push() { 
	if(pushed) return alert('Already Pushed');
	
	const url = $pushToGitUrl.value;
	if(!url) return alert('No url provided');
	
	pushed = true;
	fetch('/migrate/push-all-to-git', {
		method: 'POST'
		, headers: { 'Content-Type': 'application/json' }
		, body: JSON.stringify({
            gitURL : url
		})
	});
}


if($pushToGitBtn) $pushToGitBtn.addEventListener('click', push);

export default push;