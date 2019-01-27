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
				models.getNewProductId() //TODO: change this for AWAIT!!
					.then(response => {
						ctx.ProductId = response.ProductId;
						ctx.Images = [];
						ctx = this._dialog.getModel("restaurants").createEntry("/Products", {
							properties: ctx
						});
						this._dialog.setBindingContext(ctx, "restaurants");
						this._bindProductImages();
					});
			} else {
				this._dialog.setBindingContext(ctx, "restaurants");
				this._bindProductImages();
				return ctx;
			}
		},

		getFieldGroup: function() {
			return "productFields";
		},

		onBeforeUploadStarts: function(evt) {
			var addParameterFn = evt.getParameter("addHeaderParameter");
			var product = this._dialog.getBindingContext("restaurants").getObject();
			addParameterFn(new UploadCollectionParameter({
				name: "FileName",
				value: evt.getParameter("fileName")
			}));
			addParameterFn(new UploadCollectionParameter({
				name: "ProductId",
				value: product.ProductId
			}));
		},

		success: function() {
			var productCtx = this._dialog.getBindingContext("restaurants");
			BaseController.prototype.showMessageToast("ProductDialog_ProductSaved", [productCtx.getProperty("ProductId")]);
			BaseDialog.prototype.success.apply(this);
		},

		onTypeMissmatch: function() {
			BaseController.prototype.showMessageToast("ProductDialog_ImageTypeMissmatch");
		},

		onSave: function() {
			var favoriteImg = this._view.byId("uploadCollection").getItems()
				.find(i => i.getBindingContext("restaurants").getProperty("Favorite") === 1);
			if (favoriteImg) {
				BaseDialog.prototype.onSave.apply(this);
			} else {
				BaseController.prototype.showMessageToast("PleaseSelectAFavImage");
			}
		},

		onDeleteFile: function(evt) {
			var productImageCtx = evt.getSource().getBindingContext("restaurants");
			//Favorite pic delete validation
			if (productImageCtx.getProperty("Favorite")) {
				BaseController.prototype.showMessageToast("CantDeleteFavoriteImage");
				return;
			}

			this._dialog.getModel("restaurants").remove(productImageCtx.getPath(), {
				success: function() {
					this._bindProductImages();
					BaseController.prototype.showMessageToast("ProductDialog_ImageDeleted");
				}.bind(this)
			});
		},

		onUploadComplete: function() {
			this._bindProductImages();
		},

		_bindProductImages: function() {
			var productId = this._dialog.getBindingContext("restaurants").getProperty("ProductId");
			var imageItemsBinding = this._view.byId("uploadCollection").getBinding("items");
			if (imageItemsBinding) {
				imageItemsBinding.filter([
					new Filter("ProductId", FO.EQ, productId)
				]);
			}
		},

		onCloseDialog: function() {
			var ctx = this._dialog.getBindingContext("restaurants");
			var restaurantModel = this._dialog.getModel("restaurants");
			if (ctx.bCreated) {
				var deleteImagesPromises = ctx.getProperty("Images").map(imagePath => {
					return new Promise((res) => {
						this._dialog.getModel("restaurants").remove(imagePath, {
							success: function() {
								res();
							}
						});
					});
				});
				Promise.all(deleteImagesPromises).then(() => {
					restaurantModel.deleteCreatedEntry(ctx);
					this._dialog.close();
				});
			} else {
				restaurantModel.resetChanges();
				this._dialog.close();
			}
		},

		onSelectionChange: function(evt) {
			var selImg = evt.getParameter("selectedItem").getBindingContext("restaurants").getObject();
			this._view.byId("uploadCollection").setBusy(true);
			models.setFavImage(selImg.ProductId, selImg.ImageId)
				.then(() => {
					this._view.byId("uploadCollection").setBusy(false);
					this._bindProductImages();
				});
		}
	});

});