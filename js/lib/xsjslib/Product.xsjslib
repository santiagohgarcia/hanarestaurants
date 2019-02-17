/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.ProductId);
	pStmt.setInteger(3, newObject["Category.CategoryId"]);
	pStmt.setString(4, newObject.Description);
	pStmt.setDecimal(5, newObject.Price);
	pStmt.setInteger(6, newObject.NeedPreparation || 0);
	pStmt.executeUpdate();
	pStmt.close();
}
