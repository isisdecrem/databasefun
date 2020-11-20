import Modal from '/libs/modal/script.js';
let $contactSupport = document.getElementById('contactSupport');
let fileToSave;

const $contactSupportModal = new Modal({
	modalContainerId: 'contactSupportModal'
	, modalTitleText: 'How can we help?'
	, modalContentsInnerHTML: `
	<form id='contactSupportForm' action='https://narae.qoom.io/survey/contactsupport' method='POST'  enctype="multipart/form-data">
		<div class="rate">
			<p class="question-text">How would you rate your experience with Qoom?</p>
			<div class="stars-container">
			</div>
			<input id="rateStars" type='hidden' name='stars' value="" required>
		</div>
		<div class="category">
			<p class="question-text">Select a Category *</p>
			<div class="form-input">
				<div class="input-items default">
					<select id="reportCategory" name="category" required>
						<option value="">Select a category to help us find the right solution for you</option>
						<option value="Report a bug">Report a bug</option>
						<option value="Questions">Questions</option>
						<option value="Feature request">Feature request</option>
						<option value="Feedback and ideas">Feedback and ideas</option>
						<option value="Other">Other</option>
					</select>
				</div>
			</div>
		</div>
		<div class="experience">
			<p class="question-text">Tell us about your experience *</p>
			<div class="form-input">
				<div class="input-items default">
					<textarea rows="4" cols="50" placeholder="Tell us more" name="tellusmore" required></textarea>
				</div>
			</div>
		</div>
		<div class="upload-file">
			<div class="upload-file-contents">
				<p class="question-text"><a id="fileUploadButton">Choose files</a></p>
				<p class="additional-text">Add images/videos to help us understand [Maximum file size: 20MB]</p>
			</div>
		</div>
		<div class="files-to-upload">
		
		</div>
		<input id='domain' type='hidden' name='domain' value=''>
		<input id="formSubmitBtn" type="submit" value="submit" style='display:none;'>
	
	</form>
	`
	, modalCancelBtnText: 'Cancel'
	, modalCancelBtnAction: function() {
		$contactSupportModal.destroy();
	}
	, modalSubmitBtnText: 'Submit'
	, modalSubmitBtnAction: sendUsMessage
});

function convertFileSize(fileSize, decimals = 2) {
    if (fileSize === 0) return '0 Bytes';
    if (fileSize === undefined) return '--';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(fileSize) / Math.log(k));

    return parseFloat((fileSize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function drawStarRates(point) {
	var $starsContainer = document.querySelector('.stars-container');
	var count = 5;
	$starsContainer.innerHTML = ``;
	for (var i = 1; i <= count; i++) {
		if(i <= point) {
			$starsContainer.innerHTML += `<i class="ic-star-full yellow" data-rate="${i}"></i>`;
		} else {
			$starsContainer.innerHTML += `<i class="ic-star" data-rate="${i}"></i>`;
		}
	}
	document.querySelectorAll('.stars-container i').forEach(i => {
		i.addEventListener('click', (e) => {
			point = parseInt(e.target.getAttribute('data-rate'));
			drawStarRates(point);
		});
	});
	document.getElementById('rateStars').value = point;
}

function totalFileSize(fileToSave, file) {
	var totalSize = 0;
	fileToSave.forEach(file => totalSize += file.size);
	totalSize += file.size;

	return totalSize;
}

function uploadImage(uploader) {
	if(typeof (FileReader) != 'undefined') {
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp|.mp4|.mov|.avi|.wmv|.ogv|.ogg|.webm)$/;
        var fileList = uploader.files;

		for (var key in fileList) {
			if(typeof(fileList[key]) !== 'object') return;
			
			if(regex.test(fileList[key].name.toLowerCase())) {
				//check if there is the same file already.
				var sameFile = fileToSave.find(file => file.name === fileList[key].name);
				var index = fileToSave.indexOf(sameFile);
				if (index > -1) return alert('The same file exists.');
				
				//limit the files' total size to 20MB
				if ( 2e+7 < totalFileSize(fileToSave, fileList[key])) return alert('Total file size exceeds 20MB.');
				
				//draw file html
				var $container = document.querySelector('.files-to-upload');
				$container.innerHTML += `
				<div class="file" data-id="${fileList[key].name}">
					<i class="ic-attach"></i>
					<span class="file-name">${fileList[key].name}</span>
					<span class="file-size">${convertFileSize(fileList[key].size, 2)}</span>
					<i class="ic-cancel file-remove"></i>
				</div>
				`
				;
				//add file to fileToSave
				fileToSave.push(fileList[key]);
			} else  {
				return alert(fileList[key].name + " is not a valid image/video file.");
			}
		    document.querySelectorAll('.file-remove').forEach(button => {
				button.addEventListener('click', (e) => {
					//remove the file html
					e.target.parentElement.parentElement.removeChild(e.target.parentElement);
					//remove the file from the fieToSave
					var fileToDelete = fileToSave.find(file => file.name === e.target.parentElement.getAttribute('data-id'));
					var index = fileToSave.indexOf(fileToDelete);
					if (index > -1) {
						fileToSave.splice(index, 1);
					}
				});
			});
		}
	} else {
        return alert("This browser does not support HTML5 FileReader.");
    }
}

function openSelectFileDialog(){
	var $fileInput = document.createElement('input');
	$fileInput.id = 'file-input';
	$fileInput.type = 'file';
	$fileInput.multiple = true;
	$fileInput.name = 'files';
	$fileInput.style.display = 'none';
	$fileInput.accept = `image/jpg, image/jpeg, image/gif, image/png
				, video/mp4,  video/quicktime,  video/x-msvideo,  video/x-ms-wmv,  video/ogg, video/webm`;
	document.getElementById('contactSupportForm').appendChild($fileInput);
	$fileInput.click();
	$fileInput.addEventListener('change', function(e) {
		e.preventDefault();
		uploadImage($fileInput);
	});
}

function sendUsMessage() {
	document.getElementById('domain').value = location.origin;
	document.getElementById('formSubmitBtn').click();
	//todo: show spinning;
	document.querySelector('#contactSupportModal .container').innerHTML = '<div class="loader" style=""><div></div></div>';
}

$contactSupport.addEventListener('click', function(){
	document.querySelector('.button-help-submenus').style.display = 'none';
	document.querySelector('.button-help-submenus-background').style.display = 'none';
	$contactSupportModal.show();
	fileToSave = [];
	drawStarRates(5);
	document.getElementById('fileUploadButton').addEventListener('click', openSelectFileDialog);
	
});