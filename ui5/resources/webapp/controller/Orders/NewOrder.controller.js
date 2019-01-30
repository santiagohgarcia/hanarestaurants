sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"restaurants/ui5/utils/Validator"
], function(BaseController, formatter, types, models, Filter, FO, JSONModel, Validator) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Orders.NewOrder", {
		types: types,
		models: models,
		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("NewOrder").attachMatched(this._attachNewOrderMatched.bind(this));
			this.setModel(new JSONModel({
				Total: 0
			}), "orderJSON");
		},

		_attachNewOrderMatched: function(evt) {
			var args = evt.getParameter("arguments");

			this.byId("categoryProductsView").init(args.RestaurantId);
			this.byId("categoryProductsView").attachProductSelected(this.onPressProduct.bind(this));

			models.getNewOrderId(args.RestaurantId, 0) //TODO: change this for AWAIT!!
				.then(response => {
					var ctx = this.getModel("restaurants").createEntry("/Orders", {
						properties: {
							RestaurantId: args.RestaurantId,
							RestaurantOrderId: response.RestaurantOrderId,
							Items: []
						}
					});
					this.getView().setBindingContext(ctx, "restaurants");
				});
		},

		onPressProduct: function(evt) {
			var restaurantsModel = this.getModel("restaurants");
			var orderCtx = this.getView().getBindingContext("restaurants");
			var order = orderCtx.getObject();
			var product = evt.getSource().getBindingContext("restaurants").getObject();
			var producExists = order.Items
				.map(i => this.getModel("restaurants").getObject("/" + i))
				.map(i => i.Product).indexOf(product.ProductId) >= 0;
			if (!producExists) {
				var orderItemCtx = restaurantsModel.createEntry("/OrderItems", {
					properties: {
						RestaurantId: order.RestaurantId,
						RestaurantTableId: order.RestaurantTableId,
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
				restaurantsModel.setProperty("Items", order.Items, orderCtx);
				this.sumOrderTotal();
			}
		},

		onDeleteOrderItem: function(evt) {
			var restaurantsModel = this.getModel("restaurants");
			var orderCtx = this.getView().getBindingContext("restaurants");
			var orderItemCtx = evt.getParameter("listItem").getBindingContext("restaurants");
			var order = orderCtx.getObject();
			order.Items = order.Items.filter(orderItemPath => orderItemPath !== orderItemCtx.getPath().substring(1));
			restaurantsModel.setProperty("Items", order.Items, orderCtx);
			restaurantsModel.deleteCreatedEntry(orderItemCtx);
			this.sumOrderTotal();
		},

		onChangeQuantity: function(evt) {
			var itemCtx = evt.getSource().getBindingContext("restaurants");
			var item = itemCtx.getObject();
			this.getModel("restaurants").setProperty("Price", item.UnitPrice * item.Quantity, itemCtx);
			this.sumOrderTotal();
		},

		sumOrderTotal: function() {
			var sum = this.getView().getBindingContext("restaurants").getProperty("Items")
				.map(i => this.getModel("restaurants").getObject("/" + i))
				.map(i => i.Price)
				.reduce(((a, b) => a + b), 0);
			this.getModel("orderJSON").setProperty("/Total", sum);
		},

		onSave: function() {
			var restaurantModel = this.getModel("restaurants");
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
			var order = this.getView().getBindingContext("restaurants");
			this.showMessageToast("OrderDialog_OrderSaved", [order.getProperty("RestaurantOrderId")]);
			BaseController.prototype.onNavBack.apply(this);
		},

		onNavBack: function() {
			var ctx = this.getView().getBindingContext("restaurants");
			var restaurantModel = this.getModel("restaurants");
			if (ctx.bCreated) {
				restaurantModel.deleteCreatedEntry(ctx);
			} else {
				restaurantModel.resetChanges();
			}
			BaseController.prototype.onNavBack.apply(this);
		}
	});
});