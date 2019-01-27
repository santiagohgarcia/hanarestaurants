sap.ui.define([
	"restaurants/ui5/controller/BaseDialog",
	"restaurants/ui5/controller/BaseController"
], function(BaseDialog, BaseController) {
	"use strict";

	return BaseDialog.extend("restaurants.ui5.controller.Tables.TableDialog", {

        
        getDialogId: function() {
			return "tableDialog";
		},

		getFragmentId: function() {
			return "restaurants.ui5.view.Tables.TableDialog";
		},

		getNewContext: function(ctx) {
           if (ctx.RestaurantId) {
				ctx = this._dialog.getModel("restaurants").createEntry("/Tables", {
					properties: {
						RestaurantId: ctx.RestaurantId
					}
				});
			}
			return ctx;
		},

		getFieldGroup: function() {
			return "tableFields";
		},

		success: function() {
			var tableCtx = this._dialog.getBindingContext("restaurants");
            BaseController.prototype.showMessageToast("TableDialog_TableSaved", [tableCtx.getProperty("RestaurantTableId")]);
            BaseDialog.prototype.success.apply(this);
		}
        

	});

});