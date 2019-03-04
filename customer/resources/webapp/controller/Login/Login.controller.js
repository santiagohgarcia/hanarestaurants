sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter"
], function(BaseController, types, models, formatter) {
	"use strict";

	return BaseController.extend("customer.customer.controller.Login.Login", {

		types: types,
		models: models,
		formatter: formatter,

		onGoogleLogin: function() {
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider);
		},

		onFacebookLogin: function() {
			var provider = new firebase.auth.FacebookAuthProvider();
			firebase.auth().signInWithPopup(provider);
		},

		onAnonymousLogin: function() {
			firebase.auth().signInAnonymously();
		}

	});
});