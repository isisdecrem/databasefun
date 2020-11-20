let pushing = false;

export const removePastGitConfig = async (options) => {
	await fetch('/migrate/remove-past-git-config', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: options._id
		})
	})
}

export const refreshPastGitConfigs = async () => {
	const pastConnectionsContainer = document.querySelector('.migrater-git-past-connections-container');
	pastConnectionsContainer.innerHTML = '';
	const resp = await fetch('/migrate/past-git-configs', {
        method: 'GET',
    });
    const pastGitConfigs = await resp.json();
    for (const config of pastGitConfigs) {
    	pastConnectionsContainer.innerHTML += `
	    	<div class="migrater-git-past-connection">
				<div class="migrater-git-past-connection-auth-container">
					<div><div>Access Token:</div><div>${config.token}</div></div>
					<div><div>Username:</div><div>${config.username}</div></div>
					<div><div>URL:</div><div>${config.url}</div></div>
				</div>
				<div class="migrater-git-past-connection-buttons-container">
					<div class="migrater-git-past-connection-button-container">
						<div class="migrater-git-past-connection-button migrater-git-past-connection-remove-button qoom-main-btn qoom-button-outline qoom-button-small" data-config=${JSON.stringify(config)}>Remove
						</div>
					</div>
				</div>
			</div>
    	`.trim();
    }
    if (pastGitConfigs.length === 0) {
    	pastConnectionsContainer.innerText = 'No past connections yet'
    }
    for (const button of document.querySelectorAll('.migrater-git-past-connection-remove-button')) {
    	button.onclick = async () => {
    		const config = JSON.parse(button.getAttribute('data-config'));
    		await removePastGitConfig(config);
    		await refreshPastGitConfigs();
    	}
    }

}

export const showPastGitConfigs = async () => {
	const $addToGit = document.querySelector('#add-git-token');
	$addToGit.addEventListener('click', connectToGit)
	refreshPastGitConfigs();
}

export const connectToGit = async () => {
    const $accessToken = document.querySelector('.migrater-git-auth-token');
    const $gitURL = document.querySelector('.migrater-git-url');
    const $gitUserName = document.querySelector('.migrater-git-username');

    const accessToken = $accessToken.value.trim();
    const gitURL = $gitURL.value.trim();
    const gitUserName = $gitUserName.value.trim();
    
    if(!accessToken) return alert('No Access Token Provided');
    if(!gitURL) return alert('No Git Url Provided');
    if(!gitUserName) return alert('No Git User Name Provided');
    if(!/(^http[s]?:\/\/)([^\/\s]+)/i.test(gitURL)) return alert('Invalid Git URL provided');
    
    const resp = await fetch('/migrate/add-git-token', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
            accessToken,
            gitUserName,
            gitURL
        }),
    });
    
	$accessToken.value = '';
	$gitURL.value = '';
	$gitUserName.value = '';
    refreshPastGitConfigs();
};