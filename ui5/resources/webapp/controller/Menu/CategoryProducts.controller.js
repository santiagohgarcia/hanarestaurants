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
			this.getView().initialize = this._initialize.bind(this);
			this.getView().setMode = this._setMode.bind(this);
			this.getView().attachProductSelected = this._attachProductSelected.bind(this);
			this.setModel(new JSONModel({
				mode: "R"
			}), "params");
		},

		_initialize: function(category) {
			this._bindCategory(category);
		},

		_attachProductSelected: function(callback) {
			this._productSelectedCallback = callback;
		},

		_setMode: function(mode) {
			this.getModel("params").setProperty("/mode", mode);
		},

		onPressCategory: function(evt) {
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			this._bindCategory(category);
		},

		onPressCategoryBreadcrumb: function(evt) {
			var category = evt.getSource().getBindingContext("restaurants").getObject();
			this._bindCategory(category);
		},

		_bindCategory: function(category) {
			if (category.CategoryId) {
				this.getView().bindElement(
					`restaurants>/Categories(RestaurantId=${category.RestaurantId},CategoryId=${category.CategoryId})`);
			} else {
				this.getView().bindElement(
					`restaurants>/Restaurants(RestaurantId=${category.RestaurantId})`);
			}
		},

		onPressProduct: function(evt) {
			this._productSelectedCallback(evt);
		},

		//CATEGORY

		onAddCategory: function(evt) {
			var parentCategory = evt.getSource().getBindingContext("restaurants").getObject();
			this.openCategoryDialog({
				RestaurantId: parentCategory.RestaurantId,
				"ParentCategory.CategoryId": parentCategory.CategoryId
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