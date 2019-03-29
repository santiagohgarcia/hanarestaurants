sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, types, models, formatter, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("customer.customer.controller.Cart.Cart", {

		types: types,
		models: models,
		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("Cart").attachMatched(this._onCartMatched.bind(this));
			this.setModel(new JSONModel({
				Total: 0
			}), "orderJSON");
		},

		_onCartMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement(`/Restaurants(RestaurantId=${args.RestaurantId})`);
			this.byId("orderPanel").bindElement("/" + args.OrderPath);
			this.sumOrderTotal();
		},

		sumOrderTotal: function() {
			var sum = this.byId("orderPanel").getBindingContext().getProperty("Items")
				.map(i => this.getModel().getObject("/" + i))
				.map(i => Number(i.Price))
				.reduce(((a, b) => a + b), 0);
			this.getModel("orderJSON").setProperty("/Total", sum);
		},

		onChangeQuantity: function(evt) {
			var itemCtx = evt.getSource().getBindingContext();
			var item = itemCtx.getObject();
			this.getModel().setProperty("Price", String(item.UnitPrice * item.Quantity), itemCtx);
			this.sumOrderTotal();
		},

		onDeleteOrderItem: function(evt) {
			var model = this.getModel(),
				orderCtx = this.byId("orderPanel").getBindingContext(),
				orderItemCtx = evt.getSource().getBindingContext(),
				order = orderCtx.getObject();
			order.Items = order.Items.filter(orderItemPath => orderItemPath !== orderItemCtx.getPath().substring(1));
			model.setProperty("Items", order.Items, orderCtx);
			model.deleteCreatedEntry(orderItemCtx);
			this.sumOrderTotal();
		},

		getPaymentMethodDescription: function(paymentMethod) {
			var text = this.getText(paymentMethod === "CREDIT_CARD" ? "PayWithCreditCard" : "PayWithCash");
			return `<cite>${text}</cite>`;
		},

		onApproveCartToolbarPress: function() {
			MessageBox.confirm(this.getText("AreYouSureYouWantToSubmitYourOrder"), {
				onClose: function(action) {
					if (action === "OK") {
						this._onConfirmOrder();
					}
				}.bind(this)
			});
		},

		_onConfirmOrder: function() {
			this._requestMessagingPermission()
				.then(() => this._submitOrder())

			const messaging = firebase.messaging();
			messaging.onMessage((message) => {
				debugger;
				var a = message;
			})
		},

		_modifyCustomerToken: function(token) {
			var customerCtx = this.getView().getBindingContext("customer");
			this.getModel("customer").setProperty("MessagingToken", token, customerCtx);
			if (this.getModel("customer").hasPendingChanges()) {
				return this.getModel("customer").submitChanges();
			} else {
				return Promise.resolve(customerCtx.getObject());
			}
		},

		_submitOrder: function() {
			var order = this.byId("orderPanel").getBindingContext().getObject();
			if (order.PaymentMethod === "CREDIT_CARD") {
				alert("falta MP");
			} else {
				this.getModel().submitChanges().then(this._success.bind(this));
			}
		},

		_requestMessagingPermission: function() {
			const messaging = firebase.messaging();
			messaging.onTokenRefresh(() =>
				messaging.getToken().then((token) => this._modifyCustomerToken(token)));
			return messaging.requestPermission()
				.then(() => messaging.getToken())
				.then((token) => this._modifyCustomerToken(token));
		},

		_success: function() {
			var order = this.byId("orderPanel").getBindingContext().getObject();
			this.getRouter().navTo("OrderCreated", {
				RestaurantId: order.RestaurantId
			}, true);
		}
	});
});