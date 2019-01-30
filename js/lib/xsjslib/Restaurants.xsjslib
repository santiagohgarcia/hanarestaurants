/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

function trucateAfter(param) {
	var pStmt = param.connection.prepareStatement(`TRUNCATE TABLE "${param.afterTableName}"`);
	pStmt.executeUpdate();
	pStmt.close();
}

function getNewObject(param) {
	//Get New Record
	var pStmt = param.connection.prepareStatement(`select * from "${param.afterTableName}"`);
	var rs = pStmt.executeQuery();
	pStmt.close();
	return rs._rows[0];
}

function getOldObject(param) {
	//Get New Record
	var pStmt = param.connection.prepareStatement(`select * from "${param.beforeTableName}"`);
	var rs = pStmt.executeQuery();
	pStmt.close();
	return rs._rows[0];
}

function RestaurantBeforeCreate(param) {
	var newObject = getNewObject(param);
	trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values("restaurants.db.sequences::restaurantIdSeq".NEXTVAL,?)`);
	pStmt.setString(1, newObject.Name);
	pStmt.executeUpdate();
	pStmt.close();
}

function RestaurantTableBeforeCreate(param) {
	var newObject = getNewObject(param);
	trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,(SELECT IFNULL(MAX("RestaurantTableId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.RestaurantTable" WHERE "RestaurantId" = ?) ,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantId);
	pStmt.setInteger(3, newObject.Capacity);
	pStmt.executeUpdate();
	pStmt.close();
}

function CategoryBeforeCreate(param) {
	var newObject = getNewObject(param);
	trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values(?,(SELECT IFNULL(MAX("CategoryId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.Category" WHERE "RestaurantId" = ?) ,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	pStmt.setInteger(2, newObject.RestaurantId);
	pStmt.setString(3, newObject.Description);
	pStmt.setInteger(4, newObject["ParentCategory.CategoryId"] || 0);
	pStmt.executeUpdate();
	pStmt.close();
}

function ProductBeforeCreate(param) {
	var newObject = getNewObject(param);
	trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}" values((SELECT IFNULL(MAX("ProductId"), 0) + 1 FROM "restaurants.db::RestaurantsContext.Product"),?,?,?,?)`
	);
	pStmt.setString(1, newObject.Description);
	pStmt.setDecimal(2, newObject.Price);
	pStmt.setInteger(3, newObject["Category.CategoryId"]);
	pStmt.setInteger(4, newObject.NeedPreparation || 0);
	pStmt.executeUpdate();
	pStmt.close();
}

function RestaurantOrderBeforeCreate(param) {
	var newObject = getNewObject(param);
	trucateAfter(param);
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
	var newObject = getNewObject(param);

	if (param.beforeTableName) {
		var oldObject = getOldObject(param);
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

function RestaurantOrderItemBeforeCreate(param) {
	var newObject = getNewObject(param);
	trucateAfter(param);
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