const $form = document.querySelector('form')
	, $submitButtons = document.querySelectorAll('input[type="submit"]')
	, $cost = document.querySelector('.cost')
	, $pc = document.querySelector('#cardamount')
	, $card = document.querySelector('#card')
	, $stripeMessage = document.querySelector('.stripe-text')
	, $cardParent = $card && $card.parentElement
;

let submitted = false;

function validateForm() {
	
}

function reset($submit, img) {
	submitted = false;
	$submit.removeAttribute('disabled');
	$submit.parentElement.removeChild(img);
	$submit.style.display = 'block';
	
}

function submit(e, $submit) {
	e.preventDefault(); 
	if(submitted) return;
	if(!$form.reportValidity()) return;
	submitted = true;
	$submit.setAttribute('disabled', 'disabled');
	const img = document.createElement('img');
	img.src = "/libs/icons/spinner.svg";
	img.style="width:2em;display:block;margin:auto;";
	$submit.style.display = 'none';
	$submit.parentElement.appendChild(img);
	const action = $submit.getAttribute('post');
	if(window.Stripe && $cardParent && $card.style.display !== 'none') {
		
		stripe.createToken(card).then(function(result) {
			if (result.error) {
				$cardErrors.textContent = result.error.message;
				reset($submit, img)
				return;
			} else if (!result.token || !result.token.id) {
				$cardErrors.textContent = 'Error from stripe';
				reset($submit, img)
				return;
			} else {

				if($pc) {
					const $amount = document.createElement('input');
					$amount.setAttribute('type', 'hidden');
					$amount.setAttribute('name', 'amount');
					const amount = parseFloat($pc.value.replace(' $ '.trim(), ''));
					if(!amount || isNaN(amount) || amount < 0) {
						alert('Please enter a valid amount');
						reset($submit, img)
						return;
					}
					$amount.value = amount;
					$form.appendChild($amount);
				}
				
				const $token = document.createElement('input');
				$token.setAttribute('type', 'hidden');
				$token.setAttribute('name', 'token');
				$token.value = result.token.id;
				$form.appendChild($token);
				
				fetch(action, {
					method: 'POST'
					, body: new FormData($form)
				})
				.then((response) => response.json()) 
				.then((data) => {
					if(data.url) location.href = data.url;
					else {
						alert(JSON.stringify(data));
						reset($submit, img)
					}
				})
				.catch((error) => {
					reset($submit, img)
					alert('There was an error');
				});
			}
		});
	} else {
		$form.action = action;
		$form.submit();
		
	}

	
}

$submitButtons.forEach($submit => {
	$submit.addEventListener('click', function(e) {
		submit(e, $submit);
	});
});

if($pc && $cardParent) {
	$pc.addEventListener('keyup', () => {
		const cv = parseFloat($pc.value.replace(' $ '.trim(), ''))
			, isInValidCost = (!cv || isNaN(cv) || cv < 0 )
		$cost.innerHTML = isInValidCost ? '0.00' : cv.toFixed(2);
		$card.style.display = isInValidCost ? 'none' : 'block';
		if($stripeMessage) $stripeMessage.style.display = isInValidCost ? 'none' : 'block';
	})
}