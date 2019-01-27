sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController"
], function(BaseDialog, BaseController) {
	"use strict";

	return BaseDialog.extend("restaurants.ui5.controller.Restaurants.RestaurantDialog", {

        
        getDialogId: function() {
			return "restaurantDialog";
		},

		getFragmentId: function() {
			return "restaurants.ui5.view.Restaurants.RestaurantDialog";
		},

		getNewContext: function(ctx) {
            if (!ctx) {
				ctx = this._dialog.getModel("restaurants").createEntry("/Restaurants", {
					properties: {
						RestaurantId: -1
					}
				});
			}
			return ctx;
		},

		getFieldGroup: function() {
			return "restaurantFields";
		},

		success: function() {
			var restaurantCtx = this._dialog.getBindingContext("restaurants");
			BaseController.prototype.showMessageToast("RestaurantDialog_RestaurantSaved", [restaurantCtx.getProperty("RestaurantId")]);
            BaseDialog.prototype.success.apply(this);
		}
    
	});

});