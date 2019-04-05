sap.ui.define([
	"customer/customer/controller/BaseController",
	"customer/customer/model/types",
	"customer/customer/model/models",
	"customer/customer/model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, types, models, formatter, Fragment, JSONModel, Filter, FO) {
	"use strict";

	return BaseController.extend("customer.customer.controller.Menu.Menu", {

		types: types,
		models: models,
		formatter: formatter,

		onInit: function() {
			this.getRouter().getRoute("NewOrder").attachMatched(this._onRestaurantNewOrderMatched.bind(this));
			this.setModel(new JSONModel({
				Total: 0
			}), "orderJSON");
		},

		_onRestaurantNewOrderMatched: function(evt) {
			var args = evt.getParameter("arguments");
			this.getView().bindElement(`/Restaurants(RestaurantId=${args.RestaurantId})`);
		},

		// ADD TO CART DIALOG
		onPressProduct: async function(evt) {
			var productCtx = evt.getSource().getBindingContext();
			var addToCartDialog = this.byId("addToCartDialog");
			if (!addToCartDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "customer.customer.view.Menu.AddToCartDialog",
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

		onAddToCart: async function(evt) {
			var model = this.getModel(),
				qty = this.byId("quantityStepInput").getValue(),
				product = evt.getSource().getBindingContext().getObject({
					expand: "Category"
				});
			var orderCtx = this.byId("cartToolbar").getBindingContext();
			if (!orderCtx.bCreated) {
				orderCtx = await this._bindNewOrder();
			}
			var order = orderCtx.getObject();
			var orderItemCtx = model.createEntry("/OrderItems", {
				properties: {
					RestaurantId: order.RestaurantId,
					RestaurantOrderId: order.RestaurantOrderId,
					ProductId: product.ProductId,
					ProductName: product.Name,
					Quantity: qty,
					UnitPrice: product.Price,
					Price: product.Price * qty,
					Image: product.Image,
					CategoryDescription: product.Category.Description
				},
				context: orderCtx
			});
			order.Items.push(orderItemCtx.getPath().substring(1));
			model.setProperty("Items", order.Items, orderCtx);
			this.sumOrderTotal();
			this.byId("addToCartDialog").close();
		},

		_bindNewOrder: async function() {
			var cartToolbar = this.byId("cartToolbar");
			var customer = this.getView().getBindingContext("customer").getObject();
			var restaurant = this.getView().getBindingContext().getObject();
			var restaurantOrderId = await models.getNewOrderId(restaurant);
			var ctx = this.getModel().createEntry("/Orders", {
				properties: {
					RestaurantId: restaurant.RestaurantId,
					RestaurantOrderId: restaurantOrderId.RestaurantOrderId,
					"Customer.CustomerId": customer.CustomerId,
					PaymentMethod: "CREDIT_CARD",
					Items: []
				},
				success: function() {
					this.getModel("orderJSON").setProperty("/Total", 0);
				}.bind(this)
			});
			cartToolbar.setBindingContext(ctx);
			return ctx;
		},

		onCancelAddToCart: function() {
			this.byId("addToCartDialog").close();
		},

		sumOrderTotal: function() {
			var sum = this.byId("cartToolbar").getBindingContext().getProperty("Items").map(i => this.getModel().getObject("/" + i))
				.map(i => Number(i.Price))
				.reduce(((a, b) => a + b), 0);
			this.getModel("orderJSON").setProperty("/Total", sum);
		},

		onCartToolbarPress: function(evt) {
			var orderCtx = evt.getSource().getBindingContext();
			this.getRouter().navTo("Cart", {
				RestaurantId: orderCtx.getProperty("RestaurantId"),
				OrderPath: orderCtx.getPath().substr(1)
			});
		},

		onReceiveCategories: function(evt) {
			var data = evt.getParameter("data");
			if (data) {
				this.byId("categoryMenuButton").setText(this.getText("All"));
				this.byId("categoryMenu").insertItem(new sap.m.MenuItem({
					text: this.getText("All")
				}), 0);
			}
		},

		getCategoryDescription: function(ctx) {
			return ctx.getProperty("Category/Description");
		},

		onSelectCategory: function(evt) {
			var category = evt.getParameter("item").getBindingContext().getObject({
					expand: "Icon"
				}),
				productBinding = this.byId("productsList").getBinding("items"),
				categoryMenuButton = this.byId("categoryMenuButton");
			if (category.CategoryId) {
				//categoryMenuButton.setIcon(category.Icon.Icon);
				categoryMenuButton.setText(category.Description);
				productBinding.filter(new Filter("Category.CategoryId", FO.EQ, category.CategoryId));
			} else {
				//categoryMenuButton.setIcon();
				categoryMenuButton.setText(evt.getParameter("item").getText());
				productBinding.filter([]);
			}
		},

		resizeIcon: function(iconBase64Url) {
			// We create a canvas and get its context.
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			// We set the dimensions at the wanted size.
			canvas.width = "40px";
			canvas.height = "40px";
			iconBase64Url = iconBase64Url.replace("data:image/png;base64,","")
			var img = new Blob(iconBase64Url, 'base64');

			// We resize the image with the canvas method drawImage();
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			return canvas.toDataURL();

		}

	});
});