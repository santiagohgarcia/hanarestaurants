sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController"
], function(BaseDialog, BaseController) {
	"use strict";

	return BaseDialog.extend("restaurants.ui5.controller.Menu.Category.CategoryDialog", {

		getDialogId: function() {
			return "categoryDialog";
		},

		getFragmentId: function() {
			return "restaurants.ui5.view.Menu.Category.CategoryDialog";
		},

		getNewContext: function(ctx) {
			if (ctx.RestaurantId || ctx["ParentCategory.CategoryId"]) {
				ctx = this._dialog.getModel("restaurants").createEntry("/Categories", {
					properties: {
						RestaurantId: ctx.RestaurantId,
						"ParentCategory.CategoryId": ctx["ParentCategory.CategoryId"]
					}
				});
			}
			return ctx;
		},

		getFieldGroup: function() {
			return "categoryFields";
		},

		success: function() {
			var categoryCtx = this._dialog.getBindingContext("restaurants");
			BaseController.prototype.showMessageToast("CategoryDialog_CategorySaved", [categoryCtx.getProperty("CategoryId")]);
			BaseDialog.prototype.success.apply(this);
		}

	});

});