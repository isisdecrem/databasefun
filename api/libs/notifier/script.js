import Snackbar from '/libs/snackbar/script.js';

export default function notify(message, options) {
	
	if(!message) return;
	const notification = new Snackbar(Object.assign(options || {},{
		mode: 'message'
		, message: message
	}));
	
	notification.show();
}