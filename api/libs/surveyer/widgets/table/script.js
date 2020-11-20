const to = 100;

function load() {
	if(!window.Modal) return setTimeout(load, to);
	const data = {{DATA}}
		, raw = JSON.parse(JSON.stringify(data))
		, enums = {{ENUMS}}
		, ids = {{IDS}}
		, idKeys = Object.keys(ids)
		, title = '{{TITLE}}'
		, headers = data.length ? data.reduce((a,r) =>{
			Object.keys(r).forEach(k => {
				if(!a.includes(k)) a.push(k);
			})
			return a;
		}, []) : []
		, fields = headers
			.filter(h => !h.startsWith('_') && !['dateUpdated', 'dateCreated'].includes(h))
			.reduce((a, h) => {
				const col = data.map(d => d[h])
					, type = getDataType(h, col)
					, label = type === 'hidden' ? undefined : helper.decamelize(h)
					, name = h
					, o = { type, label, name }
				;
			
				a.push(o);
				return a;
			}, [ { type: 'hidden', label: '', name: '_id' } ])
		, columns = headers
			.filter(h => !h.startsWith('_') && !['dateUpdated', 'dateCreated'].includes(h))
			.reduce((a, h) => { 
				let o = { title: helper.decamelize(h), field: h } //, editor: 'input' }
					, col = data.map(d => d[h])
					, dataType = getDataType(h, col)
				; 
				if(h === '#') return a;
				switch(dataType) {
					case 'text':
						o.maxWidth = 100;
						break;
					case 'html':
						o.maxWidth = 150;
						o.formatter = 'html';
					case 'phone':
					case 'email':
						o.maxWidth = 150;
						break;						
					case 'number':
						data.forEach(r => {
							r[h] = parseFloat(r[h]);
							if(isNaN(r[h])) r[h] = undefined;
						})
						break;
					case 'image':
						o.formatter = 'image'
						o.formatterParams = {  maxWidth:'75px', hozAlign: 'center' }
						break;
					case 'date':
						o.formatter = 'datetime'
						o.formatterParams = { 
							inputFormat: 'YYYY-MM-DD HH:mm'
							, outputFormat: h.endsWith('Date') ? 'YYYY-MM-DD<br>(ddd)' : 'YYYY-MM-DD<br>hh:mm a'
							, invalidPlaceholder: ''
							, timezone: 'America/Los_Angeles'
							, sorter: 'date'
						}
						data.forEach(r => {
							const d = new Date(r[h]);
							if(d + '' === 'Invalid Date') return;
							r[h] = moment(r[h]).format('YYYY-MM-DD HH:mm');
						})
						break;
					case 'ical': 
						o.formatter = 'html';
						o.maxWidth = 120;
						data.forEach((r,ix) => {
							r[h] = r[h] ? `<button onclick="downloadICS('${h}', ${ix})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg></button>`
								: '';
						})						
						break;						
					case 'object':
						o.formatter = 'html';
						o.maxWidth = 120;
						data.forEach((r,ix) => {
							if(!r[h]) return r[h] = '';
							const o = JSON.stringify(r[h])
								, pre = r[h].name ? `<div>${r[h].name}</div>` : ''
							r[h] = pre + (r[h].name ? '' : `<button onclick="showDetails('${h}', ${ix})">View</button>`)
						})						
						break;
					case 'array':
						o.formatter = 'html';
						o.maxWidth = 75;
						data.forEach((r, ix) => {
							if(!r[h]) return r[h] =  '';
							if(!r[h].length) return r[h] =  '';
							if(r[h].filter(i => i).every(i => i.name)) return r[h] = r[h].map(i => i.name).join('<br>');
							if(r[h].filter(i => i).every(i => typeof(i) === 'object' && JSON.stringify(i).startsWith('{'))) {
								const fi = r[h].find(i => typeof(i) === 'object' && JSON.stringify(i).startsWith('{'))
									, _idKey = Object.keys(fi).find(k => /^[0-9a-fA-F]{24}$/.test(fi[k]) && idKeys.includes(k))
								;
								if(_idKey) {
									return r[h] = r[h].map(v => ids[_idKey][v[_idKey]]).join('<br>')
								}
							}
							const o = JSON.stringify(r[h])
							r[h] = `<button onclick="showDetails('${h}', ${ix})">View</button>`
						})						
						break;
					case 'hidden':
						data.forEach(r => delete r[h]);						
						return a;
					case 'bool':
						o.formatter = 'tickCross' 
						o.formatterParams ={
						    allowEmpty: true,
						    allowTruthy: true,
						    tickElement: '<i class="icon ic-check-circle-full"></i>',
						    crossElement: '<i class="icon ic-cancel"></i>'
						}
					//	o.editor = 'tickCross'
						o.maxWidth = 25;
						break;
					case 'enum':
				//		 o.editor = 'select'
				//		 o.editorParams = { values: enums[h]  }
						break;
					case 'money':
						o.formatter = 'money';
						o.formatterParams = {
						    decimal: '.',
						    thousand: ',',
						    symbol: ' $ '.trim(),
						    precision: 0
						}
						data.forEach(r => r[h] = (r[h] + '').trim().startsWith(' $ '.trim()) ?  r[h].replace(' $ '.trim(), '') : r[h])
						break;
				}
				a.push(o);
				return a;
			}, [{ title: '#', field: '#', width: 25, responsive: 0 }, { title: '', field: 'edit', width: 25, responsive: 0, cellClick: showEdit }, { title: '', field: 'delete', width: 25, responsive: 0, cellClick: showDelete }])
		, filters = columns
			.filter(c => c.title !== '#')
			.map(c => {
				return c.title ? `<option value='${c.field}'>${helper.decamelize(c.title)}</option>` : ''
			})
		, $filterField = document.querySelector('#filter-field')
		, $filterOp = document.querySelector('#filter-type')
		, $filterText = document.querySelector('#filter-value')
		, $filterIt = document.querySelector('#filter-it')
		, $filterClear = document.querySelector('#filter-clear')
		, $download = document.querySelector('#data-download')
		, $add = document.querySelector('#dataAdd')
		, table = data.map(r => {
			let _id = r._id;
			let o = { edit: 'edit', delete: 'delete'};
			Object.keys(r).forEach(k => {
				if(k.startsWith('_') || ['dateUpdated', 'dateCreated'].includes(k)) return;
				o[k] = r[k]; 
			})
			return o
		})
		, tableobj = new Tabulator('#datatable', {
		 	height: '100%'
		 	, data: table
		 	, layout: 'fitColumns'
		 	, columns: columns
		 	, responsiveLayout: 'collapse'
		})
	;

	function getDataType(h, col) {
		if(col.every(r => r === undefined || r === null || r.length === 0 || (r + '').trim() === ''))
			return 'hidden';
		if(/phone/i.test(h))
			return 'phone';
		if(/email/i.test(h))
			return 'email';
		if(h.toLowerCase().trim() === 'ical') 
			return 'ical';
		if(col.some(r => Array.isArray(r))) { console.log(h)
			return 'array';}
		if(col.some(r => (r + '').includes('[object Object]') ))
			return 'object';
		if(!!enums[h])
			return 'enum';
		if(col.some(r => ['jpeg', 'gif', 'png', 'jpg'].includes((r + '').trim().toLowerCase().split('.').reverse()[0])))
			return 'image';
		if(col.every(r => ['true', 'false', '', undefined, true, false, null, 0, 1].includes(r)))
			return 'bool';
		if(col.some(r => (r + '').length > 9 && /\/|\:|\-/.test(r + '') && (new Date(r) + '') !== 'Invalid Date' && /^\d/.test(r + '')))
			return 'date';
		if(col.some(r => /\d\d\:\d\d/.test((r + '').trim())))
			return 'time';
		if(col.every(r => !isNaN(parseInt(r)) || (r + '').trim() === '' || r === undefined || r === null ))
			return 'number';
		if(col.some(r => {
				const v = (r + '').trim();
				if(!v.startsWith(' $ '.trim() )) return false;
				return !isNaN(parseInt(v.replace(' $ '.trim(), '')))
			}))
			return 'money';
		if(col.every(v => (v + '').length < 8))
			return 'text';
		if(col.some(r => ((r + '').trim().startsWith('<') && (r + '').trim().endsWith('>')) 
		              || ((r + '').trim().startsWith('&lt;') && (r + '').trim().endsWith('&gt;'))))
			return 'html';
		return 'textarea';
	}
	
	function generateInput(name, value) {
		
	}
	
	function generateForm(dataRow, index) {
		const formFields = fields.map(o => {
			let type = o.type
				, value = index !== undefined ? raw[index][o.name] : ''
				, newvalue = index !== undefined ?  data[index][o.name] : ''
				, element
				, image
				, style = 'flex: 4 0 200px;'
				, options
			;
			if(value === undefined) return '';
			if(!dataRow && o.name === '_id') return '';
			if(!dataRow && o.name === 'dateUpdated') return '';
			if(!dataRow && o.name === 'dateCreated') return '';
			
			switch(type) {
				case 'textarea':
					style = 'flex: 0 0 100%';
					element = `<textarea placeholder='Enter ${o.label}' name='${o.name}' >${value}</textarea>`
					break;
				case 'number':
					style = 'flex: 4 0 75px;';
					element = `<input type='number' name='${o.name}' value='${value}' placeholder='Enter ${o.label}'>`
					break;
				
				case 'ical':
					element = `<button onclick="downloadICS('${o.name}', ${index}, event)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg></button>`
					break;
				case 'array':
					return '';
					
				case 'object': 
					if(enums[o.name]) {
						options = enums[o.name].map(opt => `<option ${opt === value.name ? 'selected' : ''} value='${value._id}'>${opt}</option>`);
						element = `<select name='${o.name}' >${options}</select>`;
					}
					break;
				case 'enum':
					options = enums[o.name].map(opt => `<option ${opt === value ? 'selected' : ''}>${opt}</option>`);
					element = `<select name='${o.name}' >${options}</select>`;
					break;
				case 'image':
					image = value ? `<img src='${value}' style='width:100px'>` : ''
					element = `${image}<input type='file' name='${o.name}' accept="image/*" >`;
					break;
				case 'bool':
					style = 'width:50px';
					element = `<input type='checkbox' name='${o.name}' ${!!value ? 'checked' : ''}>`
					break;
				case 'date':
					element = `<input type='${type}' name='${o.name}' value='${newvalue.split(/\s+/)[0]}' placeholder='Enter ${o.label}'>`
					break;
				case 'phone':
				case 'email':
					element = `<input type='text' name='${o.name}' value='${value}' placeholder='Enter ${o.label}'>`
					break;
				default: 
					element = `<input type='${type}' name='${o.name}' value='${value}' placeholder='Enter ${o.label}'>`
					break;
			}
			
			return o.label 
				? `<div style='${style}'>
						<label>${o.label}</label>
		        		${element}
		        	</div>`
		        : element
			}).join('\n')
		;

		return `<form method='post' action='${location.pathname.split('?')[0].replace(/list$/, '').replace(/\/$/, '')}'>
					${formFields}
			    </form>`;
	}
	
	function saveDoc(modal) {
		const form = modal.$modaler.querySelector('form');
		form.submit();
	}
	
	async function deleteDoc(id, modal) {
		const path = `/survey/${id}`
			, resp = await fetch(path, { method: 'DELETE' })
		;
		location.reload();
	}
	
	function showDelete(e, cell) {
		const row = cell.getRow()
			, index = row.getPosition()
			, dataRow = raw[index]
		;
		
		const deleteModal = new window.Modal({
			modalContainerId: 'dataDeleteModal'
			, modalTitleText: `Confirm Delete`
			, modalContentsInnerHTML: `Are you sure you want to delete ${dataRow.name  ? '<b>' + dataRow.name + '</b>' : 'this ' + title}?`
			, modalSubmitBtnText: 'Delete'
			, modalSubmitBtnAction: function(){
				deleteDoc(dataRow._id, deleteModal);
			}
			, modalCancelBtnText: 'Cancel'
			, modalCancelBtnAction: function(){
				deleteModal.destroy();
			}
		})

		deleteModal.show();
	}
	
	function showEdit(e, cell) {
		const row = cell.getRow()
			, index = row.getPosition()
			, dataRow = raw[index]
		;
	
		const editModal = new window.Modal({
			modalContainerId: 'dataEditModal'
			, modalTitleText: `Edit ${title}`
			, modalContentsInnerHTML: generateForm(dataRow, index)
			, modalSubmitBtnText: 'Save'
			, modalSubmitBtnAction: function(){
				saveDoc(editModal);
			}
			, modalSecondBtnText: 'Copy'
			, modalSecondBtnAction: function(){
				const $id = document.querySelector('#dataEditModal input[name=_id]');
				$id.parentElement.removeChild($id);
				saveDoc(editModal);
			}
			, modalCancelBtnText: 'Cancel'
			, modalCancelBtnAction: function(){
				editModal.destroy();
			}
		})

		editModal.show();
	}
	
	function filter() {
		const filterField = $filterField.value
			, filterOp = $filterOp.value
			, filterText = $filterText.value
			, filterToApply = filterField;
		;

		tableobj.setFilter(filterToApply,filterOp, filterText);
	}
	
	function add() {
		
		const addModal = new window.Modal({
			modalContainerId: 'dataEditModal'
			, modalTitleText: `Add ${title}`
			, modalContentsInnerHTML: generateForm()
			, modalSubmitBtnText: 'Save'
			, modalSubmitBtnAction: function(){
				saveDoc(addModal);
			}
			, modalCancelBtnText: 'Cancel'
			, modalCancelBtnAction: function(){
				addModal.destroy();
			}
		})

		addModal.show();
	}
	
	function clear() {
		$filterField.value = '';
		$filterOp.value = '=';
		$filterText.value = '';
		tableobj.clearFilter();		
	}
	
	function download() {
		const option = $download.value;
		if(!option) return;
		
		switch(option) {
			case 'csv':
				tableobj.download('csv', `${title}.csv`);
				break;
			case 'json':
				tableobj.download('json', `${title}.json`);
				break;
			case 'html':
				tableobj.download('html', `${title}.html`, {style:true});
				break;
			case 'xlsx':
				tableobj.download('xlsx', `${title}.xlsx`, {sheetName: `${title}`});
				break;
		}
		$download.value = '';
	}
	
	window.showDetails = function(header, rowIndex) {
		const detailsModal = new window.Modal({
			modalContainerId: 'dataDetailsModal'
			, modalTitleText: `${helper.decamelize(header)} Details`
			, modalContentsInnerHTML: `<pre><xmp>${JSON.stringify(raw[rowIndex][header],null, 2)}</xmp></pre>`
			, modalSubmitBtnText: 'OK'
			, modalSubmitBtnAction: function(){
				detailsModal.destroy();
			}
			, modalCancelBtnAction: function(){
				detailsModal.destroy();
			}
		})

		detailsModal.show();		
	}
	
	window.downloadICS = function(header, rowIndex, event) {
		if(event) event.preventDefault();
		
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(raw[rowIndex][header]));
		element.setAttribute('download', `${raw[rowIndex].title}.ics`);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);	
		return false;
	}
	
	$download.value = '';
	
	$filterField.innerHTML = filters.filter(f => f).join('\n')
	$filterIt.addEventListener('click', filter);
	$filterClear.addEventListener('click', clear);
	$add.addEventListener('click', add);
	$download.addEventListener('change', download);
	
	
}

setTimeout(load, to);