import * as noModelUploaderExports from '/libs/uploader/noModalUploaderBinder/noModalUploaderBinder.js';



export default () => {
	Object.assign(window, noModelUploaderExports);
}