/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function ItemBeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values (?,?,?,
		(SELECT IFNULL(MAX("RestaurantOrderItemId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.RestaurantOrderItem" WHERE "RestaurantId" = ? and "RestaurantTableId" = ? and "RestaurantOrderId" = ?)
		,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantTableId || 0);
	pStmt.setInteger(3, newObject.RestaurantOrderId);
	pStmt.setInteger(4, newObject.RestaurantId);
	pStmt.setInteger(5, newObject.RestaurantTableId || 0);
	pStmt.setInteger(6, newObject.RestaurantOrderId);
	pStmt.setInteger(7, newObject.Product);
	pStmt.setString(8, newObject.ProductDescription);
	pStmt.setInteger(9, newObject.Quantity);
	pStmt.setDecimal(10, newObject.Quantity * newObject.UnitPrice);
	pStmt.setDecimal(11, newObject.UnitPrice);
	pStmt.executeUpdate();
	pStmt.close();
}