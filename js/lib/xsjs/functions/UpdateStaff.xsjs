var conn = $.db.getConnection();
var staff = JSON.parse($.request.body.asString());

//Update Staff
function updateStaff() {
	var staffUpdateStmt = conn.prepareStatement(
		`UPDATE "restaurants.db::RestaurantsContext.Staff"
					 SET "Name" = ?, "LastName" = ?, "Password" = ? WHERE "StaffId" = ? `
	);
	staffUpdateStmt.setString(1, staff.Name);
	staffUpdateStmt.setString(2, staff.LastName);
	staffUpdateStmt.setString(3, staff.Password);
	staffUpdateStmt.setInteger(4, staff.StaffId);
	staffUpdateStmt.executeUpdate();
	staffUpdateStmt.close();
}
//Get new staffg id
function getStaffId() {
	var staffIdStmt = conn.prepareStatement(
		`SELECT (IFNULL(MAX("StaffId"), 0) + 1) as "StaffId" FROM "restaurants.db::RestaurantsContext.Staff"`);
	var resultSet = staffIdStmt.executeQuery();
	staffIdStmt.close();
	return Number(resultSet._rows[0].StaffId);
}
//Insert staff
function insertStaff() {

	var staffInsertStmt = conn.prepareStatement(
		`insert into "restaurants.db::RestaurantsContext.Staff" values(?,?,?,?,?)`
	);
	staffInsertStmt.setInteger(1, staff.StaffId);
	staffInsertStmt.setString(2, staff.Name);
	staffInsertStmt.setString(3, staff.LastName);
	staffInsertStmt.setString(4, staff.UserId);
	staffInsertStmt.setString(5, staff.Password);
	staffInsertStmt.executeUpdate();
	staffInsertStmt.close();
}
//Delete current relations
function deleteStaffRestaurantRelations() {

	var deleteRestaurantRelationsStmt = conn.prepareStatement(
		`DELETE FROM "restaurants.db::RestaurantsContext.RestaurantStaff" WHERE "Staff.StaffId" = ?`
	);
	deleteRestaurantRelationsStmt.setInteger(1, staff.StaffId);
	deleteRestaurantRelationsStmt.executeUpdate();
	deleteRestaurantRelationsStmt.close();
}
//Insert new Relations
function insertNewRestaurantRelations() {
	staff.Restaurants.forEach(restaurantId => {
		var insertRestaurantStaffStmt = conn.prepareStatement(
			`INSERT INTO "restaurants.db::RestaurantsContext.RestaurantStaff" values (?,?)`
		);
		insertRestaurantStaffStmt.setInteger(1, restaurantId);
		insertRestaurantStaffStmt.setInteger(2, staff.StaffId);
		insertRestaurantStaffStmt.executeUpdate();
		insertRestaurantStaffStmt.close();
	});
}

//
// MAIN
//
//If staff is created update else insert
if (staff.StaffId) {
	updateStaff();
} else {
	staff.StaffId = getStaffId();
	insertStaff();
}
deleteStaffRestaurantRelations();
insertNewRestaurantRelations();
conn.commit();

$.response.contentType = "text/json";
$.response.setBody(JSON.stringify(staff));