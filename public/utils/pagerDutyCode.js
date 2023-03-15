import axios from "axios";

export const triggerPagerDuty = async (res) => {
  const options = {
    method: "POST",
    url: "https://api.pagerduty.com/incidents",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.pagerduty+json;version=2",
      From: "",
      Authorization: `Token token=${process.env.PAGERDUTY_API_KEY}`,

      //Authorization: "Token token=u+_XG8nBa9JqCu3GzcJQ",
    },
    data: {
      incident: {
        type: "incident",
        title:
          //   "In the last 5 minutes, Mike's heart went below 40, or his heart went over 175. Call him immediately.",
          "Testing pagerduty",
        service: {
          id: process.env.PAGERDUTY_SERVICE_ID,

          type: "service",
        },
      },
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      // check if response is 201
      console.log("response data", response.data);

      res.status(200).json({
        message:
          "Heart rate was OUT OF BOUNDS. Pagerduty notified successfully",
        isOk: false,
      });
    })
    .catch(function (error) {
      console.error("pagerduty error:", error.message);
      const isAPIKeyOk = process.env.PAGERDUTY_API_KEY !== undefined;
      const isServieKeyOk = process.env.PAGERDUTY_SERVICE_ID !== undefined;

      // check if env variables are being read properly

      res.status(400).json({
        message:
          "Heart rate was OUT OF BOUNDS. However, Pagerduty notification failed.",
        pagerdutyError: error.message,
        apiKeys: "Api key: " + isAPIKeyOk + ". Service key: " + isServieKeyOk,

        isOk: false,
      });
    });
};
