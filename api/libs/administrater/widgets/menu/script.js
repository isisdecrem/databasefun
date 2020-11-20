var menuIcon = document.querySelector('.menuIcon');
var navBackground = document.querySelector('.navBackground');
var navMenuContent = document.querySelector('.navMenuContent');
var $dataUsage = document.getElementById('dataUsage');
var $allowedData = document.getElementById('allowedData');
var $upgradeBtn = document.getElementById('upgradeBtn');
var $dataUsageGraph = document.getElementById('dataUsageGraph');
let $navMenuHeaderTitle = document.querySelector('.navMenuHeader a');

function convertFileSize(fileSize, decimals = 2) {
    if (fileSize === 0) return '0 Bytes';
    if (fileSize === undefined) return '--';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(fileSize) / Math.log(k));

    return parseFloat((fileSize / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getDataUsage(){
	fetch('/registration/getdatausage', {
		method: 'GET'
		, headers : {
			'Content-Type': 'application/json'
			, 'Accept' : 'application/json'
		}
	})
	.then(response => response.json())
	.then(data => {
		$dataUsage.innerText = convertFileSize(data.dataUsage, 2);
		$allowedData.innerText = convertFileSize(data.allowedDataUsage, 2);
		$upgradeBtn.innerHTML = data.upgradeButton;
		let graphSize = parseInt((data.dataUsage/ data.allowedDataUsage) * 100);
		$dataUsageGraph.style.width = (graphSize === 0 ? 1 : graphSize) + '%';
	})
	.catch((error) => {
		document.querySelector('.data-usage-text').innerText = '😱 Something went wrong.';
		console.error('Error: ', error);
	});
}

if(!!menuIcon) menuIcon.addEventListener('click', function(e) {
	navMenuContent.classList.toggle('open');
	navBackground.style.display = 'block';
	document.body.style.overflowY = 'hidden';
	getDataUsage();
});

if(!!navBackground) navBackground.addEventListener('click', function(e) {
	navMenuContent.classList.remove('open');
	navBackground.style.display = 'none';
	document.body.style.overflowY = '';
});

$navMenuHeaderTitle.innerText = location.host;