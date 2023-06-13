import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import AutoComplete from "./auto-complete";
import * as Global from "../../helpers/global";
import DateRangePicker from "./../common/date-range";

class AirLocationMultiDestination extends Component {

    //{ noOfLocation: 2, locationInfo: null }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.roomDetails !== prevProps.roomDetails)
            this.setState(this.initialize_State());
    };

    render() {
        const availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
        let cutOffDays = availableBusinesses.find((x) => x.name === "air").cutOffDays;
        let stayInDays = availableBusinesses.find((x) => x.name === "air").stayInDays;
        let locationInfo = this.props.airMultiDestincationData.locationInfo;
        return (
            <React.Fragment>
                {this.props.airMultiDestincationData.locationInfo.map((item, index) => {
                    return <React.Fragment key={index}>
                        {/* <div className="row">
                            <label className="pl-3">
                                Trip {index + 1}
                            </label>
                        </div> */}
                        <div className="row">
                            <div className={"form-group col-lg-" + (this.props.mode ? "4 mb-3" : "6")}>
                                <label htmlFor="tolocation">
                                    {Trans("_widgetairFromLocationTitle")}
                                </label>
                                <AutoComplete
                                    sequenceNumber={index}
                                    isValid={locationInfo[index].fromLocationIsValid}
                                    businessName={"air"}
                                    handleLocation={this.props.handleMultidestinationData}
                                    mode="From-MultiDestination"
                                    key={
                                        locationInfo[index].fromLocation && locationInfo[index].fromLocation.id
                                            ? locationInfo[index].fromLocation.id
                                            : ""
                                    }
                                    selectedOptions={
                                        Array.isArray(locationInfo[index].fromLocation)
                                            ? locationInfo[index].fromLocation : locationInfo[index].fromLocation && locationInfo[index].fromLocation.id ? [locationInfo[index].fromLocation] : []
                                    }
                                />
                            </div>

                            <div className={"form-group col-lg-" + (this.props.mode ? "4 mb-3" : "6")}>
                                <label htmlFor="tolocation">
                                    {Trans("_widgetairToLocationTitle")}
                                </label>
                                <AutoComplete
                                    sequenceNumber={index}
                                    isValid={locationInfo[index].toLocationIsValid}
                                    businessName={"air"}
                                    handleLocation={this.props.handleMultidestinationData}
                                    mode="To-MultiDestination"
                                    key={
                                        locationInfo[index].toLocation && locationInfo[index].toLocation.id
                                            ? locationInfo[index].toLocation.id
                                            : ""
                                    }
                                    selectedOptions={
                                        Array.isArray(locationInfo[index].toLocation)
                                            ? locationInfo[index].toLocation : locationInfo[index].toLocation && locationInfo[index].toLocation.id ? [locationInfo[index].toLocation] : []
                                    }
                                />
                            </div>
                            <div className={"col-lg-" + (this.props.mode ? "2" : "4")}>
                                <DateRangePicker
                                    sequenceNumber={index}
                                    isValid={locationInfo[index].datesIsValid}
                                    cutOfDays={index === 0 ? cutOffDays : cutOffDays + (stayInDays * (index))}
                                    stayInDays={stayInDays}
                                    minDays={1}
                                    maxDays={5}
                                    dates={locationInfo[index].dates === "" ? undefined : locationInfo[index].dates}
                                    isSingleDateRangePicker={true}
                                    handleDateChange={this.props.handleMultidestinationData}
                                    business={"air"}
                                    type={"MultiDestination"}
                                />
                            </div>
                            <div className={"col-lg-" + (this.props.mode ? "2" : "8")}>
                                {index > 1 && <button className="btn btn-link text-primary mt-2 p-0 float-right"
                                    onClick={() => this.props.addRemoveMultidestinationData("remove", index)}>
                                    Remove Trip
                                </button>
                                }
                            </div>

                        </div>
                        <hr className={"pt-0 mt-0 pb-1 " + (this.props.mode ? " mb-3" : " mb-0")} />
                    </React.Fragment>
                })}
                {locationInfo.length < 6 &&
                    <div className="row">
                        <div className={"d-flex justify-content-end col-lg-" + (this.props.mode ? "12" : "12")}>
                            <button className="btn btn-link text-primary mt-2 p-0  float-right"
                                onClick={() => this.props.addRemoveMultidestinationData("add", locationInfo.length - 1)}>
                                Add Trip
                            </button>
                        </div>
                    </div>
                }
            </React.Fragment>

        );
    }
}

export default AirLocationMultiDestination;