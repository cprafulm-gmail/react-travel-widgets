import React, { Component } from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "./../../helpers/global";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.minDays = this.props.minDays;
    this.maxDays = this.props.maxDays;
    this.stayInDays = this.props.stayInDays;
    this.cutOfDays = this.props.cutOfDays;
    this.locale = {
      format: Global.InnerDateFormate,
      applyLabel: Trans("_datePickerApply"),
      cancelLabel: Trans("_datePickerCancel"),
      fromLabel: Trans("_datePickerFrom"),
      toLabel: Trans("_datePickerTo"),
      customRangeLabel: Trans("_datePickerCustom"),
      daysOfWeek: [
        Trans("_datePickerDaySu"),
        Trans("_datePickerDayMo"),
        Trans("_datePickerDayTu"),
        Trans("_datePickerDayWe"),
        Trans("_datePickerDayTh"),
        Trans("_datePickerDayFr"),
        Trans("_datePickerDaySa")
      ],
      monthNames: [
        Trans("_datePickerMonthJanuary"),
        Trans("_datePickerMonthFebruary"),
        Trans("_datePickerMonthMarch"),
        Trans("_datePickerMonthApril"),
        Trans("_datePickerMonthMay"),
        Trans("_datePickerMonthJune"),
        Trans("_datePickerMonthJuly"),
        Trans("_datePickerMonthAugust"),
        Trans("_datePickerMonthSeptember"),
        Trans("_datePickerMonthOctober"),
        Trans("_datePickerMonthNovember"),
        Trans("_datePickerMonthDecember")
      ]
    };
    var inputStart =
      this.props.dates === undefined || (this.props.dates && Object.keys(this.props.dates).length > 0)
        ? moment().add(this.cutOfDays, "days")
        : moment(this.props.dates.checkInDate);
    this.state = {
      minDate: localStorage.getItem("isUmrahPortal") || this.props.isPaperRateMode
        ? moment().add(this.cutOfDays, "days")
        : moment("2001-01-01").format(Global.InnerDateFormate),
      inputStart:
        this.props.dates === undefined
          ? moment().add(this.cutOfDays, "days")
          : moment(this.props.dates.checkInDate),
      inputEnd:
        this.props.dates === undefined
          ? this.props.isSingleDateRangePicker
            ? inputStart
            : moment().add(this.cutOfDays + this.stayInDays, "days")
          : moment(this.props.dates.checkOutDate),
      isShowDropdowns: this.props.isShowDropdowns,
      dayNameStart: moment().add(this.cutOfDays, "days")._locale
        ._weekdays[
        moment()
          .add(this.cutOfDays, "days")
          .toDate()
          .getDay() + ""
      ],
      dayNameEnd: moment().add(
        this.cutOfDays + this.stayInDays,
        "days"
      )._locale._weekdays[
        moment()
          .add(this.cutOfDays + this.stayInDays, "days")
          .toDate()
          .getDay() + ""
      ],
      dateLimit: { days: "60" },
      date: [moment(), moment()],
      isStateUpdateFromThisComponent: false
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleChangeS = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ inputStart: event.target.value });
  };

  handleChangeF = event => {
    this.setState({ inputFinish: event.target.value });
  };

  handleDateChange = (event, picker) => {
    if (event.type === "show") {
      if (picker.singleDatePicker) {
        picker.container.addClass("custom-class-daterangepicker-oneway");
        picker.container.removeClass("custom-class-daterangepicker-roundtrip");
      } else {
        picker.container.addClass("custom-class-daterangepicker-roundtrip");
        picker.container.removeClass("custom-class-daterangepicker-oneway");
      }
    }
    if (
      !picker.singleDatePicker &&
      Global.isSameDayAllow === true &&
      picker.startDate._d.getFullYear() +
      "-" +
      picker.startDate._d.getMonth() +
      "-" +
      picker.startDate._d.getDate() ===
      picker.endDate._d.getFullYear() +
      "-" +
      picker.endDate._d.getMonth() +
      "-" +
      picker.endDate._d.getDate()
    ) {
      picker.endDate = picker.endDate.add(this.stayInDays, 'days')
    }

    if (localStorage.getItem("isUmrahPortal") && (this.props.business !== "air" && this.props.business !== "transportation" && this.props.business !== "groundservice")) {
      var tmpStartDate = moment([picker.startDate._d.getFullYear(), picker.startDate._d.getMonth(), picker.startDate._d.getDate()]);
      var tmpEndDate = moment([picker.endDate._d.getFullYear(), picker.endDate._d.getMonth(), picker.endDate._d.getDate()]);
      if ((tmpEndDate.diff(tmpStartDate, 'days') < this.minDays - 1 || tmpEndDate.diff(tmpStartDate, 'days') > this.maxDays - 1)) {
        event.preventDefault();
        if (this.props.business === "createItinerary") {
          this.props.handleDateChange(null, null, "invalid stay-in date selection");
          return;
        }
        else
          return;
      }
    }
    this.setState({
      inputStart: picker.startDate,
      inputEnd: picker.endDate,
      dayNameStart:
        picker.startDate._locale._weekdays[picker.startDate._d.getDay() + ""],
      dayNameEnd:
        picker.endDate._locale._weekdays[picker.endDate._d.getDay() + ""],
      isStateUpdateFromThisComponent: true
    });

    if (this.props.type === "MultiDestination") {
      this.props.handleDateChange(this.props.sequenceNumber, "date", moment(picker.startDate).format(Global.DateFormate));
    }
    else if (event.type !== "show") {
      this.props.handleDateChange(
        moment(picker.startDate).format(Global.DateFormate),
        moment(picker.endDate).format(Global.DateFormate)
      );
    }
  };

  onChange = date => {
    return true;
  };

  componentDidMount() {
    if (this.props.type === "MultiDestination") {
      this.props.handleDateChange(this.props.sequenceNumber, "date", moment(this.state.inputStart).format(Global.DateFormate));
    }
    else {
      this.props.handleDateChange(
        moment(this.state.inputStart).format(Global.DateFormate),
        moment(this.state.inputEnd).format(Global.DateFormate)
      );
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.dates !== undefined &&
      !state.isStateUpdateFromThisComponent &&
      state.inputStart !== moment(props.dates.checkInDate) &&
      state.inputEnd !== moment(props.dates.checkOutDate)
    ) {
      return {
        inputStart: moment(props.dates.checkInDate),
        inputEnd: moment(props.dates.checkOutDate),
        isStateUpdateFromThisComponent: false
      };
    } else
      return {
        isStateUpdateFromThisComponent: false
      };
  }

  render() {
    let opts = {};
    if (this.props.type === "umrah-package") {
      opts['minDate'] = this.props.umrahMinDate;
      opts['maxDate'] = this.props.umrahMaxDate;
    }
    else {
      opts['minDate'] = this.props.minDate ? moment(this.props.minDate) : this.state.minDate;
      if (this.props.business === "air")
        opts['maxDate'] = moment().add(360, "days");
    }
    return (
      <React.Fragment>
        {this.props.readOnly &&
          <div className="row">
            <div
              className={
                "form-group col-lg-" +
                (this.props.isSingleDateRangePicker ? "12" : "6")
              }
            >
              <label htmlFor="checkin">
                {this.props.business === "transfers" && !this.props.isSingleDateRangePicker ?
                  Trans("_widget" + this.props.business + "FromDate")
                  : this.props.business === "createItinerary" ? Trans("_widgetactivityCheckIn") :
                    this.props.business === "vehicle" ? Trans("_PickupDate")
                      : Trans("_widget" + this.props.business + "CheckIn")
                }
              </label>
              <input
                name="CheckInDateTime"
                id="CheckInDateTime"
                value={moment(this.state.inputStart).format(
                  Global.getEnvironmetKeyValue("DisplayDateFormate")
                )}
                placeholder="Check-in"
                type="text"
                className="form-control"
                readOnly="readOnly"
              />
              <SVGIcon name="calendar" width="16" height="16" style={{
                position: "absolute",
                bottom: "10px",
                right: "24px"
              }}></SVGIcon>
            </div>
            {!this.props.isSingleDateRangePicker && (
              <div className="form-group col-lg-6">
                <label htmlFor="checkout">
                  {this.props.business === "createItinerary" ? Trans("_widgetactivityCheckOut") :
                    this.props.business === "vehicle" ? Trans("_DropOffDate")
                      : Trans("_widget" + this.props.business + "CheckOut")}
                </label>
                <input
                  name="CheckOutDateTime"
                  id="CheckOutDateTime"
                  value={moment(this.state.inputEnd).format(
                    Global.getEnvironmetKeyValue("DisplayDateFormate")
                  )}
                  placeholder="Check-out"
                  type="text"
                  className="form-control"
                  readOnly="readOnly"
                />
                <SVGIcon name="calendar" width="16" height="16" style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "24px"
                }}></SVGIcon>
              </div>
            )}
          </div>
        }
        {!this.props.readOnly &&
          <DateR
            {...opts}
            startDate={this.state.inputStart}
            endDate={
              this.props.isSingleDateRangePicker
                ? this.state.inputStart
                : this.state.inputEnd
            }
            autoApply={true}
            autoUpdateInput={true}
            locale={this.locale}
            onEvent={this.handleDateChange}
            singleDatePicker={this.props.isSingleDateRangePicker}
            showDropdowns={false}
            startDateId="startDate"
            endDateId="endDate"
            drops={document.getElementById("CheckInDateTime") !== null && window.innerHeight - document.getElementById("CheckInDateTime").getBoundingClientRect().bottom < 200 ? "up" : "down"}
          >
            <div className="row">
              <div
                className={
                  "form-group col-lg-" +
                  (this.props.isSingleDateRangePicker ? "12" : "6")
                }
              >
                <label htmlFor="checkin">
                  {(this.props.checklabelName && this.props.checklabelName?.toLowerCase()) === "checkout" ? Trans("_widget" + this.props.business + "CheckOut") : this.props.business === "transfers" && !this.props.isSingleDateRangePicker ?
                    Trans("_widget" + this.props.business + "FromDate")
                    : this.props.business === "createItinerary" ? Trans("_widgetactivityCheckIn") :
                      this.props.business === "vehicle" ? Trans("_PickupDate")
                        : Trans("_widget" + this.props.business + "CheckIn")
                  }
                </label>
                <input
                  name="CheckInDateTime"
                  id="CheckInDateTime"
                  value={moment(this.state.inputStart).format(
                    Global.getEnvironmetKeyValue("DisplayDateFormate")
                  )}
                  placeholder="Check-in"
                  type="text"
                  className={"form-control" + (this.props.type === "MultiDestination" && this.props.isValid === "invalid" ? " border border-danger" : "")}
                  onChange={this.onChange}
                />
                <SVGIcon name="calendar" width="16" height="16" style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "24px"
                }}></SVGIcon>
              </div>
              {!this.props.isSingleDateRangePicker && (
                <div className="form-group col-lg-6">
                  <label htmlFor="checkout">
                    {this.props.business === "createItinerary" ? Trans("_widgetactivityCheckOut") :
                      this.props.business === "vehicle" ? Trans("_DropOffDate")
                        : Trans("_widget" + this.props.business + "CheckOut")}
                  </label>
                  <input
                    name="CheckOutDateTime"
                    id="CheckOutDateTime"
                    value={moment(this.state.inputEnd).format(
                      Global.getEnvironmetKeyValue("DisplayDateFormate")
                    )}
                    placeholder="Check-out"
                    type="text"
                    className="form-control"
                    onChange={this.onChange}
                  />
                  <SVGIcon name="calendar" width="16" height="16" style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "24px"
                  }}></SVGIcon>
                </div>
              )}
            </div>
          </DateR>
        }
      </React.Fragment>
    );
  }
}
export default DateRangePicker;
