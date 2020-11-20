let states = {}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


const initStates = async () => {
	states = {
		stars: 5,
		catagory: '',
		experience: '',
		fileStatuses: [],
		tempId: create_UUID(),
	}
}

const submit =  () => {
	
	if (!states.stars || !states.catagory || !states.experience || !states.tempId) return false;
	
	for (const status of states.fileStatuses) {
		console.log(status);
		if (status.fileStatus.percent !== 100) return false;
	}
	
	
	return fetch('/support/submit-support-form', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',	
		},
		body: JSON.stringify({
			stars: states.stars,
			catagory: states.catagory,
			experience: states.experience,
			tempId: states.tempId,
		})
	});
}





export {states, initStates, submit}