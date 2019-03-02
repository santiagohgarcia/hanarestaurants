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

		onInit: function() {
			this.getRouter().getRoute("ManagerHome").attachMatched(this._onManagerHomeMatched.bind(this));
		},

		_onManagerHomeMatched: function() {
			this._updateOrderBindings();
		},

		_updateOrderBindings: function() {
			var todayOrdersCountBinding = this.byId("orderStatusTabHeader").getBinding("items");
			var todayOrdersBinding = this.byId("orderList").getBinding("items");
			var todayRevenueBinding = this.byId("todayRevenueNumericContent").getElementBinding();
			if (todayOrdersCountBinding) {
				todayOrdersCountBinding.refresh();
			}
			if (todayOrdersBinding) {
				todayOrdersBinding.refresh();
			}
			if (todayRevenueBinding) {
				todayRevenueBinding.refresh();
			}
		},

		onReceiveRestaurants: function(evt) {
			var bindingContext = this.getView().getBindingContext(),
				data = evt.getParameter("data");
			if (data && !bindingContext) {
				this.getView().bindElement(`/Restaurants(RestaurantId=${data.results[0].RestaurantId})`);
			}
		},

		onReceiveOrdersCount: function() {
			this.byId("orderStatusTabHeader").insertItem(new sap.m.IconTabSeparator(), 1);
		},

		onSelectRestaurant: function(evt) {
			var restaurant = evt.getParameter("item").getBindingContext().getObject();
			this.getView().bindElement(`/Restaurants(RestaurantId=${restaurant.RestaurantId})`);
		},

		onAddOrder: function(evt) {
			var restaurant = evt.getSource().getBindingContext().getObject();
			this.getRouter().navTo("NewOrder", {
				RestaurantId: restaurant.RestaurantId
			});
		},

		onPressOrderCancel: function(evt) {
			var order = evt.getSource().getBindingContext().getObject();
			this._changeOrderStatus(order, "CANCELLED");
		},

		onPressOrderPayed: function(evt) {
			var order = evt.getSource().getBindingContext().getObject();
			this._changeOrderStatus(order, "PAYED");
		},

		_changeOrderStatus: function(order, status) {
			order["Status.StatusId"] = status;
			this.getModel().update(`/Orders(RestaurantId=${order.RestaurantId},RestaurantOrderId=${order.RestaurantOrderId})`, order)
				.then(this._success.bind(this, [order.RestaurantOrderId]));
		},

		_success: function(orderId) {
			this._updateOrderBindings();
			this.showMessageToast("OrderUpdated", [orderId]);
		},

		onSelectStatusTab: function(evt) {
			var key = evt.getParameter("key"),
				filter = key !== "ALL" ? new Filter("Status.StatusId", FO.EQ, key) : [];
			this.byId("orderList").getBinding("items").filter(filter, "Application");
		}

	});
});