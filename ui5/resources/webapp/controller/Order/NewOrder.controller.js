sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/json/JSONModel",
	"restaurants/ui5/utils/Validator",
	"sap/m/MessageBox"
], function(BaseController, formatter, types, models, JSONModel, Validator, MessageBox) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Order.NewOrder", {
		types: types,
		formatter: formatter,
		models: models,

		onInit: function() {
			this.getRouter().getRoute("NewOrder").attachMatched(this._onNewOrderMatched.bind(this));
			this.setModel(new JSONModel({
				Total: 0
			}), "orderJSON");
		},

		_onNewOrderMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this._bindRestaurant(args);
			this._bindNewOrder(args);
			this.byId("categoriesProductsNavCont").to(this.byId("categories"));
		},

		_bindNewOrder: function(restaurant) {
			models.getNewOrderId(restaurant).then(resp => {
				var ctx = this.getModel().createEntry("/Orders", {
					properties: {
						RestaurantId: Number(restaurant.RestaurantId),
						RestaurantOrderId: resp.RestaurantOrderId,
						Items: []
					}
				});
				this.byId("order").setBindingContext(ctx);
			});
		},

		_bindRestaurant: function(restaurant) {
			this.getView().bindElement({
				path: `/Restaurants(RestaurantId=${restaurant.RestaurantId})`,
				parameters: {
					expand: "Categories"
				}
			});
		},

		onPressCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext(),
				categoryProductsPage = this.byId("categoryProducts");
			categoryProductsPage.setBindingContext(categoryCtx);
			this.byId("categoriesProductsNavCont").to(categoryProductsPage);
		},

		onNavToCategories: function() {
			this.byId("categoriesProductsNavCont").back();
		},

		onPressProduct: function(evt) {
			var model = this.getModel(),
				orderCtx = this.byId("order").getBindingContext(),
				order = orderCtx.getObject(),
				product = evt.getSource().getBindingContext().getObject(),
				producExists = order.Items
				.map(i => this.getModel().getObject("/" + i))
				.some(i => i.Product === product.ProductId);
			if (!producExists) {
				var orderItemCtx = model.createEntry("/OrderItems", {
					properties: {
						RestaurantId: order.RestaurantId,
						RestaurantOrderId: order.RestaurantOrderId,
						Product: product.ProductId,
						ProductDescription: product.Description,
						Quantity: 1,
						UnitPrice: product.Price,
						Price: product.Price
					},
					context: orderCtx
				});
				order.Items.push(orderItemCtx.getPath().substring(1));
				model.setProperty("Items", order.Items, orderCtx);
				this.sumOrderTotal();
			}
		},

		onDeleteOrderItem: function(evt) {
			var model = this.getModel(),
				orderCtx = this.byId("order").getBindingContext(),
				orderItemCtx = evt.getSource().getBindingContext(),
				order = orderCtx.getObject();
			order.Items = order.Items.filter(orderItemPath => orderItemPath !== orderItemCtx.getPath().substring(1));
			model.setProperty("Items", order.Items, orderCtx);
			model.deleteCreatedEntry(orderItemCtx);
			this.sumOrderTotal();
		},

		onChangeQuantity: function(evt) {
			var itemCtx = evt.getSource().getBindingContext();
			var item = itemCtx.getObject();
			this.getModel().setProperty("Price", String(item.UnitPrice * item.Quantity), itemCtx);
			this.sumOrderTotal();
		},

		sumOrderTotal: function() {
			var sum = this.byId("order").getBindingContext().getProperty("Items")
				.map(i => this.getModel().getObject("/" + i))
				.map(i => Number(i.Price))
				.reduce(((a, b) => a + b), 0);
			this.getModel("orderJSON").setProperty("/Total", sum);
		},

		onSave: function() {
			var model = this.getModel();
			if (Validator.isValid("orderFields", this.getView()) && model.hasPendingChanges()) {
				this.getView().setBusy(true);
				model.submitChanges().then(this.success.bind(this));
			}
		},

		success: function() {
			var order = this.byId("order").getBindingContext();
			this.getView().setBusy(false);
			this.showMessageToast("OrderSaved", [order.getProperty("RestaurantOrderId")]);
			BaseController.prototype.onNavBack.apply(this, ["ManagerHome"]);
		},

		onNavBack: function() {
			this.confirmPopup().then(action => {
				if (action === MessageBox.Action.OK) {
					BaseController.prototype.onNavBack.apply(this, ["ManagerHome"]);
				}
			});
		}

	});
});