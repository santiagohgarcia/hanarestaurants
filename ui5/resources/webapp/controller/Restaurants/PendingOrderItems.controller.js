sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models"
], function(BaseController, formatter, types, models) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Restaurants.PendingOrderItems", {

		formatter: formatter,
		types: types,
		models: models,

		onInit: function() {
			this.getRouter().getRoute("PendingOrderItems").attachMatched(this._attachPendingOrderItemsMatched.bind(this));
		},

		_attachPendingOrderItemsMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement({
				path: `/Restaurants(RestaurantId=${args.RestaurantId})`,
				model: "restaurants"
			});
		}

	});
});