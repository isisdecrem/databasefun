class Snackbar {
	
	constructor(options)  {
		const { mode, id, message, position, alertIcon, alertColor, alertActions } = options;
 
		this.$alert = undefined;
		this.message = message;
		if(!this.message) return;
		
		this.position = position;
		switch(mode) {
			case 'error':
				this.alertColor = 'red';
				break;
		
			case 'info':
				this.alertColor = '';
				this.alertIcon = '';
				this.alertTime = 5000;
				this.alertActions = undefined;
				this.alertPosition = position || 'bottom';
				break;
			
			case 'previewAlert':
				this.alertColor = 'blue';
				this.alertIcon = '';
				this.alertTime = false;
				this.alertActions = alertActions || undefined;
				this.alertPosition = position || '';
				break;
			
			case 'loginToSave':
				this.alertColor = 'white';
				this.alertIcon = '';
				this.alertTime = false;
				this.alertActions = alertActions || undefined;
				this.alertPosition = position || 'bottom';
				break;
				
			case 'message':
				this.id = id || '';
				this.alertColor = alertColor || 'blue';
				this.alertIcon = alertIcon || '';
				this.alertActions = alertActions || [
					{
						name: 'Hide'
						, onclick: this.destroy
					},{
						name: 'Sign Up'
						, onclick: this.signup
					}
				];
				this.alertPosition = position || 'bottom-left';
				break;
				
			case 'notLoggedIn':
				this.alertColor = 'red';
				this.alertIcon = '';
				this.alertTime = false;
				this.alertActions = [     
						{
							name: 'Close'
							, onclick: this.destroy
						}
						,{
							name: 'Log In'
							, onclick: this.login
						}
					]; 
				this.alertPosition = 'position-top';
				break;
		
			default:
				break;
		}
	}
    	
	show() {
		if(!this.message) return;
		const self = this;
		if(this.$alert || this.showTO) {
			return;
		}
		this.$alert = document.createElement('div');
		this.$alert.innerHTML = `
			<span class="message">${this.message}</span>`
		;
		
		if(!!this.id) {
			this.$alert.id = this.id;
		}
		
		if (!!this.alertActions) {
			this.alertActions.forEach(action => {
				const $actionDiv = document.createElement('div');
				const $actionA = document.createElement('a');
				$actionA.innerHTML = action.name;
				$actionA.addEventListener('click', function() {
					action.onclick.apply(self);
				});
				
				$actionDiv.appendChild($actionA); 
				$actionDiv.className = 'action';
				this.$alert.appendChild($actionDiv);
			});        
		}
	  
		
		this.$alert.className = `snackbar ${this.alertColor} ${this.alertPosition}`; 
		document.body.appendChild(this.$alert);
		 
     
    	if(this.alertTime) {
			this.showTO = setTimeout(function() {
				delete self.showTO;
				self.destroy();
			}, this.alertTime);
    	} 
	}
	
	destroy() { 
		document.body.removeChild(this.$alert);
		delete this.$alert; 
	}
	
	login() { 
		const self = this;
		function convertCookieToObject() {
			var cookieParts = document.cookie.split(";"),
				cookieObj = {};
			cookieParts.forEach(function(cookie, i){
				var equalsPosition = cookie.indexOf('='),
					key = equalsPosition > -1 ? cookie.substring(0, equalsPosition).trim() : cookie.trim(),
					val = equalsPosition > -1 ? cookie.substring(equalsPosition+1).trim(): undefined;

				cookieObj[key] = {value: val}
			});
			return cookieObj;
		}
		  
		function setCookie(key, val) {
			document.cookie= key + "=" + val +"; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/";
		}
		
		function getCookie(key) {
			var cookieObj = convertCookieToObject();
			return key in cookieObj ? cookieObj[key].value : undefined;
		}

		function deleteCookie(key) {
			document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		}

		function check(cb) {
			fetch('/registration/check' , {method: 'GET'})
			.then((response) => response.json())  
			.then((data) => {
				var resp = data && data.success;
				cb(null, resp);
			})
			.catch(cb);
		} 
	        
	    function login() {
	    	const $input = document.getElementById('password');
			if(isSalty) {
				var req = new XMLHttpRequest();
				req.open('POST', '/auth/login', true);
				req.setRequestHeader('content-type', 'application/json');
		
				function readyStateChange() {
					if(req.readyState !== 4) return;
					if(req.status !== 200) return;
					var body = JSON.parse(req.responseText);
					if(body.success) {
						$input.parentNode.classList.remove('error', 'empty');
						document.getElementById('loginModalContainer').style.display = 'none';
						return location.reload();
					} else {
						$input.parentNode.classList.add('error');
						$input.value = '';
						$input.placeholder = 'Uh oh! Try again';
						$input.addEventListener('keyup', function(){
							$input.parentNode.classList.remove('error');
						})
					}
				}
				req.onreadystatechange = readyStateChange;
				req.send(JSON.stringify({
					authdomain: location.host
					, authpassword: $input.value
				}));
				return;
			}

			localStorage.setItem('passcode', $input.value);
			setCookie('passcode', $input.value);
			check(function(err, resp) {
				// $loginMessage.style.display = 'block';
				if(resp) {
					$input.parentNode.classList.remove('error', 'empty');
					$loginModalContainer.style.display = 'none';
					self.destroy();
					location.reload();
					return;
				} else {
					$input.parentNode.classList.add('error');
					$input.value = '';
					$input.placeholder = 'Uh oh! Try again';
					$input.addEventListener('keyup', function(){
						$input.parentNode.classList.remove('error');
					})
				}
			});
	    }
		
		const $loginModalContainer = document.createElement('div');
		$loginModalContainer.id = 'loginModalContainer';
		const $loginModalBackground = document.createElement('div');
		$loginModalBackground.className = 'modal-background';
		$loginModalBackground.addEventListener('click', function(){
	    	$loginModalContainer.style.display = 'none';
			document.body.removeChild($loginModalContainer);
	    });
		$loginModalContainer.appendChild($loginModalBackground); 
		
		const $loginModal = document.createElement('div');
		$loginModal.className = 'modal';
		const $modalTitle = document.createElement('div');
		$modalTitle.className = 'modal-title';
		const $modalTitleH = document.createElement('h1');
		$modalTitleH.innerText = 'Log In To Coding Space';
		$modalTitle.appendChild($modalTitleH);
		$loginModal.appendChild($modalTitle);
		
		const $modalContentsContainer = document.createElement('div');
		$modalContentsContainer.className = 'container';
		$modalContentsContainer.innerHTML = `
			<div class="modal-description">Enter your password to save code changes</div>
			<div class="col-lg-12">
                <div class="form-input"> 
                    <div class="input-items default empty">
                        <input id='password' type="password" placeholder="password">
                    </div> 
                </div>
                <div class="form-input password-reset">
                	<a class="qoom-button-link" href="https://${location.host}/admin/forgotpassword">Forgot Password?</a>
                </div>
            </div>`;
	        
	    const $modalBtnsContainer = document.createElement('div');
	    $modalBtnsContainer.className = 'buttons-container';
		//click cancel: module disappear
	    const $modalCancelBtn = document.createElement('button');
	    $modalCancelBtn.className = 'qoom-main-btn qoom-button-outline qoom-button-small';
	    $modalCancelBtn.setAttribute('type', 'cancel');
	    $modalCancelBtn.innerText = 'Cancel';
	    $modalCancelBtn.addEventListener('click', function(){
	    	$loginModalContainer.style.display = 'none';
			document.body.removeChild($loginModalContainer);
	    });
	    $modalBtnsContainer.appendChild($modalCancelBtn);
	    const $modalSubmitBtn = document.createElement('button');
	    $modalSubmitBtn.className = 'qoom-main-btn qoom-button-full qoom-button-small';
	    $modalSubmitBtn.setAttribute('type', 'submit');
	    $modalSubmitBtn.innerText = 'Let me in';
 	
		$modalBtnsContainer.appendChild($modalSubmitBtn);
		$modalContentsContainer.appendChild($modalBtnsContainer);
	    $loginModal.appendChild($modalContentsContainer);
		   
		$loginModalContainer.appendChild($loginModal);
		document.body.appendChild($loginModalContainer); 
		//appear on the screen
		$modalSubmitBtn.addEventListener('click', login);
		document.querySelector('#password').addEventListener('keyup', function(e){
			if(e.keyCode === 13) {
				$modalSubmitBtn.click();
			}
		})
		document.querySelector('#password').focus();
		$loginModalContainer.style.display = 'block';
		
    }

	signup() {
		location.href = 'https://www.qoom.io/pricing';
		this.destroy();
	}
}

export default Snackbar