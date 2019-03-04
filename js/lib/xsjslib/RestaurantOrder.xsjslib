/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");
const https = $.require('https');
var fs = $.require('fs');
var	google = $.require('googleapis');
var PROJECT_ID = 'HANA-FIREBASE';
var HOST = 'https://fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}"
		("RestaurantId","RestaurantOrderId","Status.StatusId","Customer.CustomerId","CreatedAt","PaymentMethod")
		values (?,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	//pStmt.setInteger(2, newObject.RestaurantTableId || 0);
	pStmt.setInteger(2, newObject.RestaurantOrderId);
	pStmt.setString(3, newObject["Status.StatusId"] || 'PENDING'); //PENDING

	if (newObject["Customer.CustomerId"]) {
		pStmt.setString(4, newObject["Customer.CustomerId"]);
	} else {
		pStmt.setNull(4, null); //Anonym
	}

	pStmt.setTimestamp(5, new Date());
	pStmt.setString(6, newObject.PaymentMethod || 'CASH'); //CASH
	pStmt.executeUpdate();
	pStmt.close();
}

function AfterCreateOrModif(param) {
	var newOrder = utils.getNewObject(param);
	var oldOrder = utils.getOldObject(param);

	var getCustomerStmt = param.connection.prepareStatement(
		`SELECT * FROM "restaurants.db::RestaurantsContext.Customer" WHERE "CustomerId" = ?`
	);
	getCustomerStmt.setString(1, newOrder["Customer.CustomerId"]);
	var customerResult = getCustomerStmt.executeQuery();
	customerResult.next();
	var customer = customerResult._row;

	var message = {
		message: {
			token: customer.MessagingToken
		}
	};

	if (newOrder && !oldOrder) {
		//Order Created: Send initial notification
		message.message.notification = {
			title: "Orden creada",
			description: "estate atento"
		};
	} else if (newOrder["Status.StatusId"] === "READY") {
		//Order READY: Send READY notification
	}

	sendFcmMessage(message);
}

/*
 * Get a valid access token.
 */
function getAccessToken() {
	return new Promise(function(resolve, reject) {
		var key = $.require('../../security/service-account.json');
		var jwtClient = new google.auth.JWT(
			key.client_email,
			null,
			key.private_key,
			SCOPES,
			null
		);
		jwtClient.authorize(function(err, tokens) {
			if (err) {
				reject(err);
				return;
			}
			resolve(tokens.access_token);
		});
	});
}

/*
 * Send HTTP request to FCM with given message.
 */
function sendFcmMessage(fcmMessage) {
	getAccessToken()
		.then(function(accessToken) {
			var options = {
				hostname: HOST,
				path: PATH,
				method: 'POST',
				// [START use_access_token]
				headers: {
					'Authorization': 'Bearer ' + accessToken
				}
				// [END use_access_token]
			};

			var request = https.request(options, function(resp) {
				resp.setEncoding('utf8');
				resp.on('data', function(data) {
					console.log('Message sent to Firebase for delivery, response:');
					console.log(data);
				});
			});

			request.on('error', function(err) {
				console.log('Unable to send message to Firebase');
				console.log(err);
			});

			request.write(JSON.stringify(fcmMessage));
			request.end();
		});
}