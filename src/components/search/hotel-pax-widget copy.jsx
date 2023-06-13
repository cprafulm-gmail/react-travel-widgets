import React, { Component } from "react";
import Room from "./hotel-room-widgets";
import { Trans } from "../../helpers/translate";

class HotelPaxWidget extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialize_State();
    this.inputElement = React.createRef();
  }

  initialize_State = (isShowRooms) => {
    return {
      roomsArr:
        this.props.roomDetails === undefined
          ? [
            {
              roomID: 1,
              noOfAdults: 2,
              noOfChild: 0,
              roomType: "",
              childAge: []
            }
          ]
          : this.props.roomDetails,
      roomID:
        this.props.roomDetails === undefined
          ? 1
          : this.props.roomDetails.length,
      noOfAdults:
        this.props.totalNoOfAdult === undefined ? 2 : this.props.totalNoOfAdult,
      noOfChild:
        this.props.totalNoOfChild === undefined ? 0 : this.props.totalNoOfChild,
      showRooms: typeof isShowRooms === 'undefined' ? false : isShowRooms,
      lastAction: null,//addRoom, removeRoom, addPax, removePax
      selected: undefined
    };
  };

  handleRoomType = (RoomID, roomType) => {
    let roomsArr = this.state.roomsArr;
    var index = this.state.roomsArr.findIndex(x => x.roomID === RoomID);
    roomsArr[index].roomType = roomType;
    this.setState({ roomsArr, lastAction: "roomType" },
      () => this.handlePaxInfo()
    );
  }
  getRoomId = RoomID => {
    var index = this.state.roomsArr.findIndex(x => x.roomID === RoomID);
    return index + 1;
  };

  handleClick() {
    this.setState({
      showRooms: !this.state.showRooms
    });
  }

  addRooms = () => {
    if (this.state.roomsArr.length > 5) return;
    var objRoom = {
      roomID: this.state.roomsArr.length + 1,
      noOfAdults: 2,
      noOfChild: 0,
      childAge: [],
      roomType: "Unnamed"
    };
    var objr = this.state.roomsArr;
    objr.push(objRoom);
    this.setState(
      {
        roomID: this.state.roomID + 1,
        roomsArr: objr,
        noOfAdults: parseInt(this.state.noOfAdults) + 2,
        lastAction: "addRoom"
      },
      () => this.handlePaxInfo()
    );
  };

  handelRoomDelete = RoomId => {
    const filteredRoom = this.state.roomsArr.filter(
      room => room.roomID !== RoomId
    );
    for (let i = 0; i < filteredRoom.length; i++) {
      filteredRoom[i]["roomID"] = i + 1;
    }
    var index = this.state.roomsArr.findIndex(x => x.roomID === RoomId);
    this.setState(
      {
        roomID: this.state.roomID - 1,
        roomsArr: filteredRoom,
        noOfAdults:
          this.state.noOfAdults - this.state.roomsArr[index]["noOfAdults"],
        noOfChild:
          this.state.noOfChild - this.state.roomsArr[index]["noOfChild"],
        lastAction: "removeRoom"
      },
      () => this.handlePaxInfo()
    );
  };

  childAgeChange = (roomID, event) => {
    var index = this.state.roomsArr.findIndex(x => x.roomID === roomID);
    var objRooms = this.state.roomsArr;
    objRooms[index]["childAge"][
      parseInt(event.target.attributes["roomchildindex"].value) - 1
    ] = event.target.value;
    this.setState({ roomsArr: objRooms });
    this.handlePaxInfo();
  };

  removeAdultChild = (RoomID, t) => {
    var index = this.state.roomsArr.findIndex(x => x.roomID === RoomID);
    var objRooms = this.state.roomsArr;
    if (t === "noOfAdults" && objRooms[index][t] > 1) {
      objRooms[index][t] = objRooms[index][t] - 1;
      this.setState({
        roomsArr: objRooms,
        noOfAdults: this.state.noOfAdults - 1,
        lastAction: "removePax"
      });
    } else if (t === "noOfChild" && objRooms[index][t] > 0) {
      objRooms[index][t] = objRooms[index][t] - 1;
      this.setState({
        roomsArr: objRooms,
        noOfChild: this.state.noOfChild - 1,
        lastAction: "removePax"
      });
    }
    this.handlePaxInfo();
  };

  addAdultChild = (RoomID, t) => {
    var index = this.state.roomsArr.findIndex(x => x.roomID === RoomID);
    var objRooms = this.state.roomsArr;
    if (t === "noOfAdults" && parseInt(objRooms[index][t]) > 5) return;
    else if (t === "noOfChild" && parseInt(objRooms[index][t]) > 2) return;
    if (t === "noOfAdults") {
      objRooms[index][t] = objRooms[index][t] + 1;
      this.setState({
        roomsArr: objRooms,
        noOfAdults: parseInt(this.state.noOfAdults) + 1,
        lastAction: "addPax"
      });
    } else if (t === "noOfChild") {
      objRooms[index][t] = objRooms[index][t] + 1;
      objRooms[index]["childAge"].push("1");
      this.setState({
        roomsArr: objRooms,
        noOfChild: parseInt(this.state.noOfChild) + 1,
        lastAction: "addPax"
      });
    }
    this.handlePaxInfo();
  };

  childAgeDDL = (roomID, noOfChild) => {
    var index = this.state.roomsArr.findIndex(x => x.roomID === roomID);
    var objRooms = this.state.roomsArr;
    var age = objRooms[index]["childAge"];
    let childAge = [];

    // Outer loop to create parent
    for (let i = 1; i <= noOfChild; i++) {
      childAge.push(
        <select
          key={i}
          id={"ddlRoom" + roomID + "Child" + i}
          roomchildindex={i}
          name={"ddlRoom" + roomID + "Child" + i}
          value={age[i - 1]}
          onChange={e => this.childAgeChange(roomID, e)}
          className="form-control form-control-sm pull-left mr-1 mb-1"
          style={{ width: "auto" }}
        >
          <option value="1">&lt; 1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
        </select>
      );
    }
    return childAge;
  };

  handlePaxInfo = () => {
    this.props.handlePax(this.state.roomsArr);
  };

  componentDidMount() {
    this.props.handlePax(this.state.roomsArr);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  handleClosePopup = () => {
    this.setState({ showRooms: false })
    this.refBtnTitle.focus();
  }

  handleClickOutside = event => {
    if (this.node !== undefined && this.node !== null) {
      if (this.node.contains(event.target)) {
        return;
      } else if (!this.nodePatent.contains(event.target)) {
        this.setState({
          showRooms: false
        }, () => this.handlePaxInfo());
      }
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    //Code for focus
    if (this.state.showRooms === true) {
      if (prevState.showRooms === false) {
        // this.inputElement.current.focus();
        this[`room${this.state.roomsArr.length - 1}`].focus();
      }
      else if (this.state.lastAction === "addRoom" || this.state.lastAction === "removeRoom") {
        // this.inputElement.current.focus();
        this[`room${this.state.roomsArr.length - 1}`].focus();
      }
    }
    if (this.props.roomDetails !== prevProps.roomDetails)
      this.setState(this.initialize_State(prevState.showRooms));
  };

  render() {
    const { showRooms, roomID } = this.state;
    let i = 0;
    let tempNoOfAdults = 0;
    let tempNoOfChild = 0;
    while (i < this.state.roomsArr.length) {
      tempNoOfAdults += parseInt(this.state.roomsArr[i]["noOfAdults"]);

      tempNoOfChild += parseInt(this.state.roomsArr[i]["noOfChild"]);
      i++;
    }
    return (
      <div className={this.props.ishandleRoomType ? "col-lg-3" : ""}>
        <div
          className="form-group"
          onClick={this.props.readOnly && this.props.readOnly === true ? "" : () => this.handleClick()}
          ref={nodePatent => {
            this.nodePatent = nodePatent;
          }}
        >
          <label>{Trans("_widgetTravellers")}</label>
          <button
            className="page-link rounded text-dark btn-block" style={{ border: "1px solid #ced4da" }}
            onClick={() => { this.setState({ showRooms: false }) }}
            ref={refBtnTitle => {
              this.refBtnTitle = refBtnTitle;
            }}
          >
            <div className="room-selector pull-left">
              <label className="m-0">
                <b>{roomID}</b> {Trans("_widgetRoomsWithBraces")},
              </label>
              <label className="m-0 ml-2">
                <b>{tempNoOfAdults}</b> {Trans("_widgetAdults")} ,
              </label>
              <label className="m-0 ml-2">
                <b>{tempNoOfChild}</b> {Trans("_widgetChildren")}
              </label>
            </div>
          </button>
        </div>

        {showRooms ? (
          <div
            className="border shadow bg-white w-100 p-4 room-selection d-flex  flex-wrap flex-column "
            ref={node => {
              this.node = node;
            }}
          >
            {this.state.roomsArr.map((room, i) => (
              <Room
                key={i}
                {...room}
                onRoomDelete={this.handelRoomDelete}
                handleRoomType={this.handleRoomType}
                ishandleRoomType={this.props.ishandleRoomType}
                getRoomId={this.getRoomId}
                removeAdultChild={this.removeAdultChild}
                addAdultChild={this.addAdultChild}
                childAgeDDL={this.childAgeDDL}
                // inputRef={this.inputElement}
                inputRef={ref => (this[`room${i}`] = ref)}
              />
            ))}

            {this.state.roomsArr.length < 6 && (
              <button
                className="page-link  btn-outline-primary btn-sm"
                onClick={this.addRooms}
              >
                + {Trans("_widgetAddAnotherRoom")}
              </button>
            )}
            <button
              className="page-link  btn-outline-primary btn-sm mt-3"
              onClick={() => this.handleClosePopup()}>
              {Trans("_close")}
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default HotelPaxWidget;
