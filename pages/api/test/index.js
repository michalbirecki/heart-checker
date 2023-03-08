// import { json } from "micro";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body;
      console.log("Request body:", body);
      res.status(200).send("Success");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error");
    }
  } else {
    res.status(404).send("Not found");
  }
}
