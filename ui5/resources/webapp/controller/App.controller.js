sap.ui.define([
	"restaurants/ui5/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("restaurants.ui5.controller.App", {
		onInit: function() {
			//this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});