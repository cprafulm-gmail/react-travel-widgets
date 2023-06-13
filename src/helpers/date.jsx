import moment from "moment";
import * as Global from "./global";

const shortDate = "DD-MM-YYYY";
const longDate = "DD MMM YYYY";
const shortTime = "HH:mm";
const shortTimeampm = "HH:mm A";

const Datecomp = ({ date, format, add }) => {
  if (format === "shortDate") format = shortDate;
  else if (format === "longDate") format = longDate;
  else if (format === "shortTime") format = shortTime;
  else if (format === "shortTimeampm") format = shortTimeampm;
  date = add
    ? format
      ? moment(date)
        .add(add, "days")
        .format(format)
      : moment(date)
        .add(add, "days")
        .format(Global.getEnvironmetKeyValue("DisplayDateFormate"))
    : format
      ? moment(date).format(format)
      : moment(date).format(Global.getEnvironmetKeyValue("DisplayDateFormate"));
  return date;
};

export default Datecomp;
