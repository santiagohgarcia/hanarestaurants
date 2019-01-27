sap.ui.define([
	"sap/ui/base/ManagedObject",
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"restaurants/ui5/model/formatter"
], function(ManagedObject, BaseController, types, models, formatter) {
	"use strict";

	return ManagedObject.extend("restaurants.ui5.controller.Orders.OrderItem", {

		types: types,
		formatter: formatter,

		onPressReady: function(evt) {
			var orderCtx = evt.getSource().getBindingContext("restaurants");
			models.changeOrderStatus(orderCtx, 2) //Ready TODO: change for constants
				.then(() => {
					//BaseController.prototype.showMessageToast("Order_OrderReady", [orderCtx.getProperty("RestaurantOrderId")]);
					sap.ui.getCore().getModel("restaurants").refresh();
				});
		},

		onPressCancel: function(evt) {
			var orderCtx = evt.getSource().getBindingContext("restaurants");
			models.changeOrderStatus(orderCtx, 4) //Cancelled TODO: change for constants
				.then(() => {
					//BaseController.prototype.showMessageToast("Order_OrderCancelled", [orderCtx.getProperty("RestaurantOrderId")]);
					sap.ui.getCore().getModel("restaurants").refresh();
				});
		},

		onPressMore: function(evt) {
			var vbox = evt.getSource().getParent().getParent();
			vbox.getControlsByFieldGroupId("items")[0].getBinding("items").
			panel.getHeaderToolbar().getContent().forEach(cont => cont.setVisible(!expanded));
		}
	});

});