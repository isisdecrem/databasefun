import {states} from '/libs/supporter/helpform/utils.js';


const redrawStars = async (starsContainer, stars) => {
	starsContainer.innerHTML = '';
	for (let i = 0; i < 5; i++) {
		const star = document.createElement('i');
		star.classList.add('help-form-overlay-star');
		star.classList.add('ic-star');
		if (stars > i) {
			star.classList.add('ic-star-full');
			star.classList.add('yellow')
		}
		starsContainer.appendChild(star);
		star.addEventListener('click', () => {
			states.stars = i+1;
			refreshHelpFormStars(starsContainer.parentElement, i+1);
		})
	}
}

const refreshHelpFormStars = async (node, stars=states.stars) => {
	const starsContainers = node.querySelectorAll('.help-form-overlay-stars-container');
	states.stars = stars;
	for (const starsContainer of starsContainers) {
		redrawStars(starsContainer, stars);
	}
}


export {
	redrawStars,
	refreshHelpFormStars,
}