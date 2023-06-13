import React, { Component } from "react";
import { Trans } from "../../helpers/translate";

class TransportationPaxWidget extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialize_State();
    }

    initialize_State = () => {
        return {
            noofpersons:
                this.props.paxDetails === undefined ? [2] : this.props.paxDetails
        };
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.paxDetails !== prevProps.paxDetails)
            this.setState(this.initialize_State());
    };

    addOrRemoveVehicle = e => {
        let noofpersons = this.state.noofpersons;
        if (noofpersons.length > 9 && e === "plus") return;
        if (e === "plus") noofpersons.push("2");
        if (e === "minus" && noofpersons.length > 1)
            noofpersons.pop(noofpersons[noofpersons.length - 1]);
        this.setState(
            {
                noofpersons: noofpersons
            },
            () => this.handlePaxInfo()
        );
    };

    updatePaxNumber = e => {
        var paxNumberValue = e.target.value;
        if (isNaN(e.target.value) || parseInt(e.target.value) > 100) paxNumberValue = "";
        else paxNumberValue = isNaN(parseInt(e.target.value)) ? "" : parseInt(e.target.value);
        let noofpersons = this.state.noofpersons;
        noofpersons[e.target.attributes["id"].value] = paxNumberValue;
        this.setState(
            {
                noofpersons: noofpersons
            },
            () => this.handlePaxInfo()
        );
    };

    componentDidMount() {
        this.props.handlePax(this.state.noofpersons);
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (this.node !== undefined && this.node !== null) {
            if (this.node.contains(event.target)) {
                return;
            } else if (!this.nodePatent.contains(event.target)) {
                this.props.ShowHidePaxInfoPopup();
            }
        }
    };

    handlePaxInfo = () => {
        this.props.handlePax(this.state.noofpersons);
    };

    render() {
        const { noofpersons } = this.state;
        let totalNoofpersons = noofpersons.reduce((sum, item) => sum += parseInt(item === "" ? 0 : item), 0)
        return (
            <div>
                <div
                    className="form-group"
                    onClick={() => this.props.ShowHidePaxInfoPopup()}
                    ref={nodePatent => {
                        this.nodePatent = nodePatent;
                    }}
                >
                    <label>{Trans("_widgetTravellers")}</label>
                    <div
                        className={
                            "border bg-white p-2 rounded-sm room-selector" +
                            (this.props.isValid === "invalid" ? " border-danger" : "")
                        }
                    >
                        <label className="m-0">
                            <b>{noofpersons.length}</b> {Trans("_widgetVehivle")}, <b>{totalNoofpersons}</b> {Trans("_widgetTravellers")}
                        </label>
                    </div>
                </div>

                {this.props.isShowPaxInfoPopup ? (
                    <div
                        className="border shadow bg-white w-100 p-4 room-selection"
                        ref={node => {
                            this.node = node;
                        }}
                    >
                        <div className="mb-2">
                            <div className="border-bottom pb-2 mb-2">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <button
                                            onClick={e => this.addOrRemoveVehicle("minus")}
                                            className="page-link font-weight-bold"
                                        >
                                            -
                                        </button>
                                    </li>
                                    <li className="page-item">
                                        <span className="page-link bg-light">
                                            {noofpersons.length} {Trans("_vehicles")}
                                        </span>
                                    </li>
                                    <li className="page-item">
                                        <button
                                            onClick={e => this.addOrRemoveVehicle("plus")}
                                            className="page-link font-weight-bold"
                                        >
                                            +
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="container">
                                <div className="row">
                                    {noofpersons.map((item, key) => {
                                        return (
                                            <div className="row col-12" key={key}>
                                                <label className="mr-3 mt-2">
                                                    {Trans("_guestSInVehicle") + " " + (key + 1) + " : "}
                                                </label>
                                                <input
                                                    id={key}
                                                    value={item}
                                                    min="1"
                                                    max="60"
                                                    maxLength="2"
                                                    type="number"
                                                    className={
                                                        "form-control col-3 " +
                                                        (this.props.isValid === "invalid" && (item === "" || item === 0 || parseInt(item) > 61)
                                                            ? " border-danger"
                                                            : "")
                                                    }
                                                    style={{ width: "auto" }}
                                                    onChange={event => {
                                                        if (event.target.value.indexOf(".") > -1) {
                                                            return false;
                                                        } else {
                                                            this.updatePaxNumber(event);
                                                        }
                                                        return true;
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                    {/* <label className="d-block text-info float-left mt-3">
                                    {Trans("_widgetNoofGuestPerVehicleNote")}
                                </label> */}
                                    <label className="d-block text-info float-left mt-3">
                                        {Trans("_widgetNoofGuestPerVehicleNote1")}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default TransportationPaxWidget;
