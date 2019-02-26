/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values (?,?,
		(SELECT IFNULL(MAX("RestaurantOrderItemId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.RestaurantOrderItem" WHERE "RestaurantId" = ? and "RestaurantOrderId" = ?)
		,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantOrderId);
	pStmt.setInteger(3, newObject.RestaurantId);
	pStmt.setInteger(4, newObject.RestaurantOrderId);
	pStmt.setInteger(5, newObject.Product);
	pStmt.setString(6, newObject.ProductDescription);
	pStmt.setInteger(7, newObject.Quantity);
	pStmt.setDecimal(8, newObject.Quantity * newObject.UnitPrice);
	pStmt.setDecimal(9, newObject.UnitPrice);
	pStmt.executeUpdate();
	pStmt.close();
}