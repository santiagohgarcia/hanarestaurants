sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter"
], function(BaseController, types, models, formatter) {
	"use strict";

	return BaseController.extend("customer.customer.controller.Checkout.OrderCreated", {

		types: types,
		models: models,
		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("OrderCreated").attachMatched(this._onOrderCreatedMatched.bind(this));
		},

		_onOrderCreatedMatched: function(evt) {
			this.RestaurantId = evt.getParameter("arguments").RestaurantId;
		},

		onPressFinish: function() {
			this.getRouter().navTo("Menu", {
				RestaurantId: this.RestaurantId
			}, true);
		}

	});
});