import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";

class ActivityPaxWidget extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialize_State();
  }

  initialize_State = () => {
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    return {
      noofpersons:
        this.props.paxDetails === undefined
          ? (isCRSRoomSelectionFlowEnable && this.props.businessName === "package" ? ["25"] : [""])
          : this.props.paxDetails,
      isShowPaxInfoPopup: false,
      lastAction: null //add, remove
    };
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.isShowPaxInfoPopup && this.state.lastAction === null)
      this.refFirst.focus();
    if (this.props.paxDetails !== prevProps.paxDetails)
      this.setState(this.initialize_State());
  };

  addOrRemovePax = e => {
    let noofpersons = this.state.noofpersons;
    if (noofpersons.length > 14 && e === "plus") return;
    if (e === "plus") noofpersons.push("");
    if (e === "minus" && noofpersons.length > 1)
      noofpersons.pop(noofpersons[noofpersons.length - 1]);
    this.setState(
      {
        noofpersons: noofpersons,
        lastAction: (e === "plus" ? "add" : "remove")
      },
      () => this.handlePaxInfo()
    );
  };

  updatePaxAge = e => {
    var ageValue = e.target.value;
    if (isNaN(e.target.value) || parseInt(e.target.value) > 100) ageValue = "";
    else ageValue = parseInt(e.target.value);
    let noofpersons = this.state.noofpersons;
    noofpersons[e.target.attributes["id"].value] = ageValue;
    this.setState(
      {
        noofpersons: noofpersons,
        lastAction: "updateage"
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

  handleClosePopup = () => {
    this.props.ShowHidePaxInfoPopup();
    this.refDefaultFocus.focus();
  }

  handlePaxInfo = () => {
    this.props.handlePax(this.state.noofpersons);
  };

  render() {
    const { noofpersons } = this.state;
    let inValidAdultPaxCount = 0;
    if (this.props.isValid === "invalid") {
      inValidAdultPaxCount = noofpersons.reduce(
        (sum, key) => sum + (parseInt(key === "" ? 0 : key) > 15 ? 1 : 0),
        0
      );
    }

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
          <button
            className="page-link rounded text-dark btn-block" style={{ border: "1px solid #ced4da" }}
            onClick={() => { this.setState({ isShowPaxInfoPopup: false }) }}
            ref={refDefaultFocus => {
              this.refDefaultFocus = refDefaultFocus;
            }}
          >
            <div
              className={
                "room-selector pull-left" +
                (this.props.isValid === "invalid" ? " border-danger" : "")
              }
            >
              <label className="m-0">
                <b>{noofpersons.length}</b> {Trans("_widgetPersons")}
              </label>
            </div>
          </button>
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
                      onClick={e => this.addOrRemovePax("minus")}
                      className="page-link font-weight-bold"
                      ref={refFirst => {
                        this.refFirst = refFirst;
                      }}
                    >
                      -
                    </button>
                  </li>
                  <li className="page-item">
                    <span className="page-link bg-light">
                      {noofpersons.length} {Trans("_widgetPersons")}
                    </span>
                  </li>
                  <li className="page-item">
                    <button
                      onClick={e => this.addOrRemovePax("plus")}
                      className="page-link font-weight-bold"
                    >
                      +
                    </button>
                  </li>
                </ul>
              </div>
              <div className="row">
                <div className="col-12 mb-2">
                  <label className="d-block">
                    {Trans("_widgetAgeofGuest")}
                  </label>
                  {noofpersons.map((item, key) => {
                    return (
                      <input
                        key={key}
                        id={key}
                        value={item}
                        min="1"
                        max="100"
                        maxLength="2"
                        type="number"
                        className={
                          "col-3 form-control form-control-sm pull-left mr-2 mt-2" +
                          (this.props.isValid === "invalid" && item === ""
                            ? " border-danger"
                            : "")
                        }
                        style={{ width: "auto" }}
                        onChange={event => {
                          if (event.target.value.indexOf(".") > -1) {
                            return false;
                          } else {
                            this.updatePaxAge(event);
                          }
                          return true;
                        }}
                      />
                    );
                  })}
                  {this.props.isValid === "invalid" && inValidAdultPaxCount === 0 &&
                    <label className="d-block text-danger float-left mt-2">
                      {Trans("_widgetAgeofGuestNote")}
                    </label>}
                </div>
              </div>
              <button
                className="page-link  btn-outline-primary rounded  btn-block mt-3"
                onClick={() => this.handleClosePopup()}>
                {Trans("_close")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ActivityPaxWidget;
