import { heartRateLogic } from "../../../public/utils/heartRateLogic";

export default async function handler(req, res) {
  const axios = require("axios").default;
  if (req.method === "POST") {
    // get data from iPhone health from POST request body
    const { data } = req.body;

    // for now, use sampleData json from the same folder as this file

    /// test data
    const sampleData = require("./sampleData.json");
    const alertData = require("./alertData.json");
    /// end of test data

    const isOk = await heartRateLogic(alertData);

    if (isOk === true) {
      res.status(200).json({ message: "Heart rate was within bounds" });
    }
    if (isOk === null) {
      res
        .status(200)
        .json({ message: "The POST request body was empty", isOk: null });
    }
    if (isOk === false) {
      const PAGERDUTY_API_KEY = process.env.PAGERDUTY_API_KEY;

      const options = {
        method: "POST",
        url: "https://api.pagerduty.com/incidents",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.pagerduty+json;version=2",
          From: "",
          Authorization: `Token token=${PAGERDUTY_API_KEY}`,
          //Authorization: "Token token=y_NbAkKc66ryYTWUXYEu", // this is correct for testing
        },
        data: {
          incident: {
            type: "incident",
            title:
              "In the last 5 minutes, Mikes heart went below 40, or his heart went over 175. Call him immediately.",
            service: {
              id: process.env.PAGERDUTY_SERVICE_ID,
              type: "service",
            },
          },
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // check if response is 201

          res.status(200).json({
            message:
              "Heart rate was OUT OF BOUNDS. Pagerduty notified successfully",
          });
        })
        .catch(function (error) {
          console.error(error.message);

          res.status(400).json({
            message:
              "Heart rate was OUT OF BOUNDS. Pagerduty notification failed.",
          });
        });
    }

    console.log("isOk", isOk);
  } else {
    res.status(200).json({ message: "Did not receive POST request" });
  }
}
