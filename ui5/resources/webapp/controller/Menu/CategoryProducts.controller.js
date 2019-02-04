sap.ui.define([
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/model/formatter",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function(BaseController, formatter, types, models, Filter, FO, JSONModel) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.Menu.CategoryProducts", {
		types: types,
		formatter: formatter,
		models: models,

		onInit: function() {
			this.getView().init = this._init.bind(this);
			this.getView().setMode = this._setMode.bind(this);
			this.getView().attachProductSelected = this._attachProductSelected.bind(this);
			this.setModel(new JSONModel({
				mode: "R"
			}), "params");
		},

		_init: function() {
			this.byId("categoryBreadcrumbs").destroyLinks();
			this.byId("categoryBreadcrumbs").setCurrentLocationText(this.getText("AllCategories"));
		},

		_attachProductSelected: function(callback) {
			this._productSelectedCallback = callback;
		},

		_setMode: function(mode) {
			this.getModel("params").setProperty("/mode", mode);
		},

		onPressCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants"),
				category = categoryCtx.getObject(),
				newLink = new sap.m.Link({
					text: category["ParentCategory.CategoryId"] ? "{restaurants>Description}" : "{i18n>AllCategories}",
					press: this.onPressCategoryBreadcrumb.bind(this),
					emphasized: true
				});

			this._bindCategory(category);

			if (category["ParentCategory.CategoryId"]) {
				newLink.bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category["ParentCategory.CategoryId"]})`);
			}

			this.byId("categoryBreadcrumbs")
				.setCurrentLocationText(category.Description)
				.addLink(newLink);

		},

		_bindCategory: function(category) {
			this.getView().bindElement(
				`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
		},

		onPressCategoryBreadcrumb: function(evt) {
			var pressedLink = evt.getSource();
			var category = pressedLink.getBindingContext("restaurants").getObject();
			var categoryBreadcrumbs = this.byId("categoryBreadcrumbs");
			var pressedIndex = categoryBreadcrumbs.indexOfLink(pressedLink);
			categoryBreadcrumbs.getLinks()
				.filter(l => categoryBreadcrumbs.indexOfLink(l) >= pressedIndex)
				.forEach(l => categoryBreadcrumbs.removeLink(l));
			categoryBreadcrumbs.setCurrentLocationText(category.CategoryId ? category.Description : this.getText("AllCategories"));
			this._bindCategory(category);
		},

		onSearchProducts: function(evt) {
			var query = evt.getParameter("newValue");
			this.byId("productsList").getBinding("items").filter(query ? new Filter({
				path: "Description",
				operator: FO.Contains,
				value1: query,
				caseSensitive: false
			}) : []);
		},

		onPressProduct: function(evt) {
			this._productSelectedCallback(evt);
		},

		//CATEGORY

		onAddCategory: function(evt) {
			var restaurant = evt.getSource().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: restaurant.RestaurantId
			});
		},

		onEditCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants");
			this.openCategoryDialog(categoryCtx);
		},

		onDeleteCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants");
			var categoryId = categoryCtx.getProperty("CategoryId");
			this.getModel("restaurants").remove(categoryCtx.getPath(), {
				success: function() {
					this.showMessageToast("CategoryDialog_CategoryDeleted", [categoryId]);
				}.bind(this)
			});
		},

		//PRODUCT

		onAddProduct: function(evt) {
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			this.openProductDialog({
				RestaurantId: category.RestaurantId,
				"Category.CategoryId": category.CategoryId
			});
		},

		onEditProduct: function(evt) {
			var productCtx = evt.getSource().getBindingContext("restaurants");
			this.openProductDialog(productCtx);
		},

		onDeleteProduct: function(evt) {
			var productCtx = evt.getParameter("listItem").getBindingContext("restaurants");
			var productId = productCtx.getProperty("ProductId");
			this.getModel("restaurants").remove(productCtx.getPath(), {
				success: function() {
					this.showMessageToast("ProductDialog_ProductDeleted", [productId]);
					this.getModel("restaurants").refresh();
				}.bind(this)
			});
		}

	});
});