import Modal from '/libs/modal/script.js';
import download from '/libs/migrater/download.js';

let $subdomainChangeBtn = document.getElementById('subdomainChangeBtn');
let $backupBtn = document.getElementById('backupBtn');
let $addMoreLink = document.getElementById('addMoreLink');
let $toggleContainer = document.querySelector('.toggle-container');
let $publicSettingSwitch = document.getElementById('toggleSwitch');
let $pfEditBtn = document.getElementById('pfEdit');
let $pfCancelBtn = document.getElementById('pfCancel');
let $pfSaveBtn = document.getElementById('pfSave');
let $changePfPicture = document.querySelector('.change-profile-picture');
let $uploadPfPicture = document.querySelector('.upload-profile-picture');
let $pfPictureContainer = document.querySelector('.profile-picture-container');
let $pfPicture = document.querySelector('.profile-picture');

let $removeImage = document.getElementById('removeImage');
let profilePictureSrc = document.querySelector('.profile-picture').src;
let editedProfile = {};
//todo: this userNameEditable variable will be databinded;
let checking = false;
let kuto;
let $updateSubmitBtn;
let $newUserNameInput;
let $userNameChecked;
const escapeHTML = str => str.replace(/[&<>'"]/g, tag => ({'&': '&amp;',
	'<': '&lt;', 
	'>': '&gt;',
	"'": '&#39;',
	'"': '&quot;'}[tag]));


const $updateNameModal = new Modal({
	modalContainerId : 'updateNameModal'
	, modalTitleText: 'Update Name'
	, modalContentsInnerHTML:`
		<span class="modal-description">Enter your name</span>
		<div class="col-lg-12">
            <div class="form-input">
                <label>First Name</label>
                <div class="input-items default empty">
                    <input id='newFirstInput' type="text" placeholder="">
                </div>
            </div> <!-- form input -->
            <div class="form-input">
                <label>Last Name</label>
                <div class="input-items default empty">
                    <input id='newLastInput' type="text" placeholder="">
                </div>
            </div> <!-- form input -->
        </div>
	`
	, modalCancelBtnText: 'Cancel'
	, modalSubmitBtnText: 'Update'
	, modalCancelBtnAction: function(){
		$updateNameModal.destroy();
	}
	, modalSubmitBtnAction: function(){
		var nameToUpdate = {
			first: escapeHTML(document.getElementById('newFirstInput').value)
			, last: escapeHTML(document.getElementById('newLastInput').value)
		};
		restfull.patch({ path: '/registration/updateprofile', data: { dataToModify: nameToUpdate }}, (err, resp) => {
			if(err) {
			}
			location.reload();
		});
	}
});
const $checkPwModal = new Modal({
	modalContainerId : 'checkPwModal'
	, modalTitleText : 'Verify Your Password'
	, modalContentsInnerHTML: `
			<span class="modal-description">Enter your password to continue</span>
			<div class="col-lg-12">
                <div class="form-input">
                    <label>Password</label>
                    <div class="input-items default empty">
                        <input id='emailpwdcheck' type="password" placeholder="">
                    </div>
                </div> <!-- form input -->
            </div>`
	, modalCancelBtnText: 'Cancel'
	, modalSubmitBtnText: 'Continue'
	, modalCancelBtnAction: function(){
		$checkPwModal.destroy();
	}
	, modalSubmitBtnAction: function(){
		verifyCurrentPassword('emailpwdcheck');
	}
});
const $updateEmailModal = new Modal({
	modalContainerId : 'updateEmailModal'
	, modalTitleText: 'Update Email'
	, modalContentsInnerHTML:`
		<span class="modal-description">Enter your new email address</span>
		<div class="col-lg-12">
            <div class="form-input">
                <label>Email</label>
                <div class="input-items default empty">
                    <input id='newEmailInput' type="email" placeholder="">
                </div>
            </div> <!-- form input -->
        </div>
	`
	, modalCancelBtnText: 'Cancel'
	, modalSubmitBtnText: 'Update'
	, modalCancelBtnAction: function(){
		$updateEmailModal.destroy();
	}
	, modalSubmitBtnAction: function(){
		updateEmail();
	}
});
const $updateUserNameModal = new Modal({
	modalContainerId: 'updateUserNameModal'
	, modalTitleText: 'Update URL'
	, modalContentsInnerHTML: `
		<span class="modal-description">Enter your new URL</span>
		<div class="col-lg-12">
            <div class="form-input filepath">
                <div class="input-items default empty">
                    <input id='newUserNameInput' type="text" placeholder="" style="width: 200px;">
                </div>
                <div class="">${location.origin.replace(`${location.origin.split('.')[0]}`, '')}</div>
            </div>
            <span class="username-checked"></span>
        </div>
	`
	, modalCancelBtnText: 'Cancel'
	, modalSubmitBtnText: 'Update'
	, modalCancelBtnAction: function() {
		$updateUserNameModal.destroy();
	}
	, modalSubmitBtnAction: updateUserName
});
const $upgradeNotificationModal = new Modal({
	modalContainerId: 'upgradeNotificationModal'
	, modalTitleText: 'Upgrade'
	, modalContentsInnerHTML: `<div class="modal-description">
		You can get personalized web address of your coding space by changing username. Please upgrade to customize username.
	</div>
		<a href="https://www.qoom.io/pricing" target="_blank">Learn more about Starter plan.</a>
		`
	, modalCancelBtnText: 'Maybe Later'
	, modalCancelBtnAction: function() {
		let $upgradeNotificationModal = document.getElementById('upgradeNotificationModal');
		$upgradeNotificationModal.style.display = 'none';
		document.body.removeChild($upgradeNotificationModal);
	}
	, modalSubmitBtnText: 'Upgrade'
	, modalSubmitBtnAction: function() {
		//todo:
	}
});

function drawLinks(){
	var $linksContainer = document.querySelector('.links-container');
	var linkIndex = 1;
	links.forEach(link => {
		$linksContainer.innerHTML += `<input id="link${linkIndex}" type="url" class="profile-link" value="${links[linkIndex - 1]}" disabled="true">`;
		linkIndex ++;
	});
	if(links.length === 0) {
		$linksContainer.innerHTML += `<input id="link${linkIndex}" type="url" class="profile-link" disabled="true">`
	}
}

function verifyCurrentPassword(id) {
	const pinput = document.getElementById(id);
	pinput.addEventListener('keyup', function(){
		pinput.parentElement.classList.replace('error', 'default');
	});
	if(!pinput || !pinput.value) {
		pinput.placeholder = 'Please enter a password';
		pinput.parentElement.classList.replace('default', 'error');
		return;
	}
	const pwd = pinput.value;
	restfull.post({path: '/registration/checkpassword', data: { password: pwd }}, (err, resp) => {
		pinput.value = '';
		if(err) {
			pinput.placeholder = 'Please enter a password';
			pinput.parentElement.classList.replace('default', 'error');
			pinput.addEventListener('keydown', function(){
				pinput.placeholder = '';
			});
			return;
		}
		if(!resp || !resp.matched) {
			pinput.placeholder = 'Passwords did not match';
			pinput.parentElement.classList.replace('default', 'error');
			if(id === 'currentPassword') {
				document.getElementById('newPassword').value = '';
				document.getElementById('newPassword').placeholder = '';
			}
			pinput.addEventListener('keydown', function(){
				pinput.placeholder = '';
			});
			return;
		}
		if(id === 'emailpwdcheck') {
			$checkPwModal.destroy();
			$updateEmailModal.show();
			document.querySelector('#updateEmailModal #newEmailInput').addEventListener('keyup', (e) => {
				if(e.keyCode === 13) {
					document.querySelector('#updateEmailModal #submitBtn').click();
				}
			})
			document.querySelector('#updateEmailModal #newEmailInput').focus();
			
		}
	});
}

function updateEmail(){
	let $newEmailInput = document.getElementById('newEmailInput');
	let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	if(!$newEmailInput.value) {
		$newEmailInput.parentElement.classList.replace('default', 'error');
	}
	if(!emailRegex.test($newEmailInput.value)) {
		$newEmailInput.value = '';
		$newEmailInput.placeholder = 'Invalid email format';
		$newEmailInput.addEventListener('keydown', (e) => {
			if(e) {
				$newEmailInput.parentElement.classList.replace('error', 'default');
			}
		});
		return $newEmailInput.parentElement.classList.replace('default', 'error');
	}
	if($newEmailInput.value) {
		restfull.patch({ path: '/registration/updateemail', data: { email: $newEmailInput.value }}, (err, resp) => {
			if(err) {
				$newEmailInput.placeholder = 'Uh oh! Try again!';
				$newEmailInput.parentElement.classList.replace('default', 'error');
				return;
			}
			$updateEmailModal.destroy();
			location.reload();
		});
	}
}

function checkUserName(subdomain) {
	if(checking) return;
	checking = true;
	if(!subdomain) return;
	restfull.patch({ path: '/registration/checkusername', data: { subdomain: subdomain}}, (err, resp) => {
		checking = false;
		if(err) {
			$newUserNameInput.placeholder = 'Uh oh! Try again!';
			$newUserNameInput.parentElement.classList.replace('default', 'error');
			return;
		}
		if(resp.taken) {
			//show error message that it's already taken
			document.querySelector('#updateUserNameModal #submitBtn').disabled = true;
			$userNameChecked.classList.add('taken');
			$userNameChecked.innerText = 'This subdomain is already taken. Try another!';
		} else {
			//enable the update button;
			document.querySelector('#updateUserNameModal #submitBtn').disabled = false;
			$userNameChecked.classList.add('available');
			$userNameChecked.innerText = 'This subdomain available!';
		}
	})
}

function updateUserName() {
	if($newUserNameInput.value) {
		let subdomain = $newUserNameInput.value;
		document.querySelector('#updateUserNameModal .modal-title').style.display = 'none';
		document.querySelector('#updateUserNameModal .container').innerHTML = `
			<div class="loader"><div></div></div>
			<span class="transfer-text">Transferring is almost done. You'll be asked to log in again.</span>
		`;
		restfull.post({ path: '/registration/updateusername', data: { subdomain: subdomain }}, (err, resp) => {
			if(err) {
				$newUserNameInput.placeholder = 'Uh oh! Try again!';
				$newUserNameInput.parentElement.classList.replace('default', 'error');
				return;
			}
			location.href = `https://${resp.newDomain}/admin/login`;
		})
	} else {
		$newUserNameInput.parentElement.classList.replace('default', 'error');
	}
}

function showSuccessMessage(id) {
	var $updatedText = document.createElement('span');
	$updatedText.className = 'updated-text';
	$updatedText.innerText = 'Updated successfully!';
	document.getElementById(id).parentElement.appendChild($updatedText);
	setTimeout(function(){document.getElementById(id).parentElement.removeChild($updatedText);}, 3000);
}

function updatePassword(id){
	restfull.patch({ path: '/registration/updatepassword', data: {
		newpw: document.getElementById('newPassword').value
	}}, (err, resp) => {
		if(err) {
			document.getElementById('newPassword').value = '';
			document.getElementById('newPassword').placeholder = 'Could not update the password';
			return;
		}
		document.getElementById('newPassword').value = '';
		document.getElementById('currentPassword').value = '';
		document.getElementById('newPassword').placeholder = '';
		document.getElementById('currentPassword').placeholder = '';
		showSuccessMessage('updatePwBtn');
	});
}

function addMoreLink(){
	var $linksContainer = document.querySelector('.links-container');
	var $links = document.querySelectorAll('.links-container .profile-link');
	var $linkInput = document.createElement('input');
	$linkInput.id = `link${$links.length + 1}`;
	$linkInput.type = 'url';
	$linkInput.className = 'profile-link';
	$linksContainer.appendChild($linkInput);
}

function getDiff(obj1, obj2){
	function compare(item1, item2, key){
		//referred: https://gomakethings.com/getting-the-differences-between-two-objects-with-vanilla-js/
		// get the object type
		var type1 = Object.prototype.toString.call(item1);
		var type2 = Object.prototype.toString.call(item2);
		
		//if type 2 is undefined it has been removed
		if(type2 === '[object Undefined]') {
			diffs[key] = null;
			return;
		}
	
		//if items are different types
		if(type1 !== type2) {
			diffs[key] = item2;
			return;
		}
		
		//if an object, compare recursively
		if(type1 === '[object Object]') {
			var objDiff = getDiff(item1, item2);
			if(Object.keys(objDiff).length > 0) {
				diffs[key] = objDiff;
			}
			return;
		} 
		
		//if an array, compare
		if(type1 === '[object Array]') {
			if(!arraysMatch(item1, item2)) {
				diffs[key] = item2;
			}
			return;
		}
		
		//else if it's a function, convert to a string and compare 
		//otherwise, just compare
		if(type1 === '[object Function]') {
			if (item1.toString() !== item2.toString()) {
				diffs[key] = item2;
			}
		} else {
			if(item1 !== item2) {
				diffs[key] = item2;
			}
		}
	}
	
	function arraysMatch(arr1, arr2) {
		//check if the arrays are the same length
		if(arr1.length !== arr2.length) return false;
		
		//check if all items exist and are in the same order
		for (var i = 0; i < arr1.length; i++) {
			if(arr1[i] !== arr2[i]) return false;
		}
		return true;
	}
	
	if(!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
		return obj1;
	}
	
	var diffs = {};
	var key;
	
	for(key in obj1) {
		if(obj1.hasOwnProperty(key)) {
			compare(obj1[key], obj2[key], key);
		}
	}
	
	for(key in obj2) {
		if(obj2.hasOwnProperty(key)) {
			if(!obj1[key] && obj1[key] !== obj2[key]) {
				diffs[key] = obj2[key];
			}
		}
	}
	
	return diffs;
}

function editProfile(){
	var $profileInputs = document.querySelectorAll('.public-profile .form-input .input-items input');
	var $profileTextarea = document.querySelectorAll('.public-profile .form-input .input-items textarea');
	$profileInputs.forEach(input => input.disabled = false);
	$profileTextarea.forEach(input => input.disabled = false);
	$pfEditBtn.style.display = 'none';
	$pfCancelBtn.style.display = 'inline-block';
	$pfSaveBtn.style.display = 'inline-block';
	$addMoreLink.style.display = 'inline-block';
	$toggleContainer.style.display = 'none';
	if(profilePictureSrc.includes('profile-default.svg')) {
		$uploadPfPicture.style.display = 'flex';
	} else {
		$changePfPicture.style.display = 'flex';
		showRemoveText();
	}
	$pfSaveBtn.addEventListener('click', updateProfile);
	setInterval(checkProfile, 1000);
}

function cacelProfileEdit(){
	location.reload();
}

function checkProfile() {
	var avatarUrl = document.querySelector('.profile-picture').src;
	avatarUrl = avatarUrl.endsWith('/') ? avatarUrl.substring(0, avatarUrl.length - 1) : avatarUrl;
	editedProfile = {
		avatar : avatarUrl
		, nickname : escapeHTML(document.getElementById('nickname').value)
		, 'profile.about': escapeHTML(document.getElementById('about').value)
	};
	editedProfile['profile.links'] = [];
	document.querySelectorAll('.profile-link').forEach(link => {
		if(!link.value.length) {
		} else {
			var linkToSave = escapeHTML(link.value);
			if(!linkToSave.startsWith('https://')) {
				linkToSave = `https://${linkToSave}`;
			}
			editedProfile['profile.links'].push(linkToSave);
		}
	});
	if(Object.keys(getDiff(profile, editedProfile)).length === 0) {
		//no difference
		$pfSaveBtn.disabled = true;
	} else {
		//if there is difference between profile and editedProfile
		$pfSaveBtn.disabled = false;
	}
}

function updateProfile(){
	var profileToUpdate = getDiff(profile, editedProfile);
	restfull.patch({ path: '/registration/updateprofile', data: { dataToModify: profileToUpdate }}, (err, resp) => {
		if(err) {
		}
		location.reload();
	})
}

function togglePublicSetting(){
	var profileToUpdate = {'profile.isPublic': $publicSettingSwitch.checked }
	
	restfull.patch({ path: '/registration/updateprofile', data: { dataToModify: profileToUpdate }}, (err, resp) => {
		if(err) {
		}
	})
}

function uploadProfileImage(uploader){
	if(typeof (FileReader) != 'undefined') {
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        var file = uploader.files[0];
        if (regex.test(file.name.toLowerCase())) {
            var reader = new FileReader();
            var img = new Image();
            img.onload = function(e) {
				var canvas = document.createElement('canvas');
            	var ctx = canvas.getContext('2d');
            	canvas.width = 320;
            	canvas.height = 320;
            	ctx.drawImage(img, 0, 0, 320, 320);
            	$pfPicture.src = canvas.toDataURL();
            	if(!$pfPicture.src.includes('profile-default.svg')) {
            		showRemoveText();
            		$uploadPfPicture.style.display = 'none';
					$changePfPicture.style.display = 'flex';
            	}
            }
            
            reader.onload = function (e) {
            	img.src = e.target.result;
            }
            reader.readAsDataURL(file);

        } else {
            alert(file.name + " is not a valid image file.");
            $pfPicture.src = `https://${location.host}/libs/icons/profile-default.svg`;
            return false;
        }
	} else {
        alert("This browser does not support HTML5 FileReader.");
    }
}

function showRemoveText(){
	$removeImage.style.display = 'block';
	$removeImage.addEventListener('click', function(){
		$pfPicture.src = $pfPicture.src = `https://${location.host}/libs/icons/profile-default.svg`;
		$uploadPfPicture.style.display = 'flex';
		$changePfPicture.style.display = 'none';
		$removeImage.style.display = 'none';
	})
}

function openSelectFileDialog(){
	var $fileInput = document.createElement('input');
	$fileInput.id = 'file-input';
	$fileInput.type = 'file';
	$fileInput.name = 'name';
	$fileInput.style.display = 'none';
	document.body.appendChild($fileInput);
	$fileInput.click();
	$fileInput.addEventListener('change', function(e) {
		e.preventDefault();
		uploadProfileImage($fileInput);
	});
}

function handleQOTWParticipation() {
	const $qotwButton = document.querySelector('#qotw');
	if(!$qotwButton) return;
	
	$qotwButton.addEventListener('click', async () => {
		const isParticipating = $qotwButton.getAttribute('isparticipating') === 'true'
			, url = `/qotw/participation/${isParticipating ? 'stop' : 'start'}`
			, resp = await fetch(url)
		;
		
		if(isParticipating) return location.reload();
		location.href = '/qotw/section';
	})
}

drawLinks();
$publicSettingSwitch.checked = isPublic;

if($subdomainChangeBtn) {
	$subdomainChangeBtn.addEventListener('click', () => {
		if(userNameEditable) {
			$updateUserNameModal.show();
			$updateSubmitBtn = document.querySelector('#updateUserNameModal #submitBtn');
			$newUserNameInput = document.querySelector('#updateUserNameModal #newUserNameInput')
				;
			$userNameChecked = document.querySelector('#updateUserNameModal .username-checked');
			$updateSubmitBtn.disabled = true;
			$newUserNameInput.addEventListener('keyup', (e) => {
				$userNameChecked.innerText = '';
				$userNameChecked.className = 'username-checked';
				if(kuto) clearTimeout(kuto);
				if(!$newUserNameInput.value) {
					clearTimeout(kuto);
					if($userNameChecked) $userNameChecked.innerText = '';
					return $updateSubmitBtn.disabled = true;
				}
				if(e.keyCode === 13) {
					return $updateSubmitBtn.click();
				}
				kuto = setTimeout(() => {
					var specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>_-\s]/g;
					if(specialCharacterRegex.test($newUserNameInput.value)) {
						document.querySelector('#updateUserNameModal #submitBtn').disabled = true;
						$userNameChecked.classList.add('taken');
						$userNameChecked.innerText = 'No special character or whitespace!';
						return;
					}
					checkUserName($newUserNameInput.value);
				}, 750);
			})
			$newUserNameInput.focus();
		} else {
			$upgradeNotificationModal.show();
		}
	});
}

if($backupBtn) $backupBtn.addEventListener('click', download);

$uploadPfPicture.addEventListener('click', openSelectFileDialog);
$changePfPicture.addEventListener('click', openSelectFileDialog);
$addMoreLink.addEventListener('click', addMoreLink);
$pfEditBtn.addEventListener('click', editProfile);
$pfCancelBtn.addEventListener('click', cacelProfileEdit);
$publicSettingSwitch.addEventListener('click', togglePublicSetting);

handleQOTWParticipation();