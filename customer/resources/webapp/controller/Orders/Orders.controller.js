sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter"
], function(BaseController, types, models, formatter) {
	"use strict";

	return BaseController.extend("customer.customer.controller.Orders.Orders", {

		types: types,
		models: models,
		formatter: formatter,

		onInit: function() {
			const messaging = firebase.messaging();
			messaging.onMessage((message) => {
				var ordersBinding = this.byId("ordersList").getBinding("items");
				if (ordersBinding) {
					ordersBinding.refresh();
					if (message.data.action === "MODIFIED") {
						this.showMessageToast("OrderUpdated",[message.data.RestaurantOrderId]);
					}
				}
			});
		},

		onModelContextChange: function(evt) {
			var navContainer = evt.getSource();
			var customerCtx = navContainer.getBindingContext("customer");
			if (customerCtx) {
				this.byId("ordersPage").bindElement(`/Customers('${customerCtx.getProperty("CustomerId")}')`)
			}
		},

		createdAtSorter: function(orderCtx) {
			this.dateTimeType = this.dateTimeType || new this.types.dateTimeType();
			var createdAt = orderCtx.getProperty("CreatedAt");
			return this.dateTimeType.formatValue(createdAt, "string");
		}

	});
});