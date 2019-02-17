/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,(SELECT IFNULL(MAX("RestaurantTableId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.RestaurantTable" WHERE "RestaurantId" = ?) ,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantId);
	pStmt.setInteger(3, newObject.Capacity);
	pStmt.executeUpdate();
	pStmt.close();
}
