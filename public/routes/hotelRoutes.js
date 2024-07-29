const connection = require("../db");
const express = require("express");
const router = express.Router();

// Assuming body-parser and other necessary middleware are already used
router.get("/hotels", (req, res) => {
    res.render("layout", {
      title: "Book Hotels",
      body: `
              <h1>Book Your Hotel</h1>
              <form action="/hotels/search" method="POST">
                  <label for="destination">Destination:</label>
                  <input type="text" id="destination" name="destination">
                  <button type="submit">Search</button>
              </form>
              <div>
                  <h2>Hotel Results</h2>
                  <!-- Hotel listings will be displayed here -->
              </div>
          `,
    });
  });
  // HOTEL SEARCH RESULT
  router.post("/hotels/search", (req, res) => {
    const destination = req.body.destination;
  
    // MySQL query to fetch hotels based on destination
    const query = `SELECT * FROM hotels WHERE location = ?`;
    connection.query(query, [destination], (error, results) => {
      if (error) {
        throw error;
      }
      res.render("layout", {
        title: "Book Hotels",
        body: `
            <h1>Book Your Hotel</h1>
            <form action="/hotels/search" method="POST">
              <label for="destination">Destination:</label>
              <input type="text" id="destination" name="destination" value="${destination}">
              <button type="submit">Search</button>
            </form>
            <div>
              <h2>Hotel Results</h2>
              <table>
                <tr>
                  <th>Hotel Name</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Amenities</th>
                  <th>Price Per Night</th>
                  <th>Available Rooms</th>
                  <th>Action</th>
                </tr>
                ${results
                  .map(
                    (hotel) => `
                  <tr>
                    <td>${hotel.hotel_name}</td>
                    <td>${hotel.location}</td>
                    <td>${hotel.rating}</td>
                    <td>${hotel.amenities}</td>
                    <td>${hotel.price_per_night}</td>
                    <td>${hotel.available_rooms}</td>
                    <td>
                      <form action="/hotels/book" method="POST">
                        <input type="hidden" name="hotel_id" value="${hotel.hotel_id}">
                        <button type="submit">Book Now</button>
                      </form>
                      <form action="/hotels/view" method="GET">
                        <input type="hidden" name="hotel_id" value="${hotel.hotel_id}">
                        <button type="submit">View More</button>
                      </form>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
          `,
      });
    });
  });
  
  // HOTEL BOOKING FORM
  router.post("/hotels/book", (req, res) => {
    const hotel_id = req.body.hotel_id;
  
    res.render("layout", {
      title: "Confirm Booking",
      body: `
              <h1>Confirm Your Booking</h1>
              <form action="/hotels/confirm-booking" method="POST">
                  <input type="hidden" name="hotel_id" value="${hotel_id}">
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username" required>
                  <label for="check_in_date">Check-In Date:</label>
                  <input type="date" id="check_in_date" name="check_in_date" required>
                  <label for="check_out_date">Check-Out Date:</label>
                  <input type="date" id="check_out_date" name="check_out_date" required>
                  <label for="num_guests">Number of Guests:</label>
                  <input type="number" id="num_guests" name="num_guests" required>
                  <button type="submit">Confirm Booking</button>
              </form>
          `,
    });
  });
  
  // HOTEL BOOKING CONFIRMATION
  router.post("/hotels/confirm-booking", (req, res) => {
    const { hotel_id, username, check_in_date, check_out_date, num_guests } =
      req.body;
  
    const userQuery = `SELECT user_id FROM users WHERE username = ?`;
    connection.query(userQuery, [username], (error, userResults) => {
      if (error) {
        throw error;
      }
      if (userResults.length === 0) {
        res.send("User not found");
        return;
      }
  
      const user_id = userResults[0].user_id;
      const bookingReference = `HOTEL-${Date.now()}`;
      const bookingDate = new Date();
      const status = "confirmed";
  
      const hotelQuery = `SELECT price_per_night FROM hotels WHERE hotel_id = ?`;
      connection.query(hotelQuery, [hotel_id], (error, hotelResults) => {
        if (error) {
          throw error;
        }
  
        const total_price =
          hotelResults[0].price_per_night *
          ((new Date(check_out_date) - new Date(check_in_date)) /
            (1000 * 60 * 60 * 24));
  
        const bookingInsertQuery = `
                    INSERT INTO bookings (user_id, booking_type, booking_reference, booking_date, status, total_price)
                    VALUES (?, 'hotel', ?, ?, ?, ?)
                `;
        connection.query(
          bookingInsertQuery,
          [user_id, bookingReference, bookingDate, status, total_price],
          (error, bookingResults) => {
            if (error) {
              throw error;
            }
  
            const booking_id = bookingResults.insertId;
  
            // Fetch an available room
            const roomQuery = `SELECT room_id FROM rooms WHERE hotel_id = ? LIMIT 1`;
            connection.query(roomQuery, [hotel_id], (error, roomResults) => {
              if (error) {
                throw error;
              }
              if (roomResults.length === 0) {
                res.send("No available rooms for this hotel");
                return;
              }
  
              const room_id = roomResults[0].room_id;
  
              const hotelBookingInsertQuery = `
                            INSERT INTO hotel_bookings (booking_id, hotel_id, room_id, check_in_date, check_out_date, num_guests)
                            VALUES (?, ?, ?, ?, ?, ?)
                        `;
              connection.query(
                hotelBookingInsertQuery,
                [
                  booking_id,
                  hotel_id,
                  room_id,
                  check_in_date,
                  check_out_date,
                  num_guests,
                ],
                (error) => {
                  if (error) {
                    throw error;
                  }
  
                  // Decrement the available rooms count in the rooms table
                  const updateRoomQuery = `UPDATE rooms SET available_rooms = available_rooms - 1 WHERE room_id = ?`;
                  connection.query(updateRoomQuery, [room_id], (error) => {
                    if (error) {
                      throw error;
                    }
  
                    // Decrement the available rooms count in the hotels table
                    const updateHotelQuery = `UPDATE hotels SET available_rooms = available_rooms - 1 WHERE hotel_id = ?`;
                    connection.query(updateHotelQuery, [hotel_id], (error) => {
                      if (error) {
                        throw error;
                      }
  
                      res.send("Booking confirmed!");
                    });
                  });
                }
              );
            });
          }
        );
      });
    });
  });
  
  router.get("/hotels/view", (req, res) => {
    const hotel_id = req.query.hotel_id;
  
    const hotelQuery = `SELECT * FROM hotels WHERE hotel_id = ?`;
    const reviewsQuery = `SELECT * FROM reviews WHERE reference_id = ? AND review_type = 'hotel'`;
  
    connection.query(hotelQuery, [hotel_id], (error, hotelResults) => {
      if (error) {
        throw error;
      }
      connection.query(reviewsQuery, [hotel_id], (error, reviewResults) => {
        if (error) {
          throw error;
        }
        const hotel = hotelResults[0];
        res.render("layout", {
          title: "Hotel Details",
          body: `
              <h1>${hotel.hotel_name}</h1>
              <p>Location: ${hotel.location}</p>
              <p>Rating: ${hotel.rating}</p>
              <p>Amenities: ${hotel.amenities}</p>
              <p>Price Per Night: ${hotel.price_per_night}</p>
              <img src="${hotel.pic_link1}" alt="${hotel.hotel_name} Picture 1">
              <img src="${hotel.pic_link2}" alt="${hotel.hotel_name} Picture 2">
              <h2>Reviews</h2>
              <ul>
                ${reviewResults
                  .map(
                    (review) => `
                  <li>${review.comment} - Rating: ${review.rating}</li>
                `
                  )
                  .join("")}
              </ul>
              <h3>Leave a Review</h3>
              <form action="/hotels/review" method="POST">
                <input type="hidden" name="hotel_id" value="${hotel_id}">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="rating">Rating:</label>
                <input type="number" id="rating" name="rating" min="1" max="5" required>
                <label for="comment">Comment:</label>
                <textarea id="comment" name="comment" required></textarea>
                <button type="submit">Submit Review</button>
              </form>
            `,
        });
      });
    });
  });
  
  // REVIEW ADDITION FROM
  router.post("/hotels/review", (req, res) => {
    const { hotel_id, username, rating, comment } = req.body;
  
    const userQuery = `SELECT user_id FROM users WHERE username = ?`;
    connection.query(userQuery, [username], (error, userResults) => {
      if (error) {
        throw error;
      }
      if (userResults.length === 0) {
        res.send("User not found");
        return;
      }
  
      const user_id = userResults[0].user_id;
      const reviewQuery = `
          INSERT INTO reviews (user_id, review_type, reference_id, rating, comment)
          VALUES (?, 'hotel', ?, ?, ?)
        `;
      connection.query(
        reviewQuery,
        [user_id, hotel_id, rating, comment],
        (error) => {
          if (error) {
            throw error;
          }
          res.redirect(`/hotels/view?hotel_id=${hotel_id}`);
        }
      );
    });
  });

  module.exports = router;
