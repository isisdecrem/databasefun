(function(){
	window.alert = function(message){
		if(!document.querySelector('#alertAlternative')) {
			let $modalSection = document.createElement('section');
			$modalSection.id = 'alertAlternative';
			$modalSection.style.zIndex = '99';
			let $modalBackground = document.createElement('div');
			$modalBackground.className = 'modal-background';
			$modalSection.appendChild($modalBackground);
			
			let $modal = document.createElement('div');
			$modal.className = 'modal';
			$modal.style.minHeight = '0';
			let $container = document.createElement('div');
			$container.className = 'container';
			let $column = document.createElement('div');
			$column.className = 'col-lg-12';
			let $p = document.createElement('p');
			$p.innerText = message;
			$column.appendChild($p);
			$container.appendChild($column);
			
			let $buttonContainer = document.createElement('div');
			$buttonContainer.className = 'buttons-container';
			let $button = document.createElement('button');
			$button.id = 'submitBtn';
			$button.className = 'qoom-main-btn qoom-button-full qoom-button-small';
			$button.type = 'submit';
			$button.innerText = 'Okay';
			$buttonContainer.appendChild($button);
			$container.appendChild($buttonContainer);
			
			$modal.appendChild($container);
			$modalSection.appendChild($modal);
			document.body.appendChild($modalSection);
			$button.addEventListener('click', function(){
				document.body.removeChild($modalSection);
			});					
		} else {
			$p.innerText = message;
		}
	};
})();