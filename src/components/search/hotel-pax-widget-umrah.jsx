import React, { Component } from "react";
import Room from "./hotel-room-widgets-umrah";
import { Trans } from "../../helpers/translate";

class HotelPaxWidgetUmrah extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialize_State();
  }

  initialize_State = () => {
    return {
      roomsArr:
        this.props.roomDetails === undefined
          ? [
            {
              groupID: 1,
              noOfRooms: 1,
              noOfAdults: 2,
              noOfChild: 0
            }
          ]
          : this.props.roomDetails,
      showRooms: false,
      selected: undefined
    };
  };

  handleClick() {

    this.setState({
      showRooms: !this.state.showRooms
    });
  }

  handleRoom = (mode, groupID, value) => {
    if (this.props.type === "umrah-package")
      return;
    const roomsArr = this.state.roomsArr;
    if (mode === "room")
      roomsArr.filter(room => room.groupID === groupID)[0].noOfRooms = value;
    if (mode === "adult")
      roomsArr.filter(room => room.groupID === groupID)[0].noOfAdults = value;
    if (mode === "child")
      roomsArr.filter(room => room.groupID === groupID)[0].noOfChild = value;
    this.setState({
      roomsArr: roomsArr
    }, () => this.handlePaxInfo())
  };

  addRoomGroup = () => {
    if (this.props.type === "umrah-package")
      return;
    const roomsArr = this.state.roomsArr;
    roomsArr.push({
      groupID: roomsArr.length + 1,
      noOfRooms: 1,
      noOfAdults: 2,
      noOfChild: 0
    })
    this.setState({
      roomsArr: roomsArr
    }, () => this.handlePaxInfo())

  }

  handelRoomDelete = groupID => {
    if (this.props.type === "umrah-package")
      return;
    const filteredRoom = this.state.roomsArr.filter(
      room => room.groupID !== groupID
    );
    for (let i = 0; i < filteredRoom.length; i++) {
      filteredRoom[i]["groupID"] = i + 1;
    }
    this.setState({ roomsArr: filteredRoom }, () => this.handlePaxInfo());
    this.handlePaxInfo();
  };

  handlePaxInfo = () => {
    this.props.handlePax(this.state.roomsArr);
  };

  componentDidMount() {
    this.props.handlePax(this.state.roomsArr);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.node !== undefined && this.node !== null) {
      if (this.node.contains(event.target)) {
        return;
      } else if (!this.nodePatent.contains(event.target)) {
        this.setState({
          showRooms: false
        });
      }
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.roomDetails !== prevProps.roomDetails)
      this.setState(this.initialize_State());
  };

  render() {
    const { showRooms, roomsArr } = this.state;
    let i = 0;
    let tempNoOfRooms = 0;
    let tempNoOfAdults = 0;
    let tempNoOfChild = 0;
    while (i < roomsArr.length) {
      tempNoOfRooms += parseInt(roomsArr[i]["noOfRooms"]);
      tempNoOfAdults += (parseInt(roomsArr[i]["noOfRooms"]) * parseInt(roomsArr[i]["noOfAdults"]));
      tempNoOfChild += (parseInt(roomsArr[i]["noOfRooms"]) * parseInt(roomsArr[i]["noOfChild"]));
      i++;
    }
    return (
      <div>
        <div
          className="form-group"
          onClick={() => this.handleClick()}
          ref={nodePatent => {
            this.nodePatent = nodePatent;
          }}
        >
          <label>{Trans("_widgetTravellers")}</label>
          <div className={"border bg-white p-2 rounded-sm room-selector" + ((tempNoOfAdults + tempNoOfChild) > 9 ? " border-danger" : "")}>
            <label className="m-0">
              <b>{tempNoOfRooms}</b> {Trans("_widgetRoomsWithBraces")},
            </label>
            <label className="m-0 ml-2">
              <b>{tempNoOfAdults}</b> {Trans("_widgetAdults")} ,
            </label>
            <label className="m-0 ml-2">
              <b>{tempNoOfChild}</b> {Trans("_widgetChildren")}
            </label>
          </div>
        </div>

        {
          showRooms ? (
            <div
              className="border shadow bg-white w-100 p-4 room-selection"
              ref={node => {
                this.node = node;
              }}
            >
              {roomsArr.map((group, i) => (
                <Room
                  key={i}
                  handleRoom={this.handleRoom}
                  onRoomDelete={this.handelRoomDelete}
                  getRoomId={this.getRoomId}
                  {...group}
                  type={this.props.type}
                />
              ))}
              {
                (tempNoOfAdults + tempNoOfChild) > 9 ? (
                  <label className="d-block text-danger float-left mt-2 mb-3">
                    {Trans("_widgetPaxMessage")}
                  </label>
                ) : null
              }
              {(roomsArr.length < 6 && this.props.type !== "umrah-package") && (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={this.addRoomGroup}
                >
                  + {Trans("_widgetAddAnotherRoomGroup")}
                </button>
              )}
            </div>
          ) : null
        }
        {this.props.mode === "umrah-package" && tempNoOfAdults > 9 ? (
          <small class="alert alert-danger p-1 d-inline-block">
            {Trans("_widgetPaxMessage")}
          </small>
        ) : null
        }
      </div >
    );
  }
}

export default HotelPaxWidgetUmrah;
