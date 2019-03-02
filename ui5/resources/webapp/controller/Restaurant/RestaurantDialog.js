sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController"
], function(BaseDialog, BaseController) {
	"use strict";

	return BaseDialog.extend("restaurants.ui5.controller.Restaurant.RestaurantDialog", {

        
        getDialogId: function() {
			return "restaurantDialog";
		},

		getFragmentId: function() {
			return "restaurants.ui5.view.Restaurant.RestaurantDialog";
		},

		getNewContext: function(ctx) {
            if (!ctx) {
				ctx = this._dialog.getModel().createEntry("/Restaurants");
			}
			return ctx;
		},

		getFieldGroup: function() {
			return "restaurantFields";
		},

		success: function() {
			var restaurantCtx = this._dialog.getBindingContext();
			BaseController.prototype.showMessageToast("RestaurantSaved", [restaurantCtx.getProperty("RestaurantId")]);
            BaseDialog.prototype.success.apply(this);
		}
    
	});

});