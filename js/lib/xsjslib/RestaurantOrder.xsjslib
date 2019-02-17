/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}"
		("RestaurantId","RestaurantTableId","RestaurantOrderId","Status.StatusId","Customer.CustomerId","ModifiedAt")
		values (?,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantTableId || 0);
	pStmt.setInteger(3, newObject.RestaurantOrderId);
	pStmt.setInteger(4, newObject["Status.StatusId"] || 3); //In Preparation 
	pStmt.setInteger(5, newObject["Customer.CustomerId"] || 0); //Anonym
	pStmt.setTimestamp(6, new Date());
	pStmt.executeUpdate();
	pStmt.close();
}

function RestaurantOrderAfterModif(param) {
	var newObject = utils.getNewObject(param);

	if (param.beforeTableName) {
		var oldObject = utils.getOldObject(param);
	}

	if (!param.beforeTableName || newObject["Status.StatusId"] !== oldObject["Status.StatusId"]) {
		var pStmt = param.connection.prepareStatement('insert into "restaurants.db::RestaurantsContext.OrderStatusHistory" values (?,?,?,?,?)');
		pStmt.setInteger(1, newObject.RestaurantId);
		pStmt.setInteger(2, newObject.RestaurantTableId);
		pStmt.setInteger(3, newObject.RestaurantOrderId);
		pStmt.setInteger(4, newObject["Status.StatusId"]);
		pStmt.setTimestamp(5, new Date());
		pStmt.executeUpdate();
		pStmt.close();
	}

}