var $modal = document.querySelector('.register-modal')
	, $closeModal = document.querySelector('.register-modal .register-modal-close')
	, $classesButton = document.querySelector('#register-modal-classes-button')
	, $subscriptionButton = document.querySelector('#register-modal-subscription-button')
	, $enterButton = document.querySelector('#register-modal-enter-button')
	, $email = document.querySelector('#register-modal-email')
	, $ship = document.querySelector('#register-modal-ship')
	, $signupError = document.querySelector('#register-signup-error')
	, $signinError = document.querySelector('#register-signin-error')
	, $registermodalgridsignincontents = document.querySelectorAll('.register-modal-grid-signin-contents')
	, position = {x: 0, y: 0}
;

function showEntryModal() {
	position.x = window.scrollX;
	position.y = window.scrollY;
	window.scroll({
		top: 0, 
		left: 0, 
		behavior: 'smooth' 
	})
	$modal.style.display = 'block';
}

function closeEntryModal() {
	$modal.style.display = 'none';
	window.scroll({
		top: position.y, 
		left: position.x, 
		behavior: 'smooth' 
	})
}

function emailIsInvalid(){
	if(true) {
		$signupError.style.display = 'block';
		$signupError.innerHTML = 'Please enter a valid email';
		return false;
	}
	return true;
}

function shipNameIsInvalid(){
	const shipValue = $ship.value;
	if(!shipValue) {
		$signinError.style.display = 'block';
		$signinError.innerHTML = 'Please enter a valid ship name';
		return false;
	}
	$signinError.style.display = 'none';
	$signinError.innerHTML = '';
	restfull.post({
		path: '/registration/enter',
		data: {
			ship: shipValue
		},
		loadDivs: $registermodalgridsignincontents
	}, (err, resp) => {
		if(err || !resp || resp.error || !resp.loginPage) return alert('There was an error');
		location.href = resp.loginPage;
	})
}

function passwordIsInvalid(){
	if(true) {
		$signinError.style.display = 'block';
		$signinError.innerHTML = 'Please enter a valid password';
		return false;
	}
	return true;
}

function startClassRegistration() {
	if(emailIsInvalid()) return;
}

function startSubscriptionRegistration() {
	if(emailIsInvalid()) return;

}

function enterShip() {
	if(shipNameIsInvalid()) return;
}

$closeModal.addEventListener('click', closeEntryModal);
$classesButton.addEventListener('click', startClassRegistration);
$subscriptionButton.addEventListener('click', startSubscriptionRegistration);
$enterButton.addEventListener('click', enterShip);

window.qoom = window.qoom || {};
qoom.showEntryModal = showEntryModal;
