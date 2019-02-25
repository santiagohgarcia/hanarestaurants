sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(Controller, History, MessageToast) {
	"use strict";
	return Controller.extend("restaurants.ui5.controller.BaseController", {

		onPressHome: function() {
			this.getRouter().navTo("AdminHome");
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel: function(sModelName) {
			return this.getView().getModel(sModelName);
		},

		setModel: function(model, sModelName) {
			return this.getView().setModel(model, sModelName);
		},

		onNavBack: function(defaultNav) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo(defaultNav || "home", {}, true /*no history*/ );
			}
		},

		showBusy: function() {
			sap.ui.core.BusyIndicator.show(0);
		},

		hideBusy: function() {
			sap.ui.core.BusyIndicator.hide(0);
		},

		getText: function(id, args) {
			return sap.ui.getCore().getModel("i18n").getResourceBundle().getText(id, args);
		},

		getMessageManager: function() {
			return sap.ui.getCore().getMessageManager();
		},

		openRestaurantDialog: function(ctx) {
			return this.getOwnerComponent().openRestaurantDialog(ctx);
		},

		openCategoryDialog: function(ctx) {
			return this.getOwnerComponent().openCategoryDialog(ctx);
		},

		openProductDialog: function(ctx) {
			return this.getOwnerComponent().openProductDialog(ctx);
		},

		showMessageToast: function(id, args) {
			MessageToast.show(this.getText(id, args), {
				closeOnBrowserNavigation: false
			});
		}
	});
});