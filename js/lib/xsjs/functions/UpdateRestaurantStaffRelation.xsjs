var conn = $.db.getConnection();
var restaurantStaffRelation = JSON.parse($.request.body.asString());

if (restaurantStaffRelation.Add) {
	var insertRestaurantStaffStmt = conn.prepareStatement(
		`INSERT INTO "restaurants.db::RestaurantsContext.RestaurantStaff" values (?,?)`
	);
	insertRestaurantStaffStmt.setInteger(1, restaurantStaffRelation.RestaurantId);
	insertRestaurantStaffStmt.setInteger(2, restaurantStaffRelation.StaffId);
	insertRestaurantStaffStmt.executeUpdate();
	insertRestaurantStaffStmt.close();
} else {
	var deleteRestaurantRelationsStmt = conn.prepareStatement(
		`DELETE FROM "restaurants.db::RestaurantsContext.RestaurantStaff" WHERE "Staff.StaffId" = ?`
	);
	deleteRestaurantRelationsStmt.setInteger(1, restaurantStaffRelation.StaffId);
	deleteRestaurantRelationsStmt.executeUpdate();
	deleteRestaurantRelationsStmt.close();
}

conn.commit();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify(restaurantStaffRelation));