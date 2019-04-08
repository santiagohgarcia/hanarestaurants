sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(ManagedObject) {
	"use strict";
	return ManagedObject.extend("restaurants.ui5.controller.BaseDialog", {
		constructor: function(view) {
			this._view = view;
		},
		exit: function() {
			delete this._view;
		},
		open: function(ctx) {
			this._dialog = this._view.byId("messageDialog");
			if (!this._dialog) {
				this._dialog = sap.ui.xmlfragment(this._view.getId(), "restaurants.ui5.view.MessageDialog", this);
				this._view.addDependent(this._dialog);
			}
			jQuery.sap.syncStyleClass(this._view.getController().getOwnerComponent().getContentDensityClass(), this._view, this._dialog);
			this._dialog.open();
		},
		
		onCloseDialog: function() {
			this._dialog.close();
		}
	});
});