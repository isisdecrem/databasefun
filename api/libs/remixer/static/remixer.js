import {removeRemixerUiWindow} from './remixerInject.js';


class Remixer {
	constructor(node, remixUrl, remixAppName) {
		this.node = node;
		this.remixUrl = remixUrl;
		this.remixAppName = remixAppName;
	}
	
	async start() {
		await Promise.allSettled([
			this.replaceAppName(),
			this.bindCreateNew(),
			this.bindClose(),
			this.bindCloneToExisting(),
		]);
	}
	
	async replaceAppName() {
		const appNameAs = this.node.querySelectorAll('.remixer-app-name');
		for (const appNameA of appNameAs) {
			appNameA.innerText = this.remixAppName;
			appNameA.href = this.remixUrl;
		}
	}
	async bindCreateNew() {
		const createNewButton = this.node.querySelector('.remixer-create-new-button');
		createNewButton.addEventListener('click', () => {
			const email = document.querySelector('.remixer-email-input').value;
			this.remixWithNewDomain(email);
		})
	}
	async bindCloneToExisting() {
		const remixerCloneToExistingButton = this.node.querySelector('.remixer-clone-to-existing-button');
		remixerCloneToExistingButton.addEventListener('click', ()=> {
			const domain = document.querySelector('.remixer-domain-input').value;
			const password = document.querySelector('.remixer-password-input').value;
			this.remixWithDomainAndPassword(domain, password);
		})
	}
	async bindClose() {
		const closeButton = this.node.querySelector('.remixer-close-modal-button');
		closeButton.addEventListener('click', async () => {
			await removeRemixerUiWindow()
		})
	}
	async remixWithDomainAndPassword(domain, password) {
		await this.clone(domain, password);
		await this.redirectToIndex(domain, password)
	}
	async remixWithNewDomain(email) {
		const domainResp = await fetch('/remix/domain-name', {
			method: 'POST',
		});
		const {domain} = await domainResp.json();
		// console.log(domain);
		await this.registerDomain(email, domain);
	}
	async registerDomain(email, domain) {
		console.log(email, domain);
		const subdomain = domain.split('.')[0];
		const remote = 'https://'+ domain + '/trial' +'/register/';
		console.log(subdomain);
		const resp = await fetch('/remix/register-remote', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'	
			},
			body: JSON.stringify({
				subdomain,
				email,
				remote,
				remixUrl: this.remixUrl,
				remixAppName: this.remixAppName
			})
		});
		const body = await resp.json();
		const connectSid = body.connectSid || "";
		const passcode = body.passcode || "";
		if (connectSid || passcode) {
			await this.clone(domain, passcode, connectSid);
			await this.redirectToIndex(domain, passcode, connectSid);
		};
	}
	async clone(domain, passcode, connectSid) {
		const remote = 'https://'+ domain + '/remix' + '/remix';
		const resp = await fetch('/remix/remix-remote', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'	
			},
			body: JSON.stringify({
				shipName: domain,
				remote,
				remixUrl: this.remixUrl,
				remixAppName: this.remixAppName,
				passcode: passcode,
				connectSid: connectSid,
			})
		});
	}
	async redirectToIndex(domain, passcode, connectSid) {
		const indexUrl=`/explore?folder=/${this.remixAppName}`;
		const encodedIndexUrl = btoa(encodeURIComponent(indexUrl));
		const encodedConnectSid = connectSid ? btoa(encodeURIComponent(connectSid)) : '';
		const encodedPasscode = passcode ? btoa(encodeURIComponent(passcode)) : '';
		const fullUrl = `https://${domain}/remix/remix-login?urlToRedirect=${encodedIndexUrl}&passcode=${encodedPasscode}&connectSid=${encodedConnectSid}`;
		const a = document.createElement('a');
		document.body.appendChild(a);
		a.href = fullUrl;
		a.target = "_blank";
		a.click();
	}
}



const main = async (node, remixUrl, remixAppName) => {
	const remixer = new Remixer(node, remixUrl, remixAppName);
	await remixer.start();
}

export {
	main
}