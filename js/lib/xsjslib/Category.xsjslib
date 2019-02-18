/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,(SELECT IFNULL(MAX("CategoryId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.Category" WHERE "RestaurantId" = ?) ,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantId);
	pStmt.setString(3, newObject.Description);
	if (newObject["ParentCategory.CategoryId"]) {
		pStmt.setInteger(4, newObject["ParentCategory.CategoryId"]);
	} else {
		pStmt.setNull(4, null);
	}

	pStmt.executeUpdate();
	pStmt.close();
}