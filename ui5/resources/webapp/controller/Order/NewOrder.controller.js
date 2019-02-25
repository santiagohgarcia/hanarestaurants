sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/json/JSONModel",
	"restaurants/ui5/utils/Validator"
], function(BaseController, formatter, types, models, JSONModel, Validator) {
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
		},

		_bindNewOrder: function(restaurant) {
			models.getNewOrderId(restaurant).then(resp => {
				var ctx = this.getModel().createEntry("/Orders", {
					properties: {
						RestaurantId: restaurant.RestaurantId,
						OrderId: resp.RestaurantOrderId,
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
			this.byId("newOrderSplitCont").toMaster(categoryProductsPage);
		},

		onNavToCategories: function() {
			this.byId("newOrderSplitCont").backMaster();
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
				orderItemCtx = evt.getParameter("listItem").getBindingContext(),
				order = orderCtx.getObject();
			order.Items = order.Items.filter(orderItemPath => orderItemPath !== orderItemCtx.getPath().substring(1));
			model.setProperty("Items", order.Items, orderCtx);
			model.deleteCreatedEntry(orderItemCtx);
			this.sumOrderTotal();
		},

		onChangeQuantity: function(evt) {
			var itemCtx = evt.getSource().getBindingContext();
			var item = itemCtx.getObject();
			this.getModel().setProperty("Price", item.UnitPrice * item.Quantity, itemCtx);
			this.sumOrderTotal();
		},

		sumOrderTotal: function() {
			var sum = this.byId("order").getBindingContext().getProperty("Items")
				.map(i => this.getModel().getObject("/" + i))
				.map(i => i.Price)
				.reduce(((a, b) => a + b), 0);
			this.getModel("orderJSON").setProperty("/Total", sum);
		},

		onSave: function() {
			var restaurantModel = this.getModel();
			if (Validator.isValid("orderFields", this.getView())) {
				if (restaurantModel.hasPendingChanges()) {
					this.getView().setBusy(true);
					restaurantModel.submitChanges({
						success: this.success.bind(this)
					});
				} else {
					this.onCloseDialog();
				}
			}
		},
		success: function() {
			var order = this.getView().getBindingContext();
			this.showMessageToast("OrderSaved", [order.getProperty("RestaurantOrderId")]);
			BaseController.prototype.onNavBack.apply(this);
		}

	});
});