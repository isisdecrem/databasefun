/**
 * Callback for clone status
 * @callback cloneStatusCallback
 * @param {string} clone status
 */




/**
 * Clone and save
 * @author Tong Miao
 * @param options options for cloneing
 * @param {string} options.url The full path to clone from
 * @param {string} options.dir The directory to clone into
 * @param {number} options.recursiveDepth [options.recursiveDepth=10] The recursive depth to clone with
 * @param {bool} options.usePuppeteer [options.usePuppeteer=true] Use puppeteer or not
 * @param {bool} options.sameDomainOnly [options.sameDomainOnly=false] Only scrape from the same domain
 * @param {bool} options.removeAllQoomSticker [options.removeAllQoomSticker=false] Remove all qoom sticker
 * @param {cloneStatusCallback} callback File cloned callback
 */
const cloneAndSave = async (options, callback) => {
	const resp = await fetch('/webclone/clone-and-save', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(options)
	})
	const respJSON = await resp.json();
	const id = respJSON.id;
	const socket = io('/webclone/clone-and-save-status/' + id);
	socket.on('connect', () => {
        callback('connected');
        socket.emit('execute');
    });
    socket.on('status', (msg) => {
        callback(msg);
    });
    socket.on('disconnect', () => {
    	callback('disconnected');
    })
}


export {
	cloneAndSave
}