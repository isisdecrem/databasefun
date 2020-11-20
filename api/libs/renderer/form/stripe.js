function initializeStripe() {
	if(!window.Stripe) {
		setTimeout(initializeStripe, 100);
		return;
	}
	var stripe = Stripe(stripeToken)
		, elements = stripe.elements({ 
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
		, card = elements.create('card', { style: style })
		, $cardErrors = document.querySelector('#cardErrors')
	;
	card.mount('#card');

	card.addEventListener('change', function(event) {
		$cardErrors.textContent = event.error ? event.error.message : '';
	});

	document.querySelector('input[type="submit"]').addEventListener('submit', function(event) {
		event.preventDefault();
		stripe.createToken(card).then(function(result) {
			if (result.error) {
				$cardErrors.textContent = result.error.message;
			} else {
				//submitRegistrationData(getRegistrationData(result.token));
			}
		});
	});
}
initializeStripe();