import Modal from '/libs/modal/script.js'

const $full = document.querySelector('#full')
	, $features = document.querySelector('#features')
	, $toolboxa = document.querySelector('#toolboxa')
	, $toolboxb = document.querySelector('#toolboxb')
	, $main = document.querySelector('main')
	, $table = document.querySelector('#main table')
	, $create = document.querySelector('#create')
	, $tbody = $main.querySelector('tbody')
	, $headers = Array.from(document.querySelectorAll('#main > table > thead > tr > th[data]'))
	, navigationStartEvent = new CustomEvent('navigatestart')
	, navigationEndEvent = new CustomEvent('navigateend')
;

const menuItemOrder = [
	"MERGE", "PUBLISH", "PERMISSIONS", "COPY", "RENAME", "DOWNLOAD", "MERGE", "MIGRATE", "ROLLBACK", "DELETE"
	// "PUBLISH", "COPY", "RENAME", "DELETE", "DOWNLOAD", "MERGE", "MIGRATE", "PERMISSIONS", "ROLLBACK"
]

const createItemOrder = [
	"CREATER", "APPLETBUILDER", "UPLOADER", "MIGRATER"
]

let mainScrollTo;

function createEditLink(item) {
	const iconsByFileExtensions = {
		    html: "<i class='ic-file-html'></i>",
		    css: "<i class='ic-file-css'></i>",
		    js: "<i class='ic-file-js'></i>",
		    app: "<i class='ic-file-js'></i>",
		    api: "<i class='ic-file-js'></i>",
		    py: "<i class='ic-file-py'></i>",
		    folder: "<i class='ic-folder primary-100'></i>",
		    '': "<i class='ic-file'></i>"
		}
	;
	item.ext = item.isFolder ? 'folder' : item.name.split('.').reverse()[0]
	item.isApplet = ['api', 'app', 'schemas'].includes(item.ext)
	item.isFolder = item.ext === 'folder'
	item.isImage = extTypes[item.ext] === 'image'
	item.isSvg = item.ext === 'svg'
	item.isVideo = extTypes[item.ext] === 'video'
	item.isText = extTypes[item.ext] === 'text'
	item.target = item.isText ? '_blank' : '_self'
	item.fileIcon = (item.isImage || item.isSvg) ? `<img src='/${item.fullpath}'>` : (iconsByFileExtensions[item.ext] || iconsByFileExtensions[''])
	item.hrefPath = item.isApplet ? `/edit/${item.name}` : item.isText ? `/edit/${item.fullpath}` : item.isFolder ? `/explore/list/${item.fullpath}` : '';
	item.displayName = item.name;
	item.domain = item.domain || '';
	item.origin = item.isFolder ? ''
		: item.domain === location.host ? '' : `${location.protocol}//${item.domain}`
	item.search = item.isFolder ? location.search : '';
	return;
}

function createDisplayLink(data) {
	data.playDisplay = data.isFolder ? 'none' : 'block';
	data.playPath = data.isFolder 
		? '' 
		: data.isVideo
			? `javascript: window.playVideo('/${data.fullpath}')`
			: data.isApplet
				? `/${data.name}`
				: `/${data.fullpath}`;
	data.playTarget = data.isFolder || data.isVideo
		? ''
		: '_blank'
}

function createMenuIcons(data) {
	data.menuIcons = [];
	if(['home.html', 'profile.html'].includes(data.fullpath)) return;
	if(!data.isOwner) return;
	
	data.menuIcons.push({
		id: data.id, text: 'Delete', className: 'delete', title: 'delete', onclick: deleteItem
	});
}

function convertFileSize(fileSize, decimals = 2) {
	if(isNaN(fileSize)) return '--';
    if (fileSize === 0) return '--';
    if (fileSize === undefined) return '--';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(fileSize) / Math.log(k));

    return parseFloat((fileSize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function findFileKind(item) {
	if(item.isFolder) return 'Folder';
	
    const fileName = item.name
    	, fileExtension = fileName.split('.').length > 1 ? fileName.split('.').reverse()[0] : 'note'
        , fileContentType = contentTypes[`${fileExtension}`] || 'file'
        , fileClass = `${fileExtension.toUpperCase()} ${fileContentType}`
    ;
    return fileClass
}

function convertDate(d) {
	function pad(n) {
		return n >= 10 ? '' + n : '0' + n;
	}
	
	const date = new Date(d)
		, modifiedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    	, hour = date.getHours()
        , modifiedTime = `${pad(hour > 12 ? hour - 12 : hour)}:${pad(date.getMinutes())} ${date.getHours() >= 12 ? 'PM' : 'AM'}`
        , dateView = `${modifiedDate} ${modifiedTime}`
    ;
    return dateView
}

function mutateTableRow(data) {

	createEditLink(data);
	createDisplayLink(data);
	createMenuIcons(data);
	
	data.fileSize = convertFileSize(data.size);
	data.fileKind = findFileKind(data);
	data.dateUpdated = convertDate(data.dateUpdated);
	data.icons = [];
	return data;
}

function deleteItem(menuItem, data) {
	const deleteModal = new Modal({
		modalContainerId: 'deleteModal'
		, modalTitleText: `Delete?`
		, modalContentsInnerHTML: `<div class="modal-description"><p>Are you sure you want to delete <b>${data.name}</b>?</p></div>`
		, modalSubmitBtnText: 'Delete'
		, modalSubmitBtnAction: function() {
			let url;
			if(data.isFolder) {
		        url = '/explore/folder?folder=' + encodeURIComponent(data.fullpath);
			} else {
		        url = '/explore/' + data.id;
			}
			fetchAndReload(url, {
				method: 'DELETE'
				, modal: deleteModal
			}, (ex) => {
				if(ex) alert(ex);
			});
		}
		, modalCancelBtnText: 'Cancel'
		, modalCancelBtnAction: function(){
			deleteModal.destroy();
		}
	})
	
	deleteModal.show();
	window.dispatchEvent(new CustomEvent('deleteModalOpened', { detail: { data } }));
}

function fetchAndReload(url, options, cb) {
	cb = cb || function() {};
    $tbody.innerHTML = '';
	let to = setTimeout(function() {
			$tbody.innerHTML = '<div class="loader"><div></div></div>';
		}, 1000)
		, reloadUrl = location.pathname
	;
	
    if(options.modal) {
    	options.modal.destroy();
    	delete options.modal;
    }
    if(options.reloadUrl) {
    	reloadUrl = options.reloadUrl;
    	delete options.reloadUrl;
    }
    fetch(url, options).then((resp) => {
  		clearTimeout(to);
  		navigateToFolder(reloadUrl, false, (err) => {
  			cb(err, resp);
  		});
  		
    }).catch(ex => cb(ex));
}

function bindDataRow(row, data) {
	const $tableFolder = row.querySelector('td.table-file a[ext=folder]');
	$tableFolder && $tableFolder.addEventListener('click', e => {
		e.preventDefault();
		navigateToFolder($tableFolder.href);
	});

	const $emptyLink = row.querySelector('td.table-file a[href=""]');
	$emptyLink && $emptyLink.addEventListener('click', e => {	e.preventDefault() });
	
	const $overflowMenu = row.querySelector('td.control a.overflow')
		, $overflowMenuBackground = $overflowMenu.nextElementSibling
		, $overflowUl = $overflowMenuBackground.nextElementSibling
		, order = menuItemOrder.reduce((o, i, k) => {
			o[i.toUpperCase()] = k
			return o;
		}, {})
	;

	data.menuIcons
		.sort((a, b) => 
			order[a.title.toUpperCase()] > order[b.title.toUpperCase()] 
				? 1 : -1)
		.forEach(icon => {
			const $li = document.createElement('li')
				, $a = document.createElement('a')
			;
			if(icon.className) $a.className = icon.className;
			if(icon.title) $a.setAttribute('title', icon.title);
			if(icon.id) $a.setAttribute('data-id', icon.id);
			if(icon.onclick) $a.addEventListener('click', (e) => {
				e.preventDefault();
				$overflowMenuBackground.click();
				icon.onclick(icon, data);
			})
			$a.innerHTML = icon.text;
			$li.className = 'menus';
			$li.appendChild($a)
			$overflowUl.appendChild($li);
		}
	);
	$overflowMenu.addEventListener('click', e => {
		e.preventDefault();
		openOverflowMenus($overflowMenu);
	});	
}

function addTableRow(item, options) {
	const row = document.createElement('tr')
		, data = JSON.parse(JSON.stringify(item))
	;
	Object.assign(data, options);
	mutateTableRow(data)

	listExtensions.forEach(ext => {
		ext.mutateTableRow && ext.mutateTableRow(data);
	});
	
	const directoryInfo = data.directoryInfo ? `<span class="fileDirectoryToShow">in ${data.directoryInfo}</span>` : '';
	row.innerHTML = `
			<td class="table-file" >
				<a title='${data.fullpath}' ext='${data.ext}' target='${data.target}' href='${data.origin}${data.hrefPath}${data.search}'>
					${data.fileIcon}
					<span class='fileNameToShow'>${data.displayName}${data.icons.join('')}</span>
					${directoryInfo}
				</a>
			</td>
			<td class="size">${data.fileSize}</td>
			<td class="kind">${data.fileKind}</td>
			<td>${data.dateUpdated}</td>
			<td class='control'> 
				<a class='overflow'><i class="ic-overflow"></i></a>
				<div class="menus-background"></div>
				<ul class="menus-list"></ul>
				<a title="view" href="${data.playPath}" target="${data.playTarget}" style="display:${data.playDisplay};">VIEW</a>
			</td>
		`.trim();

	bindDataRow(row, data)
	$tbody.appendChild(row);
}

function sortTable(column, direction, type) {
	const primary = document.querySelector('th.primary');
	column = column || (primary ? primary.getAttribute('data') : 'dateUpdated');
	direction = direction || (primary ? (primary.className.includes('down') ? 'down' : 'up') : 'up');
	type = type || (primary ? primary.getAttribute('type') : 'date');
	function convert(v) {
		const val = column === 'kind'
			? findFileKind(v)
			: v[column];
		if(type === 'date') return new Date(val);
		if(type === 'number') return parseFloat(val);
		if(type === 'string') return (val + '').toLowerCase();
		if(type === 'kind') return v.isFolder 
			? (direction === 'up' ? '~' + v.name : ' ' + v.name)
			: val;
		return v;
	}
	
	listData.sort((a,b) => {
		const d = direction === 'up' ? -1 : 1;
		return convert(a) > convert(b) ? d : -1*d;
	});
	showFiles();
}

async function navigateToFolder(path, skipPush, cb) {
	cb = cb || function() {};
	if(!skipPush) history.pushState("", "", path);
	window.dispatchEvent(navigationStartEvent);
	
	$tbody.innerHTML = '';
	let to = setTimeout(function() {
		$tbody.innerHTML = '<div class="loader"><div></div></div>';
	}, 1000);
	
	
	const result = await fetch(path.replace('explore/list', 'explore/json'))
		, json = await result.json()
	;
	clearTimeout(to);
	if(json.err) return cb(json.err);
	
	listData = json.resp;
	sortTable();
	createItems();
	cb();
	window.dispatchEvent(navigationEndEvent);
}

function openOverflowMenus(target) {
	const menuBackground = target.nextElementSibling
		, menuList = menuBackground.nextElementSibling
	;
	
	function closeOverflowMenus() {
		menuBackground.removeEventListener('click', closeOverflowMenus);
    	menuBackground.classList.remove('opened');
        menuBackground.style.display = 'none';
    	menuList.classList.remove('opened');
        menuList.style.display = 'none';
	};
	
    menuBackground.addEventListener('click', closeOverflowMenus);
    menuBackground.style.display = 'block';
    menuBackground.classList.add('opened');
    menuList.style.display = 'block';
    menuList.classList.add('opened');
}

function openUploadButtonSubmenus() {
	const exceedLimitAlertModal = new Modal({
		modalContainerId: 'exceedLimitAlertModal'
		, modalTitleText: 'Upgrade'
		, modalContentsInnerHTML: `<div class="modal-description">Your coding space exceeds its limit. Please upgrade your plan to get more data</div>
			<a href="https://www.qoom.io/pricing" target="_blank">Learn more about Starter plan.</a>
			`
		, modalCancelBtnText: 'Maybe Later'
		, modalCancelBtnAction: function() {
			let $exceedLimitAlertModal = document.getElementById('exceedLimitAlertModal');
			$exceedLimitAlertModal.style.display = 'none';
			document.body.removeChild($exceedLimitAlertModal);
		}
		, modalSubmitBtnText: 'Upgrade'
		, modalSubmitBtnAction: function() {
			//todo: go to accountmanager page's myplan section
		}
	});
			
	fetch('/restrict/checklimits', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
	.then(data => {
		if(data.exceedsDataUsage || data.exceedsFilesAmount) {
			exceedLimitAlertModal.show();
		} else {
			$create.className = 'opened';
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function closeUploadButtonSubmenus() {
    $create.className = '';
}

function bindSorters() {
	$headers.forEach($el => {
		const column = $el.getAttribute('data')
			, type = $el.getAttribute('type')
		;
		$el.classList.add('up');
		$el.addEventListener('click', () => {
			$headers.forEach($h => {
				if($h.getAttribute('data') === column) {
					$h.classList.add('primary');
				} else {
					$h.classList.remove('primary');
				}
			})
			let direction;
			if($el.classList.contains('up')) {
				$el.classList.add('down');
				$el.classList.remove('up');
				direction = 'down';
			} else {
				$el.classList.remove('down');
				$el.classList.add('up');
				direction = 'up';
			}
			sortTable(column, direction, type);
		});
	});	
}

function bindCreate() {
	$create.querySelector('button').addEventListener('click', openUploadButtonSubmenus)
	$create.querySelector('.button-upload-submenus-background').addEventListener('click', closeUploadButtonSubmenus)
}

function showFiles() {
	const qs = new URLSearchParams(location.search.slice(1))
		, memberId = qs.get('member')
		, currentMember = memberId ? members.find(m => m._id === memberId) : true
		, isOwner = !memberId || (currentMember.ship === location.host)
	;

    $tbody.innerHTML = '';
    listData.forEach(item => {
    	if(!item.isFolder && !item.id) return;
    	addTableRow(item, { isOwner });
    });
}

function createTools() {

	listExtensions
		.filter(e => e.createTool)
		.forEach(ext => {
			ext.createTool();
		}
	);
}

function createItems() {
	const creator = []
		, order = createItemOrder.reduce((o, i, k) => {
			o[i.toUpperCase()] = k
			return o;
		}, {})
		, $ul = $create.querySelector('ul')
	;
	let count = 0;
	
	listExtensions
		.filter(e => e.createItem)
		.forEach(ext => {
			ext.createItem(creator);
			count++;
		}
	);
	$ul.innerHTML = '';
	Object.keys(creator)
		.sort((a, b) => order[a.toUpperCase()] > order[b.toUpperCase()] ? 1 : -1)
		.forEach((key, j) => {
			creator[key].forEach(item => {
				const $li = document.createElement('li');
				$li.className = 'button-upload-submenu';
				if(item.id) $li.id = item.id;
				$li.innerHTML = `<i class="${item.icon}"></i>${item.text}`
				$li.addEventListener('click', () => { 
					closeUploadButtonSubmenus();
					if(item.onclick) item.onclick(); 
				});
				$ul.appendChild($li)				
			})
			if(j < count) {
				const $li = document.createElement('li');
				$li.innerHTML = '<hr>'
				$ul.appendChild($li)
			}
		})
	;
}

function load() {
	createItems();
	createTools();
	sortTable();
	bindSorters();
	bindCreate();
	window.dispatchEvent(navigationEndEvent);
}

function handleFooterView() {
	const height = $main.getBoundingClientRect().height + 50
		, pos = $main.scrollHeight - $main.scrollTop// + 50
		, isNearBottom = pos <= height
	;
	let templateRowStyle;
	if(($main.scrollHeight - window.innerHeight)  < 55) {
		templateRowStyle = '54px auto 44px';
	} else if(isNearBottom) {
		templateRowStyle = '54px auto 44px';
		setTimeout(function() {
			$main.scrollTo({
			  top: $main.scrollHeight,
			  left: 0,
			  behavior: 'auto'
			}) }, 0);
	} else {
		templateRowStyle = '54px auto 1px';
	}
	document.body.style.gridTemplateRows = templateRowStyle;
}

setInterval(handleFooterView, 100);

window.playVideo = (url) => { const x = window.open(); x.document.write(`<video src="${url}" controls width='640'></video>`);};
window.onpopstate = (e) => { navigateToFolder(location.pathname, true) };
window.onload = load;

window.explorer = {
	fetchAndReload
	, navigateToFolder
	, $full
	, $features
	, $toolboxa
	, $toolboxb
	, $create
	, $main
	, $table
	, $tbody
	, $headers
}