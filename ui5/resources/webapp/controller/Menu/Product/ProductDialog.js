sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/utils/Validator",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseDialog, BaseController, Validator, types, models, UploadCollectionParameter, Filter, FO) {
	"use strict";

	return BaseDialog.extend("restaurants.ui5.controller.Menu.Product.ProductDialog", {
		types: types,
		models: models,

		getDialogId: function() {
			return "productDialog";
		},

		getFragmentId: function() {
			return "restaurants.ui5.view.Menu.Product.ProductDialog";
		},

		getNewContext: function(ctx) {
			if (ctx["Category.CategoryId"]) {
				models.getNewProductId().then(ProductId => {
					ctx.ProductId = ProductId.ProductId;
					ctx = this._dialog.getModel("restaurants").createEntry("/Products", {
						properties: ctx
					});
					this._dialog.setBindingContext(ctx, "restaurants");
				});
				return undefined;
			} else {
				this._dialog.setBindingContext(ctx, "restaurants");
				return ctx;
			}
		},

		getFieldGroup: function() {
			return "productFields";
		},

		success: function() {
			var productCtx = this._dialog.getBindingContext("restaurants");
			BaseController.prototype.showMessageToast("ProductDialog_ProductSaved", [productCtx.getProperty("ProductId")]);
			BaseDialog.prototype.success.apply(this);
		},

		onCloseDialog: function() {
			var ctx = this._dialog.getBindingContext("restaurants");
			var restaurantModel = this._dialog.getModel("restaurants");
			if (ctx.bCreated) {
				restaurantModel.deleteCreatedEntry(ctx);
				this._dialog.close();
			} else {
				restaurantModel.resetChanges();
				this._dialog.close();
			}
		},

		onImageUpload: function(evt) {
			var imageBlob = evt.getParameter("files")[0];
			var reader = new FileReader();
			reader.readAsDataURL(imageBlob);
			this._dialog.getModel("restaurants").setProperty("Image", reader.result, this._dialog.getBindingContext("restaurants"));
		/*	
			reader.onloadend = function() {
			
			}.bind(this);*/
			
		}
	});

});