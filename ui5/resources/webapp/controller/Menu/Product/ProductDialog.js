sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController",
	"restaurants/ui5/utils/Validator",
	"restaurants/ui5/model/types",
	"restaurants/ui5/model/models"
], function(BaseDialog, BaseController, Validator, types, models) {
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
				ctx = this._dialog.getModel("restaurants").createEntry("/Products", {
					properties: ctx
				});
			}
			this._dialog.setBindingContext(ctx, "restaurants");
			return ctx;
		},

		getFieldGroup: function() {
			return "productFields";
		},

		success: function() {
			var productCtx = this._dialog.getBindingContext("restaurants");
			BaseController.prototype.showMessageToast("ProductSaved", [productCtx.getProperty("ProductId")]);
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
			models.getBase64(imageBlob)
				.then(imageB64 => this._dialog.getModel("restaurants").setProperty("Image", imageB64, this._dialog.getBindingContext("restaurants")));
		},

		onDeleteImage: function() {
			this._dialog.getModel("restaurants").setProperty("Image", null, this._dialog.getBindingContext("restaurants"));
		}
	});

});