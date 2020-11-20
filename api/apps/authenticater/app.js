const crypto = require('crypto')
	, fs = require('fs')
	, path = require('path')
	, Configs = require('../../../config.js')
;

const iterations = 10000
	, appName = 'authenticate' 
	, configs = Configs()
	;

let cache = {}
	, register, emailer, helper, subscriber
	, overrideFunctions = {}

function initialize() {
	register = require('../register/app.js');
	emailer = require('../emailer/app.js');
	helper = require('../helper/app.js'); 
	try {
		subscriber = require('../subscriber/app.js'); 
	} catch(ex) {
		
	}
}

function getSpace(email, cb) {
	register.findPerson(null, {email}, (err, person) => {
		if(err) return cb(err);

		if(!person || !person.ship) return cb();
		return cb(null, person.ship.name);
	})
}

function sendEmail(domain, email, subscriber, cb) {
	cache.forgotEmailTemplate = cache.forgotEmailTemplate || fs.readFileSync(path.join(__dirname, '../../libs/authenticater/html/forgotemailtemplate.html'), 'utf8'); 

	if(typeof subscriber  === 'function') { 
		cb = subscriber; 
		subscriber = null;
	}
	if(!email || !domain) return cb();
	
	if(subscriber) domain = null; // Need to be able to find people from their email alone when reseting password for www.qoom.io 
	register.generateForgotCode({domain, email}, null, (err, _person) => {
		if(err || !_person) return cb(err || 'No person found');
		person = _person;
		shipname = subscriber 
			? configs.appDomain 
			: person.ship.name 
		
		if(configs.trialer && configs.trialer.isFree) {
			const organizationInfo = JSON.parse(fs.readFileSync(path.join(__dirname, `../../libs/${configs.trialer.dataFolder}/json/organizationinfo.json`), 'utf8'));
			forgotEmailTemplate = fs.readFileSync(path.join(__dirname, `../../libs/${organizationInfo.resetPasswordEmail.template}`), 'utf8');
			const html = helper.bindDataToTemplate(forgotEmailTemplate, {
					name: person.name
					, path: `https://${person.ship.name}/auth/resetpassword/${person.ship.forgot.code}`
					, email: email
					, domain: person.ship.name
					, companyLogo: `${configs.appDomain}/${organizationInfo.logo}`
					, companyFullName: organizationInfo.fullName
					, companyContactEmail: organizationInfo.contactEmail
			});
			emailer.send({
				requestDomain: shipname
				, email: {
					html: html
					, to: [email]
					, from: `"${organizationInfo.fullName}"${organizationInfo.senderEmail}`
					, subject: 'Reset Your Coding Space Password'
				} 
				, 
			}, console.log, cb);
		} else {
			const html = helper.bindDataToTemplate(cache.forgotEmailTemplate, {
					name: person.name
					, path: `https://${person.ship.name}/auth/resetpassword/${person.ship.forgot.code}`
					, email: email
					, domain: person.ship.name
			});
			emailer.send({
				requestDomain: shipname
				, email: {
					html: html
					, to: [email]
					, from: "Qoom <hello@qoom.io>"
					, subject: 'Reset your Qoom Space Password'
				} 
				, 
			}, console.log, cb);
		}
		
	});
}

function authenticatePerson(shipname, password, cb) {

	if(overrideFunctions.authenticatePerson) {
		return overrideFunctions.authenticatePerson(shipname, password, cb);
	}
	if(!shipname) return cb('No shipname provided');
	if(!password) return cb('No password provided');
	if(shipname.includes('@') && subscriber) {
		const email = shipname.toLowerCase();
		subscriber.find({ email }, null, function(err, subscriber) {
			if(err) return cb('Error in getting subscriber from database');
			if(!subscriber || subscriber.email !== email) return cb('Subscriber does not exist');
			if(!subscriber.salt) return cb('Person has no salt')
			crypto.pbkdf2(password, subscriber.salt, 10000, 256, 'sha256', function(err, hash) {
				if(err) return cb('Error hashing password');
				if(subscriber.password !== hash.toString('base64')) return cb('Wrong password');
				cb(null, subscriber);
			});			
		})
	} else {
		register.findPerson(null, {'ship.name': shipname}, function(err, person) {
			if(err) return cb('Error in getting person from database');
			if(!person || !person.ship || person.ship.name !== shipname) return cb('Person does not exist');
			if(!person.ship.salt) return cb('Person has no salt');
			crypto.pbkdf2(password, person.ship.salt, 10000, 256, 'sha256', function(err, hash) {
				if(err) return cb('Error hashing password');
				if(person.ship.passcode !== hash.toString('base64')) return cb('Wrong password');
				cb(null, person);
			});
		});		
	}
}
 
function serializePerson(person, cb){
	if(overrideFunctions.serializePerson) {
		return overrideFunctions.serializePerson(person, cb);
	}
	cb(null, person.id || person._id);
}

function deserializePerson(id, cb){
	if(overrideFunctions.deserializePerson) {
		return overrideFunctions.deserializePerson(id, cb);
	}
	register.findPerson(null, {_id: id}, (err, person) => {
		if(subscriber && (!person || !person.ship)) {
			subscriber.findById({id}, null, (err, subscriber)=> {
				cb(err, subscriber)
			});
			return; 
		}
		cb(err, person);
	});
}

function resetPassword(options, notify, cb) {
	notify = notify || function() {};

	const salt = crypto.randomBytes(128).toString('base64');

	crypto.pbkdf2(options.password, salt, iterations, 256, 'sha256', function(err, hash) {
		if(err) return cb(err);
		hashedPassword = hash.toString('base64');
		register.updatePassword({person: options.person, password: hashedPassword, salt}, notify, (err, person) => {
			if(err) return cb(err);
			cb(null, person);
		});
	});
}

function override(fns) {
	overrideFunctions = fns;
}

module.exports = {
	initialize
	, getSpace
	, sendEmail
	, authenticatePerson
	, serializePerson
	, deserializePerson
	, resetPassword
	, override
}