import { sendEmail } from "../../../utils/sendEmail";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // get data from request body

    // get headers from request. If text, convert to JSON
    const headers = JSON.stringify(req.headers);

    const data = JSON.stringify(req.body);

    // comsole log data

    // send data by email

    await sendEmail(data, headers);

    res.status(200).json({ message: "POST request received", data: data });
  } else {
    // if GET request
    // send data by email
    res.status(200).json({ message: "GET request received" });
  }
}
