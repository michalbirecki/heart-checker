import dayjs from "dayjs";

const parseDates = (data) => {
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);

  const splitData = data.split("\n");

  const dayJSObject = splitData.map((date) => {
    const betterString = date.replace("at", "");

    // 'Feb 13, 2023  12:27 AM'
    const dayJSDate = dayjs(betterString, "MMM D, YYYY hh:mm A");

    return dayJSDate;
  });

  return dayJSObject;
};

const parsedHeartRates = (data) => {
  const heartRates = data.split("\n");
  // convert heartRates to numbers
  const parsedHeartRates = heartRates.map((rate) => {
    return parseInt(rate);
  });

  return parsedHeartRates;
};

const combinedObject = (data) => {
  // console.log("should work with 2", data.date);
  // console.log("should work with 1", data.date[0]);

  const datesArray = parseDates(data.date);

  const heartArray = parsedHeartRates(data.heart);

  // get datesArray and heartArray and combine into one array of objects, in format {'date': '2021-02-13 12:02 AM', 'heartRate': 60}

  const combinedArray = datesArray.map((date, index) => {
    return { date: date, heartRate: heartArray[index] };
  });

  return combinedArray;
};

const lateFiveMinutesData = (data) => {
  var minMax = require("dayjs/plugin/minMax");
  dayjs.extend(minMax);
  const filteredData = (data) => {
    const latestDate = dayjs.max(data.map((item) => item.date));

    const fiveMinutesAgo = latestDate.subtract(5, "minute");
    const filtered = data.filter((item) => {
      return item.date.isAfter(fiveMinutesAgo);
    });
    return filtered;
  };

  return filteredData(data);
};

const checkSingleHeartRate = (item) => {
  const maxHeartRate = 175;
  const minHeartRate = 40;

  const isOk = item.heartRate >= minHeartRate && item.heartRate <= maxHeartRate;

  return isOk;
};

const checkAllHeartRates = (data) => {
  // gets single object and checks if heart rate is inside range

  // if data is [] return message
  if (data.length === 0) {
    return { message: "Data received, but none for the last 5 minutes" };
  }

  const allHeartRates = data.map((item) => {
    return checkSingleHeartRate(item);
  });

  const allOk = allHeartRates.every((item) => item === true);

  return allOk;
};

// If body data is not corerct, return null
export const heartRateLogic = (realData) => {
  if (
    realData?.length === 0 ||
    realData === undefined ||
    realData === null ||
    realData === "" ||
    realData == {}
  ) {
    return null;
  }

  // make data intop properly configured JSON
  let properJSON;
  try {
    properJSON = combinedObject(realData);
  } catch (error) {
    return { error: "error parsing data in function combinedObject" };
  }

  // filter data where dates are less than five minutes from latest one
  let filteredData;

  try {
    filteredData = lateFiveMinutesData(properJSON);
  } catch (error) {
    return { error: "error filtering data in function lateFiveMinutesData" };
  }

  let isEverythingOk;

  try {
    // Run logic to check if heart rate is within range
    isEverythingOk = checkAllHeartRates(filteredData);
  } catch (error) {
    return {
      error: "error checking heart rates in function checkAllHeartRates",
    };
  }

  return isEverythingOk;
};
