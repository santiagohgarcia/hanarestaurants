/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");
var sharp = $.require("sharp");

function  BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,?,(SELECT IFNULL(MAX("ProductId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.Product" WHERE "RestaurantId" = ? ),?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject["Category.CategoryId"]);
	pStmt.setInteger(3, newObject.RestaurantId);
	pStmt.setString(4, newObject.Description);
	pStmt.setDecimal(5, newObject.Price);
	pStmt.setInteger(6, newObject.NeedPreparation || 0);
	if (newObject.Image) {
		//var resizedImage = await sharp('input.jpg').resize(200).toBuffer();
		pStmt.setBlob(7, newObject.Image);
	} else {
		pStmt.setNull(7);
	}
	pStmt.setString(8, newObject.Name);

	pStmt.executeUpdate();
	pStmt.close();
}