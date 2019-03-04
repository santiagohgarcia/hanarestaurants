/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

const https = $.require('https');
var fs = $.require('fs');
var google = $.require('googleapis');
var PROJECT_ID = 'hana-firebase';
var HOST = 'fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];

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
	this.getAccessToken()
		.then(function(accessToken) {
			var options = {
				hostname: HOST,
				path: PATH,
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + accessToken
				}
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