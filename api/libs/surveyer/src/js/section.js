document.querySelectorAll('main button').forEach($button => {
	$button.addEventListener('click', function() {
		location.href = `/survey/report?survey=${$button.textContent.trim()}&db=${$button.getAttribute('db')}&domain=${$button.getAttribute('domain')}`;	
	});
})