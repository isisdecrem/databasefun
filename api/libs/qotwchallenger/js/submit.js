const $paymentOptions = document.querySelectorAll('#submission section.payment input')
	, $paymentElements = document.querySelectorAll('#submission .payment')
	, $whoSection = document.querySelector('#submission section.who')
	, $whoInputName = $whoSection.querySelector('input:nth-child(3)')
	, $whoInputShip = $whoSection.querySelector('input:nth-child(4)')
	, $addMore = document.querySelector('#addMore')
	, $challengeOptions = document.querySelectorAll('#submission section.challenge input')
	, $credit = document.querySelector('#submission #credit')
	, $paypal = document.querySelector('#submission #paypal')
	, $submit = document.querySelector('#submission button')
	, $form = document.querySelector('#submission')
	, $project = document.querySelector('#submission select')
	, $cardErrors = document.querySelector('#cardErrors')
	, $tag = document.querySelector('#submission #tag')
;

let card, submitting = false;

function addMore(e) {
	e && e.preventDefault();
	const $newInputName = $whoInputName.cloneNode()
		, $newInputShip = $whoInputShip.cloneNode()
	;
	$newInputName.value = '';
	$newInputShip.value = '';
	$whoSection.appendChild($newInputName);
	$whoSection.appendChild($newInputShip);
}

function choosePayment() {
	const $checkedDiv = document.querySelector('#submission section.payment div.checked');
	if($checkedDiv) $checkedDiv.classList.remove('checked');
	this.parentElement.classList.add('checked');

	$credit.style.display = this.value === 'credit' ? 'block' : 'none';
	$paypal.style.display = this.value === 'paypal' ? 'block' : 'none';
	
	if(this.value === 'credit') {
		$submit.innerHTML = `<span>Pay & Submit</span>`
		$submit.style.display = 'unset';
		scrollToBottom();
	} else {
		$submit.style.display = 'none';
		scrollToBottom(500);
	}
	
	
}

function chooseChallenge() {
	const isOpen = this.value === 'open';
	$paymentElements.forEach($el =>	
		$el.style.display = isOpen ? 'none' : 'unset'
	)
	
	if(isOpen) {
		$submit.innerHTML = `<span>Submit</span>`
	} else {
		choosePayment.call(document.querySelector('#submission section.payment input:checked'));
	}
}

function initPayPalButton() {
	
	let payload, url;
	paypal_sdk.Buttons({
		style: {
			shape: 'rect',
			color: 'gold',
			layout: 'horizontal',
			label: 'paypal'
		},
		
		onInit: function(data, actions) {
			actions.disable();
			$project.addEventListener('change', function(event) {
				if (event.target.value.length === 24) {
					actions.enable();
				} else {
					actions.disable();
				}
			});
		},
		
		onClick: function() {
			const resp = submit();
			payload = resp.payload;
			url = resp.url;
		},
	
		createOrder: function(data, actions) {
			return actions.order.create({
				purchase_units: [{ description: `Qoom of the Week: ${$tag.value}`, amount: { currency_code: 'USD',value: 10 } }]
			});
		},
		
		onApprove: function(data, actions) {
			return actions.order.capture().then(function(details) {
				payload.details = details;
				submitPayload(payload, url);
			});
		},
		
		onError: function(err) {
			alert(err);
		}
	}).render('#paypal-button-container');
}

function initializeStripe() {
	if(!window.Stripe) {
		setTimeout(initializeStripe, 100);
		return;
	}
	window.stripe = Stripe(window.stripeToken);
	const elements = stripe.elements({ 
			fonts: [
				{ cssSrc: 'https://fonts.googleapis.com/css?family=PT+Sans+Caption' }
			] 
		})
		, style = {
			base: {
				color: '#666666'
				, fontFamily: "'PT Sans Caption', sans-serif"
				, fontSmoothing: 'antialiased'
				, fontSize: '16px'
				, '::placeholder': { color: '#9E9E9E' }
			}
			, invalid: { color: '#E84855', iconColor: '#E84855' }
		}
	;
	
	card = elements.create('card', { style: style })
	card.mount('#card');

	card.addEventListener('change', function(event) {
		$cardErrors.textContent = event.error ? event.error.message : '';
	});
}

function scrollToBottom(to) {
	setTimeout(function() {
		window.scrollTo(0,document.body.scrollHeight);
	}, to || 0);
	
}

function isValid(payload) {
	let valid = true;
	if(payload.project.length !== 24) {
		valid = false;
		$project.classList.add('error');
	}
	
	return valid;
}

function clearError() {
	if(this && this.classList) this.classList.remove('error');
}

async function submitPayload(payload, url) {
	setTimeout(function() {
		location.href = '/qotw/submission/thankyou'	
	}, 500);
	const response = await fetch(url, { 
				method: $form.method
				, headers: { 'Content-Type': 'application/json'} 
				, body: JSON.stringify(payload)
			})
		, json = await response.json();

	
}

async function submitToStripe(payload, url) {
	stripe.createToken(card).then(function(result) {
		if (result.error)
			return $cardErrors.textContent = result.error.message;
			
		payload.token = result.token;
		submitPayload(payload, url);
	});	
}

function submit(e) {
	if(e) {
		e.preventDefault();
		e.stopPropagation();
	}
	if(submitting) return false;
	const
		names = [...$form.elements.name].map(r => r.value)
		, ships = [...$form.elements.ship].map(r => r.value)
		, payload = {
			project: $form.elements.project.value
			, people: names.map((n,i) => {
				return {
					name: n.trim(), ship: ships[i].trim()
				}
			}).filter(p => p.name || p.ship)
			, challenge: $form.elements.challenge.value
			, payment: $form.elements.payment.value
		}
		, url = $form.action.replace(/id$/, payload.project)
	;
	
	if(!isValid(payload))
		return false;
		
	submitting = true;
	if(payload.challenge === 'open') 
		return submitPayload(payload, url);
	if(payload.payment === 'credit') 
		return submitToStripe(payload, url);
	return { payload, url };
	
}


$paymentOptions.forEach($input => $input.addEventListener('click', choosePayment));
$challengeOptions.forEach($input => $input.addEventListener('click', chooseChallenge));
$addMore.addEventListener('click', addMore);
$project.addEventListener('change', clearError);
$submit.addEventListener('click', submit);

chooseChallenge.call(document.querySelector('#submission section.challenge input:checked'));
initializeStripe();
initPayPalButton();