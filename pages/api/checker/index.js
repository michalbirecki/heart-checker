import { heartRateLogic } from "../../../public/utils/heartRateLogic";
import { sendEmail } from "../../../public/utils/sendEmail";

export default async function handler(req, res) {
  const axios = require("axios").default;

  let sampleData = require("./sampleData.json");

  if (req.method === "POST") {
    // get data from iPhone health from POST request body
    console.log("req.method", req.method);
    // console.log("req", req);
    const data = req.body;
    // const data = sampleData;

    console.log("data from POST request", data);

    // psre json data

    await sendEmail(data, req.headers);
    const isOk = await heartRateLogic(data);

    if (isOk === true) {
      res.status(200).json({ message: "Heart rate was within bounds" });
    }
    if (isOk === null) {
      res.status(200).json({
        message: "There was an error somwhere in the function heartRateLogic",
        isOk: isOk,
      });
    }
    if (isOk === false) {
      const options = {
        method: "POST",
        url: "https://api.pagerduty.com/incidents",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.pagerduty+json;version=2",
          From: "",
          Authorization: `Token token=${process.env.PAGERDUTY_API_KEY}`,
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

    res.status(500).json({ message: isOk });

    console.log("isOk", isOk);
  } else {
    res.status(200).json({ message: "Did not receive POST request" });
  }
}
