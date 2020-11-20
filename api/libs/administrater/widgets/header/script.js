let $helpBtn = document.querySelector('.button-help i');
let $helpBtnSubmenus = document.querySelector('.button-help-submenus');
let $helpSubmenusBackground = document.querySelector('.button-help-submenus-background');


function openHelpButtonSubmenus() {
	$helpBtnSubmenus.style.display = 'block';
	$helpSubmenusBackground.style.display = 'block';
}

function closeHelpButtonSubmenus() {
	$helpBtnSubmenus.style.display = 'none';
	$helpSubmenusBackground.style.display = 'none';
}

$helpBtn.addEventListener('click', openHelpButtonSubmenus);
$helpSubmenusBackground.addEventListener('click', closeHelpButtonSubmenus);