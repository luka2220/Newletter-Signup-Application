const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

// Global app variables
const app = express();
const PORT = process.env.PORT || 3000;

// Mounting specified middleware functions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home route http GET method
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

// Home route http POST method
app.post("/", (req, res) => {
  // Storing requests form data
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // Creating user data object
  const userData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // Converting userData to json
  const userDataJSON = JSON.stringify(userData);

  // Making POST request to mailchimp api
  const url = "https://us18.api.mailchimp.com/3.0/lists/597cc185bc";
  const options = {
    method: "POST",
    auth: "luka2220:8648b98db04534ff24ea63ee5bbba424-us18"
  };

  const postRequest = https.request(url, options, (apiRes) => {
    // Checking response code
    if (apiRes.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    // Get response data
    apiRes.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  // Sending the use data to the mailchimp server
  postRequest.write(userDataJSON);
  postRequest.end();
});

// Failure page POST method
app.post("/failure", (req, res) => {
  //redirect user to home route
  res.redirect("/");
})

// Listening for connection on port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});