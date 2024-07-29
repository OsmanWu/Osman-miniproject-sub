const connection = require("../db");
const express = require("express");
const router = express.Router();

// Route to render the profile page with options
router.get("/profile", (req, res) => {
    res.render("profile", {
      title: "Profile",
      user: null,
      showCreateForm: false,
      showViewForm: false,
      showBookingForm: false,
      flightBookings: [],
      hotelBookings: [],
    });
});

// Route to handle form submission and create user profile
router.post("/profile", (req, res) => {
    const { username, email, first_name, last_name, password, phone_number } = req.body;

    // Insert user profile into the database
    const query = "INSERT INTO users (username, email, first_name, last_name, password, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, [username, email, first_name, last_name, password, phone_number], (error, results) => {
        if (error) throw error;
        res.render("profile", {
          title: "Profile",
          user: { username, email, first_name, last_name, phone_number },
          showCreateForm: false,
          showViewForm: false,
          showBookingForm: false,
          flightBookings: [],
          hotelBookings: [],
        });
    });
});

// Route to handle viewing user profile
router.get("/profile/view", (req, res) => {
    const { username } = req.query;

    // Retrieve user profile from the database
    const query = "SELECT * FROM users WHERE username = ?";
    connection.query(query, [username], (error, results) => {
        if (error) throw error;
        const user = results.length > 0 ? results[0] : null;
        res.render("profile", {
          title: "Profile",
          user,
          showCreateForm: false,
          showViewForm: false,
          showBookingForm: false,
          flightBookings: [],
          hotelBookings: [],
        });
    });
});

// Route to handle viewing user bookings
router.get("/profile/view-bookings", (req, res) => {
    const { username } = req.query;

    // Retrieve user flight bookings from the database
    const flightQuery = `SELECT f.airline, f.flight_number, f.departure_airport, f.arrival_airport, f.departure_time, f.arrival_time, b.seat_number, bk.total_price
                         FROM flight_bookings b
                         JOIN flights f ON b.flight_id = f.flight_id
                         JOIN bookings bk ON b.booking_id = bk.booking_id
                         WHERE bk.user_id = (SELECT user_id FROM users WHERE username = ?)`;
    connection.query(flightQuery, [username], (flightError, flightResults) => {
        if (flightError) throw flightError;

        // Retrieve user hotel bookings from the database
        const hotelQuery = `SELECT h.hotel_name, r.room_type, b.check_in_date, b.check_out_date, b.num_guests, bk.total_price
                            FROM hotel_bookings b
                            JOIN hotels h ON b.hotel_id = h.hotel_id
                            JOIN rooms r ON b.room_id = r.room_id
                            JOIN bookings bk ON b.booking_id = bk.booking_id
                            WHERE bk.user_id = (SELECT user_id FROM users WHERE username = ?)`;
        connection.query(hotelQuery, [username], (hotelError, hotelResults) => {
            if (hotelError) throw hotelError;

            res.render("profile", {
              title: "View Bookings",
              user: null,
              flightBookings: flightResults,
              hotelBookings: hotelResults,
              showCreateForm: false,
              showViewForm: false,
              showBookingForm: false,
            });
        });
    });
});

// Route to delete user profile
router.post("/profile/delete", (req, res) => {
    const { username } = req.body;
    
    const deleteUserQuery = "DELETE FROM users WHERE username = ?";
    connection.query(deleteUserQuery, [username], (error, results) => {
        if (error) throw error;
        res.send("Profile deleted successfully!");
    });
});

// Route to delete user bookings
router.post("/profile/delete-bookings", (req, res) => {
    const { username } = req.body;

    // First, find the user_id based on username
    const userQuery = "SELECT user_id FROM users WHERE username = ?";
    connection.query(userQuery, [username], (error, userResults) => {
        if (error) throw error;

        if (userResults.length === 0) {
            res.send("User not found");
            return;
        }

        const user_id = userResults[0].user_id;

        // Delete flight bookings
        const deleteFlightBookingsQuery = "DELETE FROM flight_bookings WHERE booking_id IN (SELECT booking_id FROM bookings WHERE user_id = ?)";
        connection.query(deleteFlightBookingsQuery, [user_id], (flightError, flightResults) => {
            if (flightError) throw flightError;

            // Delete hotel bookings
            const deleteHotelBookingsQuery = "DELETE FROM hotel_bookings WHERE booking_id IN (SELECT booking_id FROM bookings WHERE user_id = ?)";
            connection.query(deleteHotelBookingsQuery, [user_id], (hotelError, hotelResults) => {
                if (hotelError) throw hotelError;

                // Delete from bookings table
                const deleteBookingsQuery = "DELETE FROM bookings WHERE user_id = ?";
                connection.query(deleteBookingsQuery, [user_id], (bookingError, bookingResults) => {
                    if (bookingError) throw bookingError;

                    res.send("All bookings deleted successfully!");
                });
            });
        });
    });
});

module.exports = router;
