import Indicator from '/libs/indicator/script.js';

export default function collabit() {
	
	if (!isLoggedIn) return;
	
	const collabIndicator = new Indicator({
		message: 'Share'
		, className: 'collabIndicator'
	});
	
	function shareIt() {
		
	}
	
	window.addEventListener('load',() => {
		collabIndicator.show();
		const $indicator = document.querySelector('.collabIndicator');
		$indicator.setAttribute('style', 'top: 5px; right: 24px; bottom: unset;cursor:pointer;');
		$indicator.addEventListener('click', shareIt);
		
	})
	
}