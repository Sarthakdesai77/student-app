const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

mongoose
  .connect(
    "mongodb+srv://sarthak:K3rhbWfAU10MCbSA@cluster0.ne6rr.mongodb.net/student-app",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));


app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Port running on " + (process.env.PORT || 3000));
});