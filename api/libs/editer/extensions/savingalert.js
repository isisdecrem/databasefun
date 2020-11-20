import Snackbar from '/libs/snackbar/script.js';
import Indicator from '/libs/indicator/script.js';
import Modal from '/libs/modal/script.js';

export default function savingalert() {

	const saveErrorAlertSnackbar = new Snackbar({ 
		mode: 'loginToSave'
		, message:`If you are the owner of this account, log in first to save changes.`
		, alertActions: [{
			name: 'OK'
			, onclick: function(){
				saveErrorAlertSnackbar.destroy();
			}
		}]
	});
	
	const saveErrorAlertModal = new Modal({
		modalContainerId: 'saveErrorAlertModal'
		, modalContentsInnerHTML: `<div class="modal-description">Edit is not allowed. 
		If you are the owner of this account, please log in first to save changes.</div>
			<span><a id="loginBtn" style="cursor:pointer; line-height:40px; position:absolute; margin:10px 0;">I'm the account owner.</a></span>
			`
		, modalCancelBtnText: 'OK'
		, modalCancelBtnAction: function() {
			let $saveErrorAlertModal = document.getElementById('saveErrorAlertModal');
			$saveErrorAlertModal.style.display = 'none';
			document.body.removeChild($saveErrorAlertModal);
		}
	})

	const savePendingIndicator = new Indicator({
		message: 'Saving'
		, showMessageAnimation: true
		, successMessage: 'Saved.'
		, errorMessage: 'Not Saved.'
		, className: 'placeWithPreviewer'
	});
	
	let dateToShow = '';

	try {
		dateToShow = new Date(dateUpdated).toLocaleString();
	} catch(ex) {
		// do nothing
	}
	
	const dateUpdatedIndicator = new Indicator({
		message: !isLoggedIn && hasPerson && !window.isShared 
			? 'Edit not allowed' 
			: window.isShared 
				? `Last modified on ${dateToShow}` 
				: (!isNaN(dateUpdated) && dateToShow) 
					? `Last modified on ${dateToShow}` 
					: 'New file'
		, successMessage: 'Saved.'
		, errorMessage: 'Something wrong. Refresh.'
		, className: 'placeWithPreviewer'
	});
	
	const $loginModal = new Modal({
		modalContainerId: 'loginModal'
		, modalTitleText: 'Log In To Coding Space'
		, modalContentsInnerHTML: `<div class="modal-description">Enter your password to save code changes</div>
			<div class="col-lg-12">
                <div class="form-input"> 
                    <div class="input-items default empty">
                        <input id='password' type="password" placeholder="password">
                    </div> 
                </div>
                <div class="form-input password-reset">
                	<a class="qoom-button-link" href="https://${location.host}/admin/forgotpassword">Forgot Password?</a>
                </div>
            </div>`
		, modalCancelBtnText: 'Cancel'
		, modalCancelBtnAction: function() {
			let $loginModal = document.getElementById('loginModal');
			$loginModal.style.display = 'none';
			document.body.removeChild($loginModal);
		}
		, modalSubmitBtnText: 'Let me in'
		, modalSubmitBtnAction: function() {
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
							document.getElementById('loginModal').style.display = 'none';
							$loginModal.destroy();
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
					if(resp) {
						$input.parentNode.classList.remove('error', 'empty');
						document.getElementById('loginModal').style.display = 'none';
						$loginModal.destroy();
						return location.reload();
						//return;
					} else {
						$input.parentNode.classList.add('error');
						$input.value = '';
						$input.placeholder = 'Uh oh! Try again';
						$input.addEventListener('keyup', function(){
							$input.parentNode.classList.remove('error');
						});
					}
				});
			}
	    	login();
		}
	});

	window.addEventListener('load', function() {
		dateUpdatedIndicator.show();
		if(!isLoggedIn && hasPerson) {
			if(window.isShared) return;
			let $indicator = document.querySelector('.indicator');
			$indicator.style.backgroundColor = 'rgba(255,255,255,0.7)';
			$indicator.style.color = 'rgba(0,0,0,0.7)';
		}
	});

	setInterval(function(){
		if(window.isSaving === true) {
			dateUpdatedIndicator.destroy();
			savePendingIndicator.show();
		}
	}, 500);
	
	if(!isLoggedIn && hasPerson) {
		if(window.isShared) return;
		if(!document.getElementById('saveErrorAlertModal')) saveErrorAlertSnackbar.show();
	}
	
}