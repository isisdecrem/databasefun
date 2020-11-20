let webcloner, appName, io;

/**
 * Function for qoom initialize
 * @memberof webclone
 */
const initialize = () => {
	webcloner = require('./app.js');
	webcloner.initialize();
	appName = webcloner.appName;
}



/** Function to create a unique id
 *  @memberof webclone
 *  @returns {string} uuid
 */
const create_UUID = () => {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random()*16)%16 | 0;
    	dt= Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

/** Function to handle clone and save and provide a websocket for status
 *  @param {string} id The id for the socket
 *  @param options options for cloneing
 *  @param {string} options.url The full path to clone from
 *  @param {string} options.dir The directory to clone into
 *  @param {number} options.recursiveDepth [options.recursiveDepth=1] The recursive depth to clone with
 *  @param {bool} options.usePuppeteer [options.usePuppeteer=true] Use puppeteer or not
 *  @param {bool} options.sameDomainOnly [options.sameDomainOnly=false] Only scrape from the same domain
 */
const handleCloneWs = (id, options) => {
	let cloneIo = io.of(
        `/${appName}/clone-and-save-status/${id}`
    );
	cloneIo.once('connection', (socket) => {
		console.log(id + ' joined');
        socket.on('execute', async () => {
    		await webcloner.cloneAndSave(options, (statusMsg) => {
    			socket.emit('status', statusMsg);
    		});
    		socket.disconnect();
        });
	});
}


/**
 * Function to add the routes for webcloner
 * @memberof webclone
 * @param app The express app
 */
const addRoutes = (app) => {
	
	/**
	 * Route for cloning a webpage into a path.
	 * @author Tong Miao
	 * @name webclone/clone-into-dir
	 * @function
	 * @memberof webclone
	 * @inner
	 * @param req.body The options for cloning
	 * @param {string} req.body.url The full path to clone from
	 * @param {string} req.body.dir The directory to clone into
	 * @param {number} req.body.recursiveDepth [req.body.recursiveDepth=] The recursive depth to clone with
	 * @param {bool} req.body.usePuppeteer [options.usePuppeteer=true] Use puppeteer or not
	 * @param {bool} req.body.sameDomainOnly [req.body.sameDomainOnly=false] Only scrape from the same domain
	 * @param {bool} req.body.removeAllQoomSticker [req.body.removeAllQoomSticker=false] Remove all qoom sticker
	 */
	app.post(`/${appName}/clone-and-save`, async (req, res) => {
		const options = req.body;
		try {
			const uuid = create_UUID();
			res.status(200).json({
				id: uuid,
			})
			await handleCloneWs(uuid, options);
		} catch (err) {
			console.log(err);
			res.status(500).json({err});
		}
	});
}


/**
 * Function to add the sockets for webcloner
 * @memberof webclone
 * @param _io The socket io instance
 */
const addSockets = (_io) => {
	io = _io;
}

module.exports = {
	initialize, addRoutes, addSockets
}