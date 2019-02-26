sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, formatter, types, Filter, FO) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.ManagerHome", {
		formatter: formatter,
		types: types,

		onReceiveRestaurants: function(evt) {
			var bindingContext = this.getView().getBindingContext(),
				data = evt.getParameter("data");
			if (data && !bindingContext) {
				this.getView().bindElement(`/Restaurants(RestaurantId=${data.results[0].RestaurantId})`);
			}
		},

		onAddOrder: function(evt) {
			var restaurant = evt.getSource().getBindingContext().getObject();
			this.getRouter().navTo("NewOrder", {
				RestaurantId: restaurant.RestaurantId
			});
		},

		onPressOrderCancel: function(evt) {
			var orderCtx = evt.getSource().getBindingContext();
			this._changeOrderStatus(orderCtx, "CANCELLED");
		},

		onPressOrderPayed: function(evt) {
			var orderCtx = evt.getSource().getBindingContext();
			this._changeOrderStatus(orderCtx, "PAYED");
		},

		_changeOrderStatus: function(orderCtx, status) {
			this.getModel().setProperty("Status.StatusId", status, orderCtx);
			this.getModel().submitChanges({
				success: this._success.bind(this, [orderCtx.getProperty("RestaurantOrderId")])
			});
		},

		_success: function(orderId) {
			this.showMessageToast("OrderUpdated", [orderId]);
		},

		onSelectStatusTab: function(evt) {
			var key = evt.getParameter("key"),
				filter = key !== "ALL" ? new Filter("Status.StatusId", FO.EQ, key) : [];
			this.byId("orderList").getBinding("items").filter(filter,"Application");
		}

	});
});