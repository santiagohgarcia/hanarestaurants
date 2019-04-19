sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
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

		onNavBack: async function(evt, defaultNav) {
			var History = await this.requirePromisified("sap/ui/core/routing/History");
			var oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo(defaultNav || "AdminHome", {}, true /*no history*/ );
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

		openMessageDialog: function(response) {
			return this.getOwnerComponent().openMessageDialog();
		},

		showMessageToast: async function(id, args) {
			var MessageToast = await this.requirePromisified("sap/m/MessageToast");
			MessageToast.show(this.getText(id, args), {
				closeOnBrowserNavigation: false
			});
		},

		confirmPopup: function() {
			return new Promise(async (res) => {
				var MessageBox = await this.requirePromisified("sap/m/MessageBox");
				MessageBox.confirm(this.getText("DoYouWantToLosePendingChanges"), {
					onClose: function(action) {
						res(action);
					}
				});
			});
		},

		requirePromisified: async function(dependency) { //TODO: put this ONLY in basecontroller
			return new Promise((res, rej) => {
				sap.ui.require([dependency], function(component) {
					res(component);
				}, function(response) {
					rej(response);
				});
			});
		}
	});
});