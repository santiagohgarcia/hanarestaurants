sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types"
], function(BaseController, formatter, types) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Orders.OrderGrid", {
		types: types,

		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("Orders").attachMatched(this._attachOrdersMatched.bind(this));
		},

		_attachOrdersMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement({
				path: `/Restaurants(RestaurantId=${args.RestaurantId})`,
				model: "restaurants"
			});
		},

		showBusy: function() {
			this.byId("ordersSection").setBusy(true);
		},

		hideBusy: function() {
			this.byId("ordersSection").setBusy(false);
		},

		onAddOrder: function(evt) {
			var restaurantTable = evt.getSource().getBindingContext("restaurants").getObject();
			this.openOrderDialog({
				RestaurantId: restaurantTable.RestaurantId,
				RestaurantTableId: 0 //No table
			});
		}

	});
});