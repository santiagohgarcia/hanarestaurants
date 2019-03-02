sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(BaseController, types, models, formatter, Fragment, JSONModel) {
	"use strict";

	return BaseController.extend("customer.customer.controller.RestaurantMenu.RestaurantMenu", {

		types: types,
		models: models,
		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("RestaurantMenu").attachMatched(this._onRestaurantMenuMatched.bind(this));
			this.setModel(new JSONModel({
				Total: 0
			}), "orderJSON");
		},

		_onRestaurantMenuMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement(`/Restaurants(RestaurantId=${args.RestaurantId})`);
			this._bindNewOrder(args);
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
				this.byId("cartToolbar").setBindingContext(ctx);
			});
		},

		// ADD TO CART DIALOG
		onPressProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext();
			var addToCartDialog = this.byId("addToCartDialog");
			if (!addToCartDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "customer.customer.view.RestaurantMenu.AddToCartDialog",
					controller: this
				}).then(dialog => {
					this.byId("quantityStepInput").setValue(1);
					this.getView().addDependent(dialog);
					dialog.setBindingContext(productCtx);
					dialog.open();
				});
			} else {
				this.byId("quantityStepInput").setValue(1);
				addToCartDialog.setBindingContext(productCtx);
				this.byId("addToCartDialog").open();
			}
		},

		onAddToCart: function(evt) {
			var model = this.getModel(),
				qty = this.byId("quantityStepInput").getValue(),
				orderCtx = this.byId("cartToolbar").getBindingContext(),
				order = orderCtx.getObject(),
				product = evt.getSource().getBindingContext().getObject();
			var orderItemCtx = model.createEntry("/OrderItems", {
				properties: {
					RestaurantId: order.RestaurantId,
					RestaurantOrderId: order.RestaurantOrderId,
					Product: product.ProductId,
					ProductDescription: product.Description,
					Quantity: qty,
					UnitPrice: product.Price,
					Price: product.Price * qty
				},
				context: orderCtx
			});
			order.Items.push(orderItemCtx.getPath().substring(1));
			model.setProperty("Items", order.Items, orderCtx);
			this.sumOrderTotal();
			this.byId("addToCartDialog").close();
		},

		onCancelAddToCart: function() {
			this.byId("addToCartDialog").close();
		},

		sumOrderTotal: function() {
			var sum = this.byId("cartToolbar").getBindingContext().getProperty("Items")
				.map(i => this.getModel().getObject("/" + i))
				.map(i => Number(i.Price))
				.reduce(((a, b) => a + b), 0);
			this.getModel("orderJSON").setProperty("/Total", sum);
		},
		
		onCartToolbarPress:function(evt){
			alert("crearOrder");
		}

	});
});