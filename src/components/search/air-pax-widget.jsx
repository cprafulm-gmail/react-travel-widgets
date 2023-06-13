import React, { Component } from "react";
import { Trans } from "../../helpers/translate";

class AirPaxWidget extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialize_State();
  }

  initialize_State = () => {
    return {
      paxInfo:
        this.props.paxDetails !== undefined
          ? this.props.paxDetails
          : [
            {
              type: "ADT",
              count: 1
            },
            {
              type: "CHD",
              count: 0
            },
            {
              type: "INF",
              count: 0
            }
          ],
      lastAction: null,//add, remove
    };
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.isShowPaxInfoPopup && this.state.lastAction === null)
      this.refFirst.focus();
    if (this.props.paxDetails !== prevProps.paxDetails)
      this.setState(this.initialize_State());
  };

  componentDidMount() {
    this.props.handlePax(this.state.paxInfo);
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

  addOrRemovePax = (type, mode) => {
    let paxInfo = this.state.paxInfo;
    let totalPax =
      parseInt(paxInfo.find(x => x.type === "ADT").count) +
      parseInt(paxInfo.find(x => x.type === "CHD").count) +
      parseInt(paxInfo.find(x => x.type === "INF").count);
    if (totalPax === 9 && mode === "plus") return;

    var count = parseInt(paxInfo.find(x => x.type === type).count);
    paxInfo.find(x => x.type === type).count =
      mode === "plus"
        ? ++count
        : type === "ADT" && mode === "minus" && count === 1
          ? count
          : count === 0
            ? 0
            : --count;

    this.setState(
      {
        paxInfo: paxInfo,
        lastAction: "add"
      },
      () => this.props.handlePax(this.state.paxInfo)
    );
  };

  handleClosePopup = () => {
    this.props.ShowHidePaxInfoPopup();
    this.refDefaultFocus.focus();
  }

  render() {
    const { paxInfo } = this.state;
    let paxIsValidInfCount = false;
    if (this.props.isValid === "invalid") {
      let paxIsValid =
        paxInfo !== "" &&
        typeof paxInfo === "object" &&
        paxInfo.length > 0;
      // let paxIsValidAgeCount = true;

      // if (paxIsValid && paxInfo.filter(x => x.type === "ADT")[0].count + paxInfo.filter(x => x.type === "CHD")[0].count + paxInfo.filter(x => x.type === "INF")[0].count > 9)
      //   paxIsValidAgeCount = true;
      if (paxIsValid && paxInfo.filter(x => x.type === "ADT")[0].count < paxInfo.filter(x => x.type === "INF")[0].count)
        paxIsValidInfCount = true;
    }
    let opts = {};
    if (this.props.type === "umrah-package")
      opts['disabled'] = 'disabled';
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
            className={"page-link rounded text-dark btn-block" + (this.props.isValid === "invalid" ? " border-danger" : "")}
            style={{ border: "1px solid #ced4da" }}
            onClick={() => { this.setState({ showRooms: false }) }}
            ref={refDefaultFocus => {
              this.refDefaultFocus = refDefaultFocus;
            }}
          >
            <label className="m-0 pull-left">
              <b>{paxInfo.find(x => x.type === "ADT").count}</b>{" "}
              {Trans("_widgetAdults") + ", "}
              <b>{paxInfo.find(x => x.type === "CHD").count}</b>{" "}
              {Trans("_widgetChildren") + ", "}
              <b>{paxInfo.find(x => x.type === "INF").count}</b>{" "}
              {Trans("_widgetInfants")}
            </label>
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
                <b>{Trans("_widgetTravellers") + " (" + Trans("_widgetMinMxTravellerNote") + ")"}</b>
              </div>
              <div className="row">
                <div className={"col-" + (this.props.mode === "modify" ? "12" : "6")}>
                  <label className="d-block mb-2">
                    {Trans("_widgetAdults")}
                  </label>
                  <ul className="pagination">
                    <li className="page-item">
                      <button
                        {...opts}
                        className="page-link font-weight-bold"
                        onClick={e => this.addOrRemovePax("ADT", "minus")}
                        ref={refFirst => {
                          this.refFirst = refFirst;
                        }}
                      >
                        -
                      </button>
                    </li>
                    <li className="page-item">
                      <span className="page-link bg-light">
                        {" "}
                        {paxInfo.find(x => x.type === "ADT").count}{" "}
                      </span>
                    </li>
                    <li className="page-item">
                      <button
                        {...opts}
                        className="page-link font-weight-bold"
                        onClick={e => this.addOrRemovePax("ADT", "plus")}
                      >
                        +
                      </button>
                    </li>
                  </ul>
                </div>
                <div className={"col-" + (this.props.mode === "modify" ? "12" : "6")}>
                  <label className="d-block mb-2">
                    {Trans("_widgetChildren")}
                  </label>
                  <ul className="pagination">
                    <li className="page-item">
                      <button
                        {...opts}
                        className="page-link font-weight-bold"
                        onClick={e => this.addOrRemovePax("CHD", "minus")}
                      >
                        -
                      </button>
                    </li>
                    <li className="page-item">
                      <span className="page-link bg-light">
                        {" "}
                        {paxInfo.find(x => x.type === "CHD").count}{" "}
                      </span>
                    </li>
                    <li className="page-item">
                      <button
                        {...opts}
                        className="page-link font-weight-bold"
                        onClick={e => this.addOrRemovePax("CHD", "plus")}
                      >
                        +
                      </button>
                    </li>
                  </ul>
                </div>
                <div className={"col-" + (this.props.mode === "modify" ? "12" : "6")}>
                  <label className="d-block mb-2">
                    {Trans("_widgetInfants")}
                  </label>
                  <ul className="pagination">
                    <li className="page-item">
                      <button
                        {...opts}
                        className="page-link font-weight-bold"
                        onClick={e => this.addOrRemovePax("INF", "minus")}
                      >
                        -
                      </button>
                    </li>
                    <li className="page-item">
                      <span className="page-link bg-light">
                        {" "}
                        {paxInfo.find(x => x.type === "INF").count}{" "}
                      </span>
                    </li>
                    <li className="page-item">
                      <button
                        {...opts}
                        className="page-link font-weight-bold"
                        onClick={e => this.addOrRemovePax("INF", "plus")}
                      >
                        +
                      </button>
                    </li>
                  </ul>
                </div>
                <button
                  class="page-link btn-outline-primary text-primary rounded  btn-block mr-3 ml-3"
                  onClick={() => this.handleClosePopup()}>
                  {Trans("_close")}
                </button>
              </div>

              {paxIsValidInfCount &&
                <label className="d-block text-danger float-left mt-2">
                  {Trans("_widgetMinMxTravellerNote1")}
                </label>
              }
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default AirPaxWidget;
