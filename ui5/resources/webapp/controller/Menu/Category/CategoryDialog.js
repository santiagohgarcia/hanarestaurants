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
				ctx = this._dialog.getModel().createEntry("/Categories", {
					properties: {
						RestaurantId: ctx.RestaurantId,
						"ParentCategory.CategoryId": ctx["ParentCategory.CategoryId"]
					}
				});
			}
			this._view.byId("iconList").getBinding("items").refresh();
			return ctx;
		},

		getFieldGroup: function() {
			return "categoryFields";
		},

		onIconSelectionChange: function(evt) {
			var icon = evt.getSource().getSelectedItem().getBindingContext().getObject();
			this._dialog.getModel().setProperty("Icon.IconId", icon.IconId, this._dialog.getBindingContext());
		},
		
		onIconListUpdateFinish: function(evt){
			var currentIconId = this._dialog.getBindingContext().getProperty("Icon.IconId");
			var iconList = this._view.byId("iconList")
			var selItem = iconList.getItems().find( i => i.getBindingContext().getProperty("IconId") === currentIconId );
			iconList.setSelectedItem(selItem);
		},

		success: function() {
			var categoryCtx = this._dialog.getBindingContext();
			BaseController.prototype.showMessageToast("CategorySaved", [categoryCtx.getProperty("CategoryId")]);
			BaseDialog.prototype.success.apply(this);
		}

	});

});