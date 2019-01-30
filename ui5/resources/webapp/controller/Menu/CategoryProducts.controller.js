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

		_init: function(restaurantId) {
			this._filterCategories(restaurantId);
			this.byId("categoryBreadcrumbs").destroyLinks();
			this.byId("categoryBreadcrumbs").setCurrentLocationText(this.getText("AllCategories"));
		},

		_attachProductSelected: function(callback) {
			this._productSelectedCallback = callback;
		},

		_setMode: function(mode) {
			this.getModel("params").setProperty("/mode", mode);
		},

		_filterCategories: function(restaurantId, parentCategoryId) {
			var categoryBinding = this.byId("categoryTree").getBinding("items");
			if (categoryBinding) {
				categoryBinding.filter([
					new Filter("RestaurantId", FO.EQ, restaurantId),
					new Filter("ParentCategory.CategoryId", FO.EQ, parentCategoryId || 0)
				]);
				categoryBinding.resume();
			}
		},

		onPressCategory: function(evt) {
			var categoryCtx = evt.getSource().getBindingContext("restaurants");
			var category = categoryCtx.getObject();
			this.byId("productsList").getBinding("items")
				.filter(new Filter("Category.CategoryId", FO.EQ, category.CategoryId));
			this._filterCategories(category.RestaurantId, category.CategoryId);
			this.byId("categoryBreadcrumbs").setCurrentLocationText(category.Description);
			var newLink = new sap.m.Link({
				text: category["ParentCategory.CategoryId"] ? "{restaurants>Description}" : "{i18n>AllCategories}",
				press: this.onPressCategoryBreadcrumb.bind(this),
				emphasized: true
			});
			if (category["ParentCategory.CategoryId"]) {
				newLink.bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category["ParentCategory.CategoryId"]})`);
			}
			this.byId("categoryBreadcrumbs").addLink(newLink);

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
			this._filterCategories(category.RestaurantId, category.CategoryId);

			this.byId("productsList").getBinding("items")
				.filter(new Filter("Category.CategoryId", FO.EQ, category.CategoryId));

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
			}).then(category => {
				this.byId("categoryContainer").bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
			});
		},

		onAddSubCategory: function(evt) {
			var parentCategory = evt.getSource().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: parentCategory.RestaurantId,
				"ParentCategory.CategoryId": parentCategory.CategoryId
			}).then(category => {
				this.byId("categoryContainer").bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
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