const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mysql = require("mysql2");

const profileRoute = require("./public/routes/profileRoutes");
const hotelRoute = require("./public/routes/hotelRoutes");
const flightsRoute = require("./public/routes/flightRoutes");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Home route
app.get('/', (req, res) => {
  res.render('layout', {
      title: 'Welcome to TravelApp!',
      body: `
          <h1>Welcome to TravelApp!</h1>
          <section>
              <form action="/flights" method="get">
                  <button type="submit">Search Flights</button>
              </form>
              <form action="/hotels" method="get">
                  <button type="submit">Search Hotels</button>
              </form>
          </section>
          <section>
              <h2>Promotional Banners</h2>
              <div id="promotions">
                  <div class="carousel">
                      <img src="/images/banner.png" alt="Promo Banner">
                  </div>
              </div>
          </section>
          <section>
              <h2>Popular Destinations</h2>
              <div id="destinations">
                  <div>
                      <img src="/images/hk.png" alt="Destination 1">
                      <p>Hong Kong</p>
                  </div>
                  <div>
                      <img src="/images/tw.png" alt="Destination 2">
                      <p>Taiwan</p>
                  </div>
                  <div>
                      <img src="/images/jp.png" alt="Destination 3">
                      <p>Japan</p>
                  </div>
                  <div>
                      <img src="/images/UK.png" alt="Destination 4">
                      <p>UK</p>
                  </div>
              </div>
          </section>
      `
  });
});

app.use("", flightsRoute);
app.use("", hotelRoute);
app.use("", profileRoute);

// Support route
app.get("/support", (req, res) => {
  res.render("support"); // Render the support view
});

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_C207',
    database: 'travelweb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = connection;
