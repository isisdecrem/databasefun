const fs = require('fs'),
	path = require('path'),
	child_process = require('child_process'),
	url = require('url'),
	async = require('async')
;

const appName = 'help'
	, appPath = path.dirname(__dirname)
;

function initialize() {}

function makeTwoDigits(num) {
	return num < 10 ? "0" + num : "" + num;
}

function getTimeZoneOffset(date) {
	if(date && !date.split) return 0;
	const d = date ? new Date(date.split(/\s+/)[0]) : new Date()
	return parseInt((d + '').split('-')[1].split(' ')[0][1])
}

function getLocalDate(dateStr) {
	let d = new Date(dateStr)
		, tz = getTimeZoneOffset(dateStr)
	;
	d.setHours(d.getHours() + tz);
	return d;
}

function getDateList(when) {
	if(!when) return '';
	let startDate = getLocalDate(when.startDate);
	let endDate = getLocalDate(when.endDate);
	let exceptions = [];
	(when.exceptions || []).forEach(function(ds) {
		let d = getLocalDate(ds);
		exceptions.push((d.getMonth() + 1) +'/' + d.getDate())
	})
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		, start = {
			day: startDate.getDate()
			, month: startDate.getMonth()
			, year: startDate.getFullYear()
		}
		, end = {
			day: endDate.getDate()
			, month: endDate.getMonth()
			, year: endDate.getFullYear()
		};
	let d = new Date(startDate);
	let dates = [];
	let ds;
	let jump = startDate.getDay() === endDate.getDay() ? 7 : 1;
	while(d <= endDate) {
		ds = (d.getMonth() + 1) +'/' + d.getDate();
		if(exceptions.indexOf(ds) === -1) {
			dates.push(ds);
		}
		d.setDate(d.getDate() + jump);
	}
	let dateString = dates.splice(0,dates.length - 1).join(', ') + ', and ' + dates[0];
	return dateString;
}

function escapeHtml(string) {
	let entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};
	
	return String(string).replace(/[&<>"'\/]/g, (s) => {
		return entityMap[s];
	});
}

function escapeScriptInjection(string) {
	if(!string) return '';
	if(!(string instanceof String) && typeof(string) !== 'string') return string;
	let entityMap = {
		"<": "&lt;",
		">": "&gt;"
	};
	
	return String(string).replace(/[<>]/g, (s) => {
		return entityMap[s];
	});
}

function escapeHTMLObject(o) {   
    let obj = JSON.parse(JSON.stringify(o || {}));
    return Object.keys(obj).reduce((o, k) => {
        o[escapeHtml(k)] = escapeHtml(obj[k]);
        return o;
    }, {})
}

function generateSocketId(sockets) {
	let k;
	do {
		 k = (Math.random() + '').split('.')[1];
	} while(k in sockets)
	return k;
}

function trimGtld(domain) {
	return domain;
}

function getDomainDirectoryPath(host) {
	let parts = host.split(':')[0].split('.'),
		domain = parts.length < 2 ? parts[parts.length - 1] : parts[parts.length - 2];
	return path.dirname(appPath) + '/' + domain.toLowerCase() + '/';
}

function trimDomain(host) {
	return host.toLowerCase().trim();
	// let localDomainMatch = host.match(/^([a-z0-9_-]*):\d*/i);
	// let trimmedHost = localDomainMatch
	// 			? localDomainMatch[1]
	// 			: trimGtld(host);
	// return trimmedHost.toLowerCase()
}

function getEntireDomainDirectoryPath(host) {
	return path.dirname(appPath) + '/' + trimDomain(host) + '/';
}

function mergeArrayIntoObject(arr) {
	let obj = {};
	arr.forEach(function(item){
		for(let k in item) {
			obj[k] = item[k]
		}
	});
	return obj;
}


function isValidEmail(email) {
	return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email + '')
}


function csvToJS(csvfile, isString, headers) {

	function parseRow(r) {
		let isgood = true;
		return r.replace(/,"",/g, ',,').replace(/^"",/, ',').replace(/,""$/, ',').split(',').reduce((a, i) => {
			if(i.startsWith('"') && i.endsWith('"')) {
				i = i.replace(/^"/, '').replace(/"$/, '');
			}
			if(i.startsWith('"')) {
				isgood = false;
				a.push(i.replace('"', ''))
				return a;
			}
			if(isgood) {
				a.push(i);
				return a;
			}
		
			if(i.endsWith('"')) {
				isgood =true;
				i = i.replace(/"$/, '')
			}
			a[a.length -1] += ',' + i;
			return a;
		}, []);
	}
	
	
	let csvstr = isString ? csvfile : fs.readFileSync(csvfile, 'utf8')
		, rows = csvstr.trim().split('\n').map(r => r.trim())
		, header = parseRow(rows.shift())
		, data = rows.map(r => {
			let cells = parseRow(r);
			return header.reduce((o, h, i) => {
				if(headers && !headers.includes(h)) return o;
				o[h] = cells[i];
				return o;
			}, {});
		})
	;
	return data;
} 

function getFileNameFromReferrer(req, regexPathToRemove, allowSlashes) {
	let parsedUrl = url.parse(req.headers.referer)
	if(!parsedUrl || !parsedUrl.path)
		return;   

	let parsedFileName = parsedUrl.path.substring(1).replace(regexPathToRemove, '');
	if(!allowSlashes && parsedFileName.indexOf('/') > -1)
		return;

	parsedFileName = decodeURIComponent(parsedFileName).split('?')[0];
	return (parsedFileName || '').replace(/[^A-Za-z0-9_-]$/, '');
}

function isValidDate(d) {
	if(!d === true) return false;
	return new Date(d) !== 'Invalid Date';
}

function isObject(o) {
	return o && typeof(o) === 'object' && !Array.isArray(o);
}

function get(o, p, d) {
	if(!p) return o;
	let parts = p.split('.');
	try {
		let a = o;
		while(parts.length) {
			a = a[parts.shift()];
		}
		return a === undefined ? d : a;
	} catch(ex) {
		return d;
	}
}

function set(o, p, v) {
	if((!p && p !== '') || !p.split) return o = v;
	let parts = p.split('.')
		, s = o
	;
	while(parts.length > 1) {
		let k = parts.shift();
		s[k] = s[k] || {};
		s = s[k];
	}
	s[parts.shift()] = v;
}

function parseJSON(str) {
	try {
		return JSON.parse(str);
	} catch (ex) {
		return {contents: str}
	}
}

function generateRandomString(special) {
	let dateStr = Date.now().toString()
		, randoStr = (Math.random() + '').split('.')[1]
		, combinedStr = dateStr + randoStr
	;
	combinedStr = combinedStr
		.split('')
		.map(c => 
			String.fromCharCode((c.charCodeAt(0) + 26 +Math.random(0)*26))
		)
		.join('')
	if(special) return combinedStr
	return combinedStr.replace(/[^0-9a-zA-Z]+/g, '')
}

function bindDataToTemplate(template, data, insertObjects) {
	let boundTemplate = '';
	try {
		let flattenData = flattenObject(data);
		boundTemplate =  Object.keys(flattenData).reduce((text,k) => {
			let val = flattenData[k] + '';
			text = text.replace(new RegExp(`{{${k}}}`, 'gi'), val)
						.replace(new RegExp(`{{CAPITALIZE_${k}}}`, 'gi'), capitalizeFirstLetter(val))
						.replace(new RegExp(`{{UPPERCASE_${k}}}`, 'gi'), val.toUpperCase());
			return text;
		}, template);

		if(!insertObjects) return boundTemplate;

		let objectsToInsert = template.match(/\|\|([0-9a-zA-Z]*)\|\|/g);
		if(!objectsToInsert) return boundTemplate;

		objectsToInsert.forEach(o => {
			let key = o.match(/\|\|([0-9a-zA-Z]*)\|\|/)[1];
			boundTemplate = boundTemplate.replace(o, JSON.stringify(data[key], null, '\t'))  
		})

		return boundTemplate
	} catch(ex) {
		return boundTemplate;
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function decamelize(str) {
	const rex = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
	str = capitalizeFirstLetter(str);
	return str.replace(rex, '$1$4 $2$3$5');
}

function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function runCommand(cmd, args, options, callback) {

	if(typeof(options) === 'function') {
		callback = options;
		options = {};
	}
	callback = callback || function() {}

	let notify = console.log;
	if(options) delete options.notify;
	
	let command = child_process.spawn(cmd, args, options)
		, data = ''
	;
	
	command.stdout.on('data', (_data) => {
		notify(null, _data.toString('utf8'))
		data += _data;
	});

	command.stderr.on('data', (_data) => {
		notify(null, _data.toString('utf8'));
		data += _data;
	});

	command.on('close', (code) => {
		callback(null, data);
	});
}

function runCommandSync(cmd, args, options, callback) {

	if(typeof(options) === 'function') {
		callback = options;
		options = {};
	}
	callback = callback || function() {}

	let notify = console.log;
	if(options) delete options.notify;
	
	let data = child_process.spawnSync(cmd, args, options);
	
	callback(data.error, data.output.join('\n'));
}

function flattenObject(obj, flatObj, prefix) {
	flatObj = flatObj || {};
	prefix = prefix || '';
	if(obj === null || Array.isArray(obj) || ['undefined', 'string', 'number', 'boolean'].includes(typeof(obj))) {
		flatObj[prefix] = obj;
		return flatObj;
	}
	try {
		obj = JSON.parse(JSON.stringify(obj));
		return Object.keys(obj).reduce((o, k) => {
			let val = obj[k];
			let flatKey = prefix ? `${prefix}.${k}` : k;
			if(val && typeof(val) === 'object') {
				return flattenObject(val, o, flatKey);
			} else {
				o[flatKey] = val;
				return o;
			}
		}, flatObj)
	} catch(ex) {
		flatObj[prefix] = obj;
		return flatObj;
	}
}

function mergeObjects(o1, o2) {
	return Object.keys(o2).reduce((o, k2) => {
		let v1 = o1[k2];
		let v2 = o2[k2];
		if(v1 === undefined) {
			o[k2] = v2;
			return o;
		}

		if(Array.isArray(v1) || ['undefined', 'string', 'number'].includes(typeof(v1))) {
			o[k2] = v2;
			return o;
		}

		if(typeof(v1) === 'object' && typeof(v2) === 'object') {
			o[k2] = mergeObjects(v1, v2);
			return o;
		}

		o[k2] = v2;
		return o;

	}, o1);
}

function extractFields(source, mapping) {
	return Object.keys(mapping).reduce((o, k) => {
		try {
			const keyParts = k.split('-').filter(p => p)
				, outputField = mapping[k]
			;

			let val = source;
			do {
				val = val[keyParts.shift()];
			} while(keyParts.length)

			o[outputField] = val;
			return o;
		} catch(e) {
			return o;
		}
		
	}, {});
}

function extractJustKeysFromOneObject(valueSource, keySource) {
	return Object.keys(keySource).reduce((o, k) => {
		let val = valueSource[k];
		if(val === null || Array.isArray(val) || ['undefined', 'string', 'number', 'boolean'].includes(typeof(val))) {
			o[k] = val;
			return o;
		}

		if(val instanceof Date) {
			o[k] = val;
			return o;
		}

		let keySourceVal = keySource[k];
		try {
			if(Object.keys(val) && Object.keys(keySourceVal) && Object.keys(keySourceVal).length) {
				o[k] = extractJustKeysFromOneObject(val, keySourceVal);
				return o;
			}
			o[k] = val;
			return o;
		} catch(ex) {
			o[k] = val;
			return o;
		}

	}, {})
}

function padLeft(str1) {
	return str1<=9 ? '0' + str1 : str1
}

function formatDate(date) {
	 let month = date.getMonth() + 1
	 return date.getFullYear() + '-' 
		 + padLeft(month) + '-' 
		 + padLeft(date.getDate()) + ' ' 
		 + padLeft(date.getHours()) + ':' 
		 + padLeft(date.getMinutes());
}

function getDaysAgoDate(date) {
	const now = new Date()
		, daydiff = Math.floor((now - date)/24/3600000)
	;
	if(daydiff === 0) return 'today';
	if(daydiff === 1) return 'yesterday';
	if(daydiff <= 180) return `${daydiff} days ago`;
	return date.toLocaleDateString();
}

function injectWidgets(template, data, widgets, cb) {
	let scripts = {}
		, styles = {}
	;
	
	let page = bindDataToTemplate(template, data);
	async.each(widgets, (widget, next) => {
		widget.loader((err, dataLoader, files, widgetName) => {
			if(err) return next(err);
			
			dataLoader((err, data) => {
				if(err) return next(err);

				let dataToBind = data ? JSON.parse(JSON.stringify(data)) : {};
				
				files.itemTemplate = files.itemtemplate || files.itemTemplate;
				if(files.itemTemplate && dataToBind.items) {
					dataToBind.items = dataToBind.items.map(item => bindDataToTemplate(files.itemTemplate, item)).join('');
				}
				let template = bindDataToTemplate(files.template, dataToBind);
				dataToBind = {};
				dataToBind[widget.placeholder] = template;
				
				page = bindDataToTemplate(page, dataToBind);
				
				if(files.script) scripts[widgetName] = scripts[widgetName] || bindDataToTemplate(files.script,data, true);
				if(files.styles) styles[widgetName] = styles[widgetName] || bindDataToTemplate(files.styles,data);
				next(null);
			})
			
		})
	}, (err) => {
		if(err) return cb(err);
		let dataToBind = {
			styles: Object.keys(styles).map(k => styles[k]).join('\n')
			, script: Object.keys(scripts).map(k => `(function() {\n${scripts[k]}\n})();`).join('\n')
		}
		page = bindDataToTemplate(page, dataToBind);
		cb(null, page);
	});
}

function loadFiles(folder, cb) {
	if(!fs.existsSync(folder)) return cb(null, []);
	fs.readdir(folder, (err, filepaths) => {
		if(err) return cb(err);
		let files = {};
		filepaths = filepaths.filter(f => f.includes('.'))
		async.each(filepaths, (filepath, next)=> {
			fs.readFile(path.join(folder, filepath), 'utf8', (err, fileData) => {
				if(err) return next(err);
				const filename = path.parse(filepath).name;
				files[filename]  = fileData;
				next();
			})
		}, (err) => {
			if(err) return cb(err);
			cb(null, files);
		})       
	});
}

function createWidgetLoader(dir, cache, widgetName, dataLoader) {
	return function(cb) {
		const widgetPath = path.join(dir, `./widgets/${widgetName}`)
			.replace('api/apps', 'api/libs')
		;
		loadFiles(widgetPath, (err, files) => {
			if(err) return cb(err);
			cache[widgetName] = files;
			cb(null, dataLoader, files, widgetName);
		})
	}
}

function createAppletLoader(dir, cache, dataLoader) {
	return function(cb) {

		const appletFolder = path.parse(dir).name
			, widgetPath = path.join(dir, `../../libs/${appletFolder}/widgets/dashboard`)
		;
		loadFiles(widgetPath, (err, files) => {
			if(err) return cb(err);
			cache.dashboard = files;
			cb(null, dataLoader, files, 'dashboard');
		})
	}
}

function getTime(time) {
	if (!time) return 'n/a';
	let tp = time.split(':')
		, hr = parseInt(tp[0])
		, mn = parseInt(tp[1])
		, ac = hr >= 12 ? 'pm' : 'am';
	return (hr > 12 ? hr - 12 : hr) + ":" + (mn < 10 ? '0' + mn : '' + mn) + ac;
}

function getShortDate(date) {
	if(!date) return 'n/a';
	return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getDateRange(s, e) {
	return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`
}

function getDaysOfWeek(startDate, endDate) {
	if(!startDate || !endDate || !startDate.getDay || !endDate.getDay) return 'n/a';
	if(startDate.getDay() === endDate.getDay()) {
		const daysOfWeek = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
		return daysOfWeek[startDate.getDay()];
	}
	return `${startDate.toDateString().split(' ')[0]}-${endDate.toDateString().split(' ')[0]}`
}

function generateId() {
	return ((new Date()*1) + '' + Math.random()).replace('.', parseInt(Math.random()*10) + '');
}

module.exports = {
	appName
	, initialize
	, makeTwoDigits
	, escapeHtml
	, getDomainDirectoryPath
	, appPath
	, mergeArrayIntoObject
	, trimGtld
	, getEntireDomainDirectoryPath
	, generateSocketId
	, csvToJS
	, getFileNameFromReferrer
	, trimDomain
	, isValidDate
	, isValidEmail
	, isObject
	, get
	, set
	, parseJSON
	, generateRandomString
	, bindDataToTemplate
	, runCommand
	, runCommandSync
	, capitalizeFirstLetter
	, flattenObject
	, mergeObjects
	, extractFields
	, extractJustKeysFromOneObject
	, padLeft 
	, formatDate 
	, getShortDate
	, injectWidgets
	, loadFiles
	, createWidgetLoader
	, createAppletLoader
	, getDaysAgoDate
	, shuffle
	, getTime
	, getDaysOfWeek
	, generateId
	, getDateRange
	, getDateList
	, decamelize
	, getTimeZoneOffset
	, getLocalDate
	, escapeHTMLObject
	, escapeScriptInjection
}