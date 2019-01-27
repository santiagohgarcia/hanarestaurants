sap.ui.define([
	"sap/ui/base/ManagedObject", "restaurants/ui5/utils/Validator"
], function(ManagedObject, Validator) {
	"use strict";
	return ManagedObject.extend("restaurants.ui5.controller.BaseDialog", {
		constructor: function(view) {
			this._view = view;
		},
		exit: function() {
			delete this._view;
		},
		open: function(ctx) {
			this._dialog = this._view.byId(this.getDialogId());
			if (!this._dialog) {
				this._dialog = sap.ui.xmlfragment(this._view.getId(), this.getFragmentId(), this);
				this._view.addDependent(this._dialog);
			}
			ctx = this.getNewContext(ctx);
			this._dialog.setBindingContext(ctx, "restaurants");
			// forward compact/cozy style into dialog
			jQuery.sap.syncStyleClass(this._view.getController().getOwnerComponent().getContentDensityClass(), this._view, this._dialog);
			this._dialog.open();
			return new Promise((res) => this._openPromRes = res);
		},
		onSave: function() {
			var restaurantModel = this._dialog.getModel("restaurants");
			if (Validator.isValid(this.getFieldGroup(), this._dialog)) {
				if (restaurantModel.hasPendingChanges()) {
					this._dialog.setBusy(true);
					restaurantModel.submitChanges({
						success: this.success.bind(this)
					});
				} else {
					this.onCloseDialog();
				}
			}
		},
		success: function() {
			this._dialog.setBusy(false)
				.getModel("restaurants").refresh();
			this._openPromRes(this._dialog.getBindingContext("restaurants").getObject());
			this.onCloseDialog();
		},
		onCloseDialog: function() {
			var ctx = this._dialog.getBindingContext("restaurants");
			var restaurantModel = this._dialog.getModel("restaurants");
			if (ctx.bCreated) {
				restaurantModel.deleteCreatedEntry(ctx);
			} else {
				restaurantModel.resetChanges();
			}
			this._dialog.close();
		}
	});
});