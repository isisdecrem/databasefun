const projects = {{PROJECTS}}
	, schedule = {{SECTIONDATA}}.reduce((a, r) => {
		const o = Object.keys(r).reduce((o, k) => {
			if(k.endsWith('Date')) {
				o[`${k}Time`] = convertToLocalTime(r[k]);
			}
			o[k] = r[k];
			return o;
		}, {
			submission: projects.find(p => p.tags.includes(r.projectTag))
		})
		a.push(o);
		return a;
	}, [])
	, $container = document.querySelector('#challenges')
	, now = new Date()
	, createCard = (c => `
		<div class='card'>
			<h4>${c.title}</h4>
			${makeSubmissionElement(c.submission)}
			<div>
				<div>
					<span>Workshop</span>
					<span>${displayTime(c.workshopDate)}</span>
				</div>
				<div>${getRegistrationButton(c.workshopDateTime, c.registrationLink, 'Register', c.startDateTime)}</div>
				<div>
					<span>Live Q&A</span>
					<span>${displayTime(c.qAndADate)}</span>
				</div>
				<div>${getRegistrationButton(c.qAndADateTime, c.qAndARegistrationLink, 'Register', c.startDateTime)}</div>
				<div>
					<span>Challenge Submission</span>
					<span>${displayTime(c.submissionDeadlineDate)}</span>
				</div>
				<div>${getRegistrationButton(c.submissionDeadlineDateTime,  c.submission ?  '' : '/qotw/submit/' + c.projectTag, c.submission ?  'Submitted' : 'Submit', c.startDateTime)}</div>
			</div>
		</div>
	`)
	, currentEvents = schedule.filter(s => s.endDateTime >= now )
	, $currentEvents = document.createElement('div')
	, currentEventsHTML = currentEvents.map(c => createCard(c)).join('\n')
	, pastEvents = schedule.filter(s => s.endDateTime < now )
	, $pastEvents = document.createElement('div')
	, pastEventsHTML =  pastEvents.map(c => createCard(c)).join('\n')
	, $pastTitle = document.createElement('h3')
	, pastTitleHTML = 'PAST EVENTS'
;

function makeSubmissionElement(submission) {
	if(!submission) return '';
	const time = new Date(submission.dateCreated)
		, link = `/${submission.folder}/${submission.link}`
	;
	return `<aside>
		Your <a href='${link}'>project</a> was submitted on ${time.toLocaleString()}
	</aside>`
}

function displayTime(d) {
	const parts = d.split(',').map(r => parseInt(r.trim()))
		, month = parts[1]
		, day = parts[2]
		, hrpt24 = parts[3]
		, hrpt = hrpt24 > 12 ? hrpt24 - 12 : hrpt24
		, hret24 = hrpt24 + 3 > 23 ? hrpt24 + 3 - 24 : hrpt24 + 3
		, hret = hret24 > 12 ? hret24 - 12 : hret24
		, min = parts[4]
		, todpt = hrpt24 > 11 ? 'PM' : 'AM'
		, todet = hret24 > 11 ? 'PM' : 'AM'
		, showmin = min > 0 ? `:${min}` : ''
	;
		
	return `${month}/${day} ${hrpt}${showmin}${todpt} PT, ${hret}${showmin}${todet} ET`;
}

function getRegistrationButton(d, link, text, sd) {
	const now = new Date()
		, disabled = now > d || !link || ( now < sd && text.startsWith('Submit'))
		, displayText = disabled 
			? (link && now > sd) 
				? 'Closed' 
				: text === 'Submitted' 
					? 'Submitted' 
					: 'Not Open'
			: text
		, disabledAttribute = disabled ? 'disabled' : ''
	;
	return `<a href='${link}'><button ${disabledAttribute}>${displayText}</button></a>`
}

function convertToLocalTime(d) {
	const parts = d.split(',').map(r => parseInt(r.trim()))
		, timeZone = 'America/Los_Angeles'
		, date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0, parts[5] || 0))
		, utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
		, tzDate = new Date(date.toLocaleString('en-US', { timeZone }))
		, offset = utcDate.getTime() - tzDate.getTime()
	;
		
	date.setTime( date.getTime() + offset );
	return date;
}

$currentEvents.innerHTML = currentEventsHTML;
$pastTitle.innerHTML = pastTitleHTML;
$pastEvents.innerHTML = pastEventsHTML;

$container.appendChild($currentEvents);
$container.appendChild($pastTitle);
$container.appendChild($pastEvents);