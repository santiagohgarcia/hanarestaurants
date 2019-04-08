/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";
var utils = $.require("./utils.js");
var messaging = $.import("xsjslib", "messaging");

function BeforeCreate(param) {
	var newObject = utils.getNewObject(param);
	utils.trucateAfter(param);
	var pStmt = param.connection.prepareStatement(
		`insert into "${param.afterTableName}"
		("RestaurantId","RestaurantOrderId","Status.StatusId","Customer.CustomerId","CreatedAt","PaymentMethod.PaymentMethodId")
		values (?,?,?,?,?,?)`
	);
	pStmt.setInteger(1, newObject.RestaurantId);
	//pStmt.setInteger(2, newObject.RestaurantTableId || 0);
	pStmt.setInteger(2, newObject.RestaurantOrderId);
	pStmt.setString(3, newObject["Status.StatusId"] || 'PENDING'); //PENDING

	if (newObject["Customer.CustomerId"]) {
		pStmt.setString(4, newObject["Customer.CustomerId"]);
	} else {
		pStmt.setNull(4, null); //Anonym
	}

	pStmt.setTimestamp(5, new Date());
	pStmt.setString(6, newObject["PaymentMethod.PaymentMethodId"] || 'CASH'); //CASH
	pStmt.executeUpdate();
	pStmt.close();
}

function AfterCreateOrModif(param) {
	var newOrder = utils.getNewObject(param),
		oldOrder = utils.getOldObject(param),
		customerId = newOrder["Customer.CustomerId"],
		baseMessage = {
			message: {
				data: {
					Status: String(newOrder["Status.StatusId"]),
					RestaurantId: String(newOrder.RestaurantId),
					RestaurantOrderId: String(newOrder.RestaurantOrderId)
				}
			}
		};

	//Send message to customer if the order is ready
	if (customerId) {
		var getCustomerStmt = param.connection.prepareStatement(
			`SELECT * FROM "restaurants.db::RestaurantsContext.Customer" WHERE "CustomerId" = ?`
		);
		getCustomerStmt.setString(1, customerId);

		var customerResult = getCustomerStmt.executeQuery();
		customerResult.next();
		var customer = customerResult._row;

		var customerMessage = JSON.parse(JSON.stringify(baseMessage));
		customerMessage.message.token = customer.MessagingToken;
		messaging.sendFcmMessage(customerMessage);
	}

	var restaurantMessage = JSON.parse(JSON.stringify(baseMessage));
	restaurantMessage.message.topic = "restaurant-" + newOrder.RestaurantId;
	messaging.sendFcmMessage(restaurantMessage);

}