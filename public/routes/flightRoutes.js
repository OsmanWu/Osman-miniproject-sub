const connection = require("../db");
const express = require("express");
const router = express.Router();

// Route to render the initial form
router.get("/flights", (req, res) => {
  res.render("layout", {
    title: "Flights",
    body: `
              <h1>Book Your Flight</h1>
              <form action="/flights/search" method="POST">
                  <label for="departure">Departure City:</label>
                  <input type="text" id="departure" name="departure">
                  <label for="arrival">Arrival City:</label>
                  <input type="text" id="arrival" name="arrival">
                  <button type="submit">Search</button>
              </form>
              <div>
                  <h2>Flight Results</h2>
                  <!-- Flight listings will be displayed here -->
              </div>
          `,
  });
});
// // Route to handle form submission and query flights
router.post("/flights/search", (req, res) => {
  const departure = req.body.departure;
  const arrival = req.body.arrival;

  const query = `SELECT * FROM flights WHERE departure_airport = ? AND arrival_airport = ?`;
  connection.query(query, [departure, arrival], (error, results) => {
    if (error) {
      throw error;
    }
    res.render("layout", {
      title: "Flights",
      body: `
                <h1>Book Your Flight</h1>
                <form action="/flights/search" method="POST">
                    <label for="departure">Departure City:</label>
                    <input type="text" id="departure" name="departure" value="${departure}">
                    <label for="arrival">Arrival City:</label>
                    <input type="text" id="arrival" name="arrival" value="${arrival}">
                    <button type="submit">Search</button>
                </form>
                <div>
                    <h2>Flight Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Flight Number</th>
                                <th>Airline</th>
                                <th>Departure Airport</th>
                                <th>Arrival Airport</th>
                                <th>Departure Time</th>
                                <th>Arrival Time</th>
                                <th>Price</th>
                                <th>Available Seats</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results
                              .map(
                                (flight) => `
                                <tr>
                                    <td>${flight.flight_number}</td>
                                    <td>${flight.airline}</td>
                                    <td>${flight.departure_airport}</td>
                                    <td>${flight.arrival_airport}</td>
                                    <td>${flight.departure_time}</td>
                                    <td>${flight.arrival_time}</td>
                                    <td>${flight.price}</td>
                                    <td>${flight.available_seats}</td>
                                    <td>
                                        <form action="/flights/book" method="POST">
                                            <input type="hidden" name="flight_id" value="${flight.flight_id}">
                                            <button type="submit">Book Now</button>
                                        </form>
                                    </td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `,
    });
  });
});

// BOOK NOW BUTTON HANDLING
router.post("/flights/book", (req, res) => {
  const flight_id = req.body.flight_id;
  res.render("layout", {
    title: "Enter Username",
    body: `
              <h1>Enter Username</h1>
              <form action="/flights/confirm-booking" method="POST">
                  <input type="hidden" name="flight_id" value="${flight_id}">
                  <label for="username">Username:</label>
                  <input type="text" id="username" name="username" required>
                  <button type="submit">Confirm Booking</button>
              </form>
          `,
  });
});

//booking query api
router.post("/flights/confirm-booking", (req, res) => {
  const flight_id = req.body.flight_id;
  const username = req.body.username;

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
    const bookingReference = `FLIGHT-${Date.now()}`;
    const bookingDate = new Date();
    const status = "confirmed";

    const flightQuery = `SELECT price FROM flights WHERE flight_id = ?`;
    connection.query(flightQuery, [flight_id], (error, flightResults) => {
      if (error) {
        throw error;
      }

      const total_price = flightResults[0].price;

      const bookingInsertQuery = `
                  INSERT INTO bookings (user_id, booking_type, booking_reference, booking_date, status, total_price)
                  VALUES (?, 'flight', ?, ?, ?, ?)
              `;
      connection.query(
        bookingInsertQuery,
        [user_id, bookingReference, bookingDate, status, total_price],
        (error, bookingResults) => {
          if (error) {
            throw error;
          }

          const booking_id = bookingResults.insertId;

          const flightBookingInsertQuery = `
                      INSERT INTO flight_bookings (booking_id, flight_id, seat_number)
                      VALUES (?, ?, ?)
                  `;
          const seat_number = "A1"; // This should be dynamically assigned based on available seats
          connection.query(
            flightBookingInsertQuery,
            [booking_id, flight_id, seat_number],
            (error) => {
              if (error) {
                throw error;
              }

              res.send("Booking confirmed!");
            }
          );
        }
      );
    });
  });
});

module.exports = router;
