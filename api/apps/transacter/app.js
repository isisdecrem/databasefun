const
	async = require('async')
	, fs = require('fs')
	, request = require('request')
	, path = require('path')
	, Stripe = require('stripe')
	, Configs = require('../../../config.js')
;

const appName = 'transact'
	, configs = Configs()
	, stripeConfig = configs.transacter && configs.transacter.stripe
;

let cache = {for: {}, products: {}},
	register, helper, saver, logger, registerSchemas
;

function initialize() {
	register = require('../register/app.js');
	helper = require('../helper/app.js');
	saver = require('../saver/app.js');
	logger = require('../logger/app.js');
	registerSchemas = require('../register/schemas.js');
}

function getPaymentDetails(method, amt, p) {
	if(method === 'creditcard' && p)
		return `Received ${amt.toFixed(2)} paid with credit card: (${p.brand} ${p.last4}).`;
	if(method === 'check') 
		return `Received ${amt.toFixed(2)} paid with check`;
	if(method === 'cash') 
		return `Received ${amt.toFixed(2)} paid with cash`;
	if(method)
		return `Received ${amt.toFixed(2)} paid with ${method}`;
	return '';
}

function charge(options, notify, cb) {
	try {
		options = options || {};
		notify = notify || logger.notify;
		cb = cb || function() {};
		notify(null, 'Initializing Purchase', {});
		
		const { amount, token, metadata, description, email } = options;
		if(!amount) return cb('No amount provided');
		if(!token) return cb('No token provided');
		if(!email) return cb('No email provided');
		if(!stripeConfig) return cb('No stripe configuration');

		const stripe = Stripe(stripeConfig.token)
			, chargeOptions = {
				amount: parseInt(amount*100),
				metadata: metadata,
				receipt_email: email,
				currency: 'usd',
				source: token,
				description: description || 'Charge from Qoom'
			}
		;
		
		stripe.charges.create(chargeOptions, function(err, data) {
			if(err) return cb(err);
			cb(null, data);		
		})
	} catch(ex) {
		cb(ex);
	}
}

function process(options, notify, cb) {
	notify = notify || logger.notify;

	notify(null, 'Initializing Transaction Process', {transactApp: options.transactApp, payment: options.payment})
	if(!options.transactApp) {
		notify('No Transaction App was given', 'No Transaction App was given', {});
		return cb('No Transaction App was given');
	}

	var transactApp = require(`../${options.transactApp}/app.js`);
	if(!transactApp.getCost) {
		notify(null, 'Cannot get cost', {transactApp: transactApp});
		return cb(null);
	}

	transactApp.getCost(options, notify, function(err, cost) {
		if(err) {
			notify(err, 'Error in getCost', {transactApp: transactApp});
			return cb(err);
		}
		let transactOptions = JSON.parse(JSON.stringify(options));
		transactOptions.price = cost;

		if(options.payment !== 'creditcard') {
			options.addToResults(transactOptions);
			return cb();		
		}
		if(!stripeConfig) return cb('No stripe configuration');
		const stripe = Stripe(stripeConfig.token); 
		stripe.transact(transactOptions, function(err, data) {
			if(err) {
				notify(err, 'Transaction Error', {transactApp: options.transactApp, payment: options.payment});
				return cb(err);
			}
			options.addToResults(Object.assign({stripe: data}, transactOptions));

			notify(null, 'Processed Transaction', {transactApp: options.transactApp, payment: options.payment});
			cb(null);		
		});
	});
}

function purchase(options, notify, cb) {
	try {
		options = options || {};
		notify = notify || logger.notify;
		cb = cb || function() {};
		notify(null, 'Initializing Purchase', {});
		
		const { amount, customer, domainToPurchase, entity, description, cardId, domainCouponId, subscriberId } = options;
		if(!amount) return cb('No amount provided');
		if(!customer) return cb('No customer id provided');
		if(!cardId) return cb('No card id provided');
		if(!domainToPurchase) return cb('No domainToPurchase to purchase provided');
		if(!entity) return cb('No entity to purchase provided');
		if(!description) return cb('No description provided');
		if(!stripeConfig) return cb('No stripe configuration');
		if(!subscriberId) return cb('No subscriber id provided');
		
		const stripe = Stripe(stripeConfig.token); 
		let coupon;
		let couponName = '';
		let discountingAmount = 0;
		let extraDescription = '';
		let totalDue = parseInt(amount * 100);
		
		function checkDiscount(next){
			if(!domainCouponId) return next();
			if(domainCouponId) {
				stripe.coupons.retrieve(`${domainCouponId}`, (err, resp) => {
					coupon = resp;
					couponName = coupon.name
					if (coupon.amount_off) {
						discountingAmount = coupon.amount_off / 100;
						if (amount < discountingAmount) {
							discountingAmount = amount;
						} else {
							discountingAmount = discountingAmount;
						}
					} else {
						discountingAmount = amount * coupon.percent_off / 100;
					}
					extraDescription = `with coupon: ${couponName}`;
					totalDue = parseInt((amount - discountingAmount) * 100);
					next();
				});
			}
		}
		
		function updateCoupon(next) {
			if(!domainCouponId) return next();
			let metadata = coupon.metadata;
			let nameWithRandomString = `${coupon.name}(${helper.generateRandomString()})`;
			
			metadata.times_redeemed = metadata.times_redeemed ? String(parseInt(metadata.times_redeemed) + 1) : String(1);
			metadata.active_redemptions += `${metadata.active_redemptions ? ',' : ''} ${subscriberId}(${domainToPurchase})`;
			
			//update coupon's name when it's redeemed as many as 
			nameWithRandomString = (metadata.maximum_redemptions && metadata.times_redeemed >= metadata.maximum_redemptions) ? nameWithRandomString : couponName;
		
			stripe.coupons.update(
				`${domainCouponId}`,
				{
					name: nameWithRandomString, 
					metadata: metadata
				},
				(err, coupon) => {
					next();
				}
			);
		}
		
		function makeCharge(next){
			const chargeOptions = {
				amount: totalDue
				, currency: 'usd'
				, customer
				, source: cardId
				, metadata: {entity, domainToPurchase, couponName}
				, description: helper.bindDataToTemplate(description, {domainToPurchase, extraDescription})
			};
			if(totalDue === 0) return cb();
			stripe.charges.create(chargeOptions, function(err, charge) {
				if(err) {
					notify(err, 'Transaction Error', {});
					return cb(err);
				}
				notify(null, 'Processed Transaction', {});
				cb(null, Object.assign(charge, {entity, domainToPurchase}));	
			})
		}
		
		async.waterfall([
			checkDiscount
			, updateCoupon
			, makeCharge
		], (err) => {
			if(err) return cb(err);
			//cb();
		})
		
	} catch(ex) {
		cb(ex);
	}
}

function getCharges(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { customerId } = options;
	if(!customerId) return cb('No plan provided');
	if(!stripeConfig) return cb('No stripe configuration');
	
	const stripe = Stripe(stripeConfig.token);
	stripe.charges.list(
		{customer: customerId}, cb
	);
}

function transact(options, notify, cb) {
	notify = notify || logger.notify;
	let { person, products, productFor, forId
		, method, token, service, app
		, transactionService, taxes
		, shipping, fees, currency, requestDomain
		, creditCardDescription, receiptTemplate, receiptContents
		, receiptProduct, receiptFor, receiptPurchaser } = options;
	let transactionsToMake, allTransactions, previousTransactions, transactionOutput, transactionData, total;
	notify(null, `Initializing Transaction`, person);


	function checkInput(next) {
		let errors = [];
		if(!person) errors.push('No Person Provided');
		if(!products || !products.length) errors.push('No Products Provided');
		if(!productFor) errors.push('No For Provided');
		if(!forId) errors.push('No For Id Provided');
		if(!method) errors.push('No Method Provided');
		if(!transactionService) errors.push('No Transaction Service Provided');
		if(!receiptTemplate) errors.push('No Receipt Template Provided');
		if(!creditCardDescription) errors.push('No Credit Card Description Provided')
		currency = currency || 'usd';

		transactionsToMake = products.map(product => {
			const productId = options[`${product.name}Id`]
				, productAmount = options[`${product.name}Amount`]
				, productQuantity = options[`${product.name}Quatity`] || 1
			;

			if(!product.name){
				 errors.push(`No Product Name Provided`) 
			} else {
				if(!productId) errors.push(`No Product Id for ${product.name} Provided`)
				if([undefined, null, ''].includes(productAmount) || isNaN(productAmount)) errors.push(`No Product Amount for ${product.name} Provided`)
				if(!product.model) errors.push(`No Product Model for ${product.name} Provided`)
				if(!product.dbName) errors.push(`No Product DB Name for ${product.name} Provided`)
				if(!product.schemaName) errors.push(`No Product Schema Name for ${product.name} Provided`)
				if(!product.service) errors.push(`No Product Service for ${product.name} Provided`)
				if(!product.app) errors.push(`No Product App for ${product.name} Provided`)
			}
			return {
				id: productId
				, model: product.model
				, dbName: product.dbName
				, schemaName: product.schemaName
				, allowMultiple: product.allowMultiple || false
				, service: product.service
				, app: product.app
				, amount: productAmount
				, quantity: productQuantity
			}
		})

		if(errors.length) return next(errors.join(', '));
		if(!transactionsToMake) return next('Could Not Find Any Transactions to Make')
		next();
	}

	function getPersonsTransactions(next) {
		register.findPeople({
			filter: {_id: person}
		}, notify, (err, people) => {
			if(err) return next(err);
			if(!people || !people.length) return next('No Person Found');
			allTransactions = people[0].transactions || [];
			next();
		})
	}

	function haveAnyTransactionsHappened(next) {
		if(!allTransactions.length) return next();
		previousTransactions = allTransactions.filter(t => {
			if(!t.products) return false;

			if(t.for && t.for.id.toString() !== forId.toString()) return false;
			if(t.refunded) return false;
			return t.products.some(tp => {
				if(tp.allowMultiple) return false;

				const product = transactionsToMake.find(p => p.id.toString() === tp.id.toString())
				return !!product;
			})
		})
		if(previousTransactions) {
			notify(null, `Person Already Has Purchased ${previousTransactions.length} Products`, {});
		}
		transactionsToMake = transactionsToMake.filter(p => 
				!previousTransactions.find(prev => 
					prev.products.some(pp => pp.id.toString() === p.id.toString())
				)
			);
		next();

	}

	function getReceiptTemplate(next) {
		var saverOptions = {
			file: receiptTemplate
			, domain: requestDomain
			, encoding: 'utf8'
		};
		saver.load(saverOptions, (err, fileContents) => {
			receiptContents = fileContents
			next(null)
		});
	}

	function purchaseProducts(next) {
		if(!transactionsToMake.length) {
			transactionData = null;
			notify(null, 'All Products Have Been Purchased', {});
			return next();
		}
		notify(null, 'Initializing Transaction', {});
		const service = require(`../../libs/transacter/${transactionService}/app.js`);

		total = 0;
		total += (taxes || []).reduce((amt, tax) => amt += tax.amount, 0);
		total += (shipping && shipping.amount) || 0;
		total += (fees || []).reduce((amt, fee) => amt += fee.amount, 0);
		total += transactionsToMake.reduce((amt, p) => amt += p.quantity*p.amount, 0);

		if(method !== 'creditcard') return next();

		const transactOptions = {
			metadata: {}
			, amount: total
			, currency
			, description: creditCardDescription
			, token
		}

		service.transact(transactOptions, notify, function(err, output) {
			if(err) {
				notify(err, 'Transaction Error', {});
				return next(err);
			}
			if(!output) {
				notify(null, 'No Transaction Processed', {});
				return next(null)
			}
			transactionOutput = output;
			notify(null, 'Transaction Processed', {});
			next(null);		
		})
	}

	function createTransaction(next) {
		if(!transactionsToMake.length) {
			transactionData = {};
			return next();
		}
		notify(null, 'Creating Transaction Data', {});
		let productData;
		try {
			productData = JSON.parse(JSON.stringify(receiptProduct));
		} catch(ex) {

		}
		const transactionId = helper.generateId();

		transactionData = {
			products: transactionsToMake
			, for: Object.assign({id: forId}, productFor)
			, service: service
			, method: method
			, date: new Date()
			, total: total
			, notes: ''
			, app: app
			, refunded: false
			, data: transactionOutput
			, transactionId: transactionId
			, receipt: method === 'creditcard' ? helper.bindDataToTemplate(receiptContents, {
					date: (new Date()).toDateString()
					, paymentdetails: getPaymentDetails(method, total, transactionOutput)
					, forperson:  {
						name: receiptFor.name
						, email: receiptFor.email
					}
					, purchaser: {
						name: receiptPurchaser.name
						, email: receiptPurchaser.email
						, phone: receiptPurchaser.phone || ' '
					}
					, RECEIPTNUMBER: transactionId
					, product: productData
					, ein: options.ein
				}, true) : undefined
		}
		next();
	}

	function done(err) {
		if(err) {
			return cb(err);
		}
		cb(null, transactionData);
	}

	async.waterfall([
		checkInput
		, getPersonsTransactions
		, haveAnyTransactionsHappened
		, getReceiptTemplate
		, purchaseProducts
		, createTransaction
	], done);
}

function transactMultiple(options, notify, cb) {
	options = options || {};
	cb = cb || function() {};
	notify = notify || logger.notify;

	let { productModels, fors
		, method, token, forModel
		, transactionService, taxes
		, shipping, fees, currency, ein
		, creditCardDescription
		, purchaserModel
		, requestDomain
		, receiptTemplate
		, transactingApp, customer
		, productsToPurchase, purchaser, extendedCareNum, extendedCareCheck, couponAmount} = options;
		
	let productIds, forIds, receiptContents, transactionsToMake, allTransactions, previousTransactions, transactionOutput, transactionData, total, app;
	
	const schemas = require(`../${purchaserModel.app}/schemas.js`);
	notify(null, `Initializing Transaction`, {});


	function checkInput(next) {
		let errors = [];
		requestDomain = requestDomain || configs.appDomain;
		if(!requestDomain) errors.push('No request domain provided')
		if(!purchaser) errors.push('No Purchaser provided');
		if(!purchaserModel) errors.push('No Purchaser Model provided');
		if(!productModels || !productModels.length) errors.push('No Product Models provided');
		if(!fors) errors.push('No Fors');
		if(!method) errors.push('No Method provided');
		if(!transactionService) errors.push('No Transaction Service provided');
		if(!creditCardDescription) errors.push('No Credit Card Description provided')
		if(!receiptTemplate) errors.push('No receipt template found');
		if(!forModel) errors.push('No forModel provided');
		currency = currency || 'usd';
		productIds = productsToPurchase.map(p => p._id);
		transactionsToMake = [];
		extendedCareNum = Math.abs(isNaN(parseInt(extendedCareNum)) ? 0 : parseInt(extendedCareNum));
		couponAmount = couponAmount || 0;
		
		productModels.forEach(model => {
			fors.forEach(forPerson => {
				productsToPurchase.forEach(p => {
					app = model.app;
					transactionsToMake.push({
						id: p._id
						, forId: forPerson._id
						, model: model.model
						, dbName: model.dbName
						, schemaName: model.schemaName
						, allowMultiple: model.allowMultiple || false
						, service: model.service
						, app: model.app
						, amount: p.cost
						, quantity: 1
						, extendcareCost: 0 //p.extendedCare.evening.cost
					})
					
				})
			})
		})
		if(errors.length) return next(errors.join(', '));
		if(!transactionsToMake) return next('Could Not Find Any Transactions to Make')
		next();
	}

	function getPurchasersTransactions(next) {
		
		saver.schemaFind({
			schemaName: purchaserModel.schemaName
			, collectionName: purchaserModel.collectionName
			, schema: schemas.parent
			, dbUri: schemas.dbUri
			, filter: { _id: purchaser._id }
			, requireFilter: true
		}, notify, function(err, resp) {
			if(err) return next(err);
			if(!resp || !resp.length) return next('No purchaser found');
			purchaser = resp[0];
			allTransactions = purchaser.transactions;
			next();
		});
	}

	function haveAnyTransactionsHappened(next) {
		if(!allTransactions.length) return next();
		forIds = fors.map(f => f._id.toString());
		previousTransactions = allTransactions.filter(t => {
			if(!t.products) return false;

			if(t.for && !forIds.includes(t.for.id.toString())) return false;
			if(t.refunded) return false;
			return t.products.some(tp => {
				if(tp.allowMultiple) return false;

				const product = transactionsToMake.find(p => p.id.toString() === tp.id.toString())
				return !!product;
			})
		})
		if(previousTransactions) {
			notify(null, `Person Already Has Purchased ${previousTransactions.length} Products`, {});
		}
		transactionsToMake = transactionsToMake.filter(p => 
				!previousTransactions.find(prev => 
					prev.products.some(pp => pp.id.toString() === p.id.toString())
				)
			);
		next();

	}

	function getReceiptTemplate(next) {
		var saverOptions = {
			file: receiptTemplate
			, domain: requestDomain
			, encoding: 'utf8'
		};
		saver.load(saverOptions, (err, fileContents) => {
			if(err) return next(err);
			if(!fileContents) return next('No contents found for that receipt template');
			receiptContents = fileContents
			next(null)
		});
	}

	function purchaseProducts(next) {
		if(!transactionsToMake.length) {
			transactionData = null;
			notify(null, 'All Products Have Been Purchased', {});
			return next();
		}
		notify(null, 'Initializing Transactions', {});
		const service = require(`../../libs/transacter/${transactionService}/app.js`);
		
		total = 0;
		total += (taxes || []).reduce((amt, tax) => amt += tax.amount, 0);
		total += (shipping && shipping.amount) || 0;
		total += (fees || []).reduce((amt, fee) => amt += fee.amount, 0);
		total += transactionsToMake.reduce((amt, p) => amt += (p.quantity*p.amount+extendedCareNum*p.extendcareCost)-couponAmount, 0);
		
		if(method !== 'creditcard') return next();

		
		
		if(customer && customer.id) {
			const chargeOptions = {
				amount: total*100
				, currency: 'usd'
				, customer: customer.id
				, source: token.card.id
				, metadata: {
					items: fors.map(f => 
						`${customer.name}, ${f.name}: ${productsToPurchase.map(p => p.name).join(', ')}`
					).join('\n')
				}
				, description: creditCardDescription
				, transactingApp
			}
			return service.charge(chargeOptions, notify, (err, output) => {
				if(err) return next(err);
				transactionOutput = output;
				notify(null, 'Transaction Processed', {});
				next();
			})
		}
		
		const transactOptions = {
			metadata: {}
			, amount: total
			, currency
			, description: creditCardDescription
			, token
			, transactingApp
		}

		service.transact(transactOptions, notify, function(err, output) {
			if(err) {
				notify(err, 'Transaction Error', {});
				return next(err);
			}
			if(!output) {
				notify(null, 'No Transaction Processed', {});
				return next(null)
			}
			transactionOutput = output;
			notify(null, 'Transaction Processed', {});

			next(null);		
		})
	}

	function createTransaction(next) {
		if(!transactionsToMake.length) {
			transactionData = {};
			return next();
		}
		notify(null, 'Creating Transaction Data', {});
		try {
			let productData = JSON.parse(JSON.stringify(productsToPurchase));
			
			const transactionId = helper.generateId();
			transactionData = {
				products: transactionsToMake
				, fors: fors.map(f => f._id)
				, forModel
				, service: transactionService
				, method: method
				, date: new Date()
				, total: total
				, notes: ''
				, app: app
				, refunded: false
				, data: transactionOutput
				, transactionId: transactionId
				, receipt: method === 'creditcard' ? helper.bindDataToTemplate(receiptContents, {
						date: (new Date()).toDateString()
						, paymentdetails: getPaymentDetails(method, total, transactionOutput)
						, forpersons:  fors.map(f => f.name).toString()
						, purchaserName:  purchaser.name
						, email: purchaser.email
						, receiptNumber: transactionId
						, products: productData
						, ein: ein
						, extendedcondition: extendedCareNum
						, couponamount: couponAmount
					}, true) : undefined
			} 

		} catch(ex) {
			console.log({ex})
		}
		next(); 
	}
	
	function saveTransaction(next) {
		saver.schemaUpdate({
			schemaName: purchaserModel.schemaName
			, collectionName: purchaserModel.collectionName
			, schema: schemas.parent
			, _id: purchaser._id
			, modelData: { $push: { transactions: transactionData } }
			, dbUri: schemas.dbUri
			, backup: false
		}, notify, function(err) {
			if(err) return next(err);
			next();
		});
	}

	function done(err) {
		if(err) return cb(err);
		cb(null, transactionData);
	}

	async.waterfall([
		checkInput
		, getPurchasersTransactions
		, haveAnyTransactionsHappened
		, getReceiptTemplate
		, purchaseProducts
		, createTransaction
		, saveTransaction
	], done);
}

function subscribe(options, notify, cb) {
	notify = notify || logger.notify;
	let { person, products, productFor, forId
		, method, token, service, app
		, transactionService, taxes
		, shipping, fees, currency
		, creditCardDescription, receiptTemplate
		, receiptProduct, receiptFor, receiptPurchaser } = options;
	let transactionsToMake, allTransactions, previousTransactions, transactionOutput, transactionData, total;
	notify(null, `Initializing Transaction`, person);


	function checkInput(next) {
		let errors = [];
		if(!person) errors.push('No Person Provided');
		if(!products || !products.length) errors.push('No Products Provided');
		if(!productFor) errors.push('No For Provided');
		if(!forId) errors.push('No For Id Provided');
		if(!method) errors.push('No Method Provided');
		if(!transactionService) errors.push('No Transaction Service Provided');
		if(!receiptTemplate) errors.push('No Receipt Template Provided');
		if(!creditCardDescription) errors.push('No Credit Card Description Provided')
		currency = currency || 'usd';

		transactionsToMake = products.map(product => {
			const productId = options[`${product.name}Id`]
				, productAmount = options[`${product.name}Amount`]
				, productQuantity = options[`${product.name}Quatity`] || 1
			;

			if(!product.name){
				 errors.push(`No Product Name Provided`) 
			} else {
				if(!productId) errors.push(`No Product Id for ${product.name} Provided`)
				if([undefined, null, ''].includes(productAmount) || isNaN(productAmount)) errors.push(`No Product Amount for ${product.name} Provided`)
				if(!product.model) errors.push(`No Product Model for ${product.name} Provided`)
				if(!product.dbName) errors.push(`No Product DB Name for ${product.name} Provided`)
				if(!product.schemaName) errors.push(`No Product Schema Name for ${product.name} Provided`)
				if(!product.service) errors.push(`No Product Service for ${product.name} Provided`)
				if(!product.app) errors.push(`No Product App for ${product.name} Provided`)
			}
			return {
				id: productId
				, model: product.model
				, dbName: product.dbName
				, schemaName: product.schemaName
				, allowMultiple: product.allowMultiple || false
				, service: product.service
				, app: product.app
				, amount: productAmount
				, quantity: productQuantity
			}
		})

		if(errors.length) return next(errors.join(', '));
		if(!transactionsToMake) return next('Could Not Find Any Transactions to Make')
		next();
	}

	function getPersonsTransactions(next) {
		register.findPeople({
			filter: {_id: person}
		}, notify, (err, people) => {
			if(err) return next(err);
			if(!people || !people.length) return next('No Person Found');
			allTransactions = people[0].transactions || [];
			next();
		})
	}

	function haveAnyTransactionsHappened(next) {
		if(!allTransactions.length) return next();
		previousTransactions = allTransactions.filter(t => {
			if(!t.products) return false;

			if(t.for && t.for.id.toString() !== forId.toString()) return false;
			if(t.refunded) return false;
			return t.products.some(tp => {
				if(tp.allowMultiple) return false;

				const product = transactionsToMake.find(p => p.id.toString() === tp.id.toString())
				return !!product;
			})
		})
		if(previousTransactions) {
			notify(null, `Person Already Has Purchased ${previousTransactions.length} Products`, {});
		}
		transactionsToMake = transactionsToMake.filter(p => 
				!previousTransactions.find(prev => 
					prev.products.some(pp => pp.id.toString() === p.id.toString())
				)
			);
		next();
	}

	function getReceiptTemplate(next) {
		if(cache[receiptTemplate]) return next(null);
		request.get(receiptTemplate, (err, resp) => {
			if(err) return next(err);
			cache[receiptTemplate] = resp.body;
			next();
		})
	}

	function purchaseProducts(next) {
		if(!transactionsToMake.length) {
			transactionData = null;
			notify(null, 'All Products Have Been Purchased', {});
			return next();
		}
		notify(null, 'Initializing Transaction', {});
		const service = require(`./${transactionService}/app.js`);

		total = 0;
		total += (taxes || []).reduce((amt, tax) => amt += tax.amount, 0);
		total += (shipping && shipping.amount) || 0;
		total += (fees || []).reduce((amt, fee) => amt += fee.amount, 0);
		total += transactionsToMake.reduce((amt, p) => amt += p.quantity*p.amount, 0);

		if(method !== 'creditcard') return next();

		const transactOptions = {
			metadata: {}
			, amount: total
			, currency
			, description: creditCardDescription
			, token
		}

		service.transact(transactOptions, notify, function(err, output) {
			if(err) {
				notify(err, 'Transaction Error', {});
				return next(err);
			}
			if(!output) {
				notify(null, 'No Transaction Processed', {});
				return next(null)
			}
			transactionOutput = output;
			notify(null, 'Transaction Processed', {});
			next(null);		
		})
	}

	function getPaymentDetails(method, amt, p) {
		if(method === 'creditcard')
			return `Received ${amt.toFixed(2)} paid with credit card: (${p.brand} ${p.last4}).`;
		return '';
	}

	function createTransaction(next) {
		if(!transactionsToMake.length) {
			transactionData = {};
			return next();
		}
		notify(null, 'Creating Transaction Data', {});
		let productData;
		try {
			productData = JSON.parse(JSON.stringify(receiptProduct));
		} catch(ex) {

		}
		transactionData = {
			products: transactionsToMake
			, for: Object.assign({id: forId}, productFor)
			, service: service
			, method: method
			, date: new Date()
			, amount: total
			, notes: ''
			, app: app
			, refunded: false
			, data: transactionOutput
			, transactionId: helper.generateId()
			, receipt: method === 'creditcard' ? helper.bindDataToTemplate(cache[receiptTemplate], {
					date: (new Date()).toDateString()
					, paymentdetails: getPaymentDetails(method, total, transactionOutput)
					, forperson:  {
						name: receiptFor.name
						, email: receiptFor.email
					}
					, purchaser: {
						name: receiptPurchaser.name
						, email: receiptPurchaser.email
						, phone: receiptPurchaser.phone || ' '
					}
					, product: productData
					, ein: options.ein
				}, true) : undefined
		}
		next();
	}

	function done(err) {
		if(err) {
			return cb(err);
		}
		cb(null, transactionData);
	}

	async.waterfall([
		checkInput
		, getPersonsTransactions
		, haveAnyTransactionsHappened
		, getReceiptTemplate
		, purchaseProducts
		, createTransaction
	], done);
}

function doServiceAction(options, notify, cb) {
	notify = notify || function() {};
	const { service, method } = options;

	let serviceApp, serviceOutput;

	function checkInput(next) {
		if(!service) return next('No service provided');
		if(!method) return next('No method provided');
		try {
			serviceApp = require(`./${service}/app.js`);
		} catch(ex) {
			return next(ex);
		}
		if(!serviceApp[method]) next(`${service} does not have method ${method}`);
		next();
	}

	function doAction(next) {
		const serviceOptions = JSON.parse(JSON.stringify(options));
		delete serviceOptions.service;
		delete serviceOptions.method;
		serviceApp[method](serviceOptions, notify, (err, resp) => {
			if(err) return next(err);
			if(!resp) return next('No response from service action');
			serviceOutput = resp;
			next();
		});
	}

	async.waterfall([
		checkInput
		, doAction
	], (err) => {
		if(err) return cb(err);
		cb(null, serviceOutput);
	})
}

function save(options, notify, cb) {
	notify = notify || function() {};
	let {person, transaction} = options;
	let transactionSaved = JSON.stringify(transaction) === '{}';

	function checkInput(next) {
		if(!person || !person._id) return next('No person provided');
		person = JSON.parse(JSON.stringify(person))
		next();
	}

	function saveTransaction(next) {
		if(transactionSaved) {
			notify(null, {message: 'No Transaction to Save'});
			return next();
		}
		const pushOptions = {
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: registerSchemas.person
			, query: {_id: person._id }
			, newItem: {
				transactions: transaction
			}
			, dbUri: registerSchemas.dbAddress
			, new: false
			, upsert: false
			, multi: false
		}
		saver.schemaPush(pushOptions, notify, (err, resp) => {
			if(err) {
				notify(err, 'Error in Saving Transaction', {});
				return next(err);
			}
			notify(null, 'Successfully Saved Transaction', {});
			next(null)
		})
	}

	async.waterfall([
		checkInput
		, saveTransaction
	], (err) => {
		if(err) return cb(err);
		if(!transactionSaved) {
			person.transactions  = !!person.transactions ? person.transactions : [];
			person.transactions.push(transaction);
		}
		cb(null, person)
	});	
}

function update(options, notify, cb) {
	notify = notify || function() {};
	const { method, date, remainingBalance, refunded, 
			amount, forPerson, product, person, updateReceipt,
			ein, receiptTemplate, source } = options;
	if(!method) return cb('No method provided');
	if(!date) return cb('No date provided');
	if(!forPerson) return cb('No forPerson provided');
	if(!product) return cb('No product provided');
	if(!person) return cb('No person provided');
	if(updateReceipt && !receiptTemplate) return cb('No receipt template');
	if(updateReceipt && !ein) return cb('No ein provided');
	if(updateReceipt && !amount) return cb('No amount provided');
	if(updateReceipt && !product) return cb('No product provided');

	const transaction = person.transactions.find(t => 
		t.products.some(p => p.id.toString() === product._id.toString())
			&& t.for.id.toString() === forPerson._id.toString()
		)
	;
	if(!transaction) return cb('No transaction found');
	if(refunded) transaction.refunded = true;
	if(remainingBalance || remainingBalance === 0) transaction.remainingBalance = remainingBalance;
	if(amount) transaction.total = amount;
	transaction.date = date;
	transaction.method = method;

	function getReceiptTemplate(next) {
		if(cache[receiptTemplate]) return next(null);
		request.get(receiptTemplate, (err, resp) => {
			if(err) return next(err);
			cache[receiptTemplate] = resp.body;
			next();
		})
	}

	async.waterfall([
		getReceiptTemplate
	], (err) => {
		if(err) return cb(err);

		if(updateReceipt) {
			if(source) transaction.source = source;
			transaction.receipt = helper.bindDataToTemplate(cache[receiptTemplate], {
				date: (transaction.date).toDateString()
				, paymentdetails: getPaymentDetails(method, amount, source)
				, forperson:  {
					name: forPerson.name
					, email: forPerson.email
				}
				, purchaser: {
					name: person.name
					, email: person.email
					, phone: person.phone || ' '
				}
				, product: JSON.parse(JSON.stringify(product))
				, ein: ein
			}, true)
		}

		const modifyOptions = {
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: registerSchemas.person
			, query: {_id: person._id }
			, dataToModify: { 
				transactions: person.transactions
			}
			, dbUri: registerSchemas.dbAddress
		}

		saver.schemaModify(modifyOptions, notify, (err) => {
			if(err) return cb(err);
			cb(null, transaction);
		});
	});
}

function getDashboardWidgetUrl() {
	return `/${appName}/widget`;
}

function getTransactionsWidget(transactions, data) {

	const dataLoader = function(cb) {
		let dataToBind = Object.assign({
				id: 'transactions',
				items: transactions.map(t => {
					return {
						date: t.date
						, name: t.products[0].id
						, for: t.for.id
						, amount: t.total || 'Not Paid'
						, method: t.method
						, receipt: t.receipt 
							? `<a href='/transact/receipt/${t.transactionId}'>Receipt Link</a>` 
							: ''
						, notes: t.notes
					}
				})
			}, data || {});

		function getFor(next) {
			const forToGet = dataToBind.items.map(i => i.for);
			const cachedFor = Object.keys(cache.for);
			const missingFor = forToGet.map(k => !cachedFor.includes(k));
			// CANNOT DO IT THIS WAY DIFFERENT DATABASES OR MODELS
			next();
		}

		function getProducts(next) {
			const productsToGet = dataToBind.items.map(i => i.name);
			const cachedProducts = Object.keys(cache.products);
			const missingProducts = productsToGet.map(k => !cachedProducts.includes(k));
			// CANNOT DO IT THIS WAY DIFFERENT DATABASES OR MODELS
			next();
		}

		async.waterfall([
			getFor
			, getProducts
		], (err) => {
			if(err) return cb(err);
			cb(null, dataToBind);
		})
				
	}

	return helper.createWidgetLoader(__dirname, cache, 'transactions', dataLoader);
}

module.exports = {
	transact, subscribe, save, appName, getDashboardWidgetUrl, getTransactionsWidget, doServiceAction, charge
	, update, initialize, purchase, getCharges, transactMultiple
}