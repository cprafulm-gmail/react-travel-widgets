import React, { Component } from "react";
import { Trans } from "../../helpers/translate";

class GroundServiceAdditionalServiceWidget extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialize_State();
    this.inputElement = React.createRef();
  }

  initialize_State = () => {
    return {
      additionalservices: [],
      //selectedadditionalservice:this.props.selectedadditionalservices.length > 0 ? this.props.selectedadditionalservices : [],
      showRooms: false,
      lastAction: null,//addRoom, removeRoom, addPax, removePax
      selected: undefined
    };
  };

  setAdditionalServiceSelection = (e) => {

    var selectedadditionalservice = this.state.additionalservices;
    if (selectedadditionalservice.find((x) => x.id === e.target.value).Selected === true) {
      selectedadditionalservice.find((x) => x.id === e.target.value).Selected =
        false;
      selectedadditionalservice.find((x) => x.id === e.target.value).Quantity = 0;
      selectedadditionalservice.find((x) => x.id === e.target.value).Duration = 0;
      selectedadditionalservice.find((x) => x.id === e.target.value).Disabled = true;
    }
    else {
      selectedadditionalservice.find((x) => x.id === e.target.value).Selected =
        true;
      selectedadditionalservice.find((x) => x.id === e.target.value).Quantity = 0;
      selectedadditionalservice.find((x) => x.id === e.target.value).Duration = 0;
      selectedadditionalservice.find((x) => x.id === e.target.value).Disabled = false;
    }

    this.setState({
      additionalservices: selectedadditionalservice
    });
    this.props.handleAdditionalServicesPax(this.state.additionalservices);
  }
  setAdditionalServiceQuantity = (id, e) => {
    var selectedadditionalservice = this.state.additionalservices;
    selectedadditionalservice.find((x) => x.id === id).Quantity = e.target.value;
    this.setState({
      additionalservices: selectedadditionalservice
    });
    this.props.handleAdditionalServicesPax(this.state.additionalservices);
  }

  setAdditionalServiceDuration = (id, e) => {
    var selectedadditionalservice = this.state.additionalservices;
    selectedadditionalservice.find((x) => x.id === id).Duration = e.target.value;
    this.setState({
      additionalservices: selectedadditionalservice
    });
    this.props.handleAdditionalServicesPax(this.state.additionalservices);
  }


  OnLoadAdditionalService = () => {
    var additionalservices = this.state.additionalservices;
    if (additionalservices.length === 0) {
      this.props.additionalservice.map((service) => (
        additionalservices.push(
          {
            id: service.id,
            name: service.name,
            Quantity: service.Quantity !== undefined ? service.Quantity : 0,
            Duration: service.Duration !== undefined ? service.Duration : 0,
            Selected: service.Selected !== undefined ? service.Selected : false,
            Disabled: service.Disabled !== undefined ? service.Disabled : true
          }
        )
      ))
    }
    this.setState({
      additionalservices: additionalservices
    });
  }

  handleClick() {
    this.setState({
      showRooms: !this.state.showRooms
    });
  }

  componentDidMount() {
    this.OnLoadAdditionalService();
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
        });
      }
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    //Code for focus
    // if (this.state.showRooms === true) {
    //   if (prevState.showRooms === false) {
    //     // this.inputElement.current.focus();
    //     this[`room${this.state.roomsArr.length - 1}`].focus();
    //   }
    //   else if (this.state.lastAction === "addRoom" || this.state.lastAction === "removeRoom") {
    //     // this.inputElement.current.focus();
    //     this[`room${this.state.roomsArr.length - 1}`].focus();
    //   }
    // }
    if (this.props.roomDetails !== prevProps.roomDetails)
      this.setState(this.initialize_State());
  };

  render() {
    const { showRooms } = this.state;
    let selectedadditionalservices = "";
    let additionalservice = this.state.additionalservices;
    if (additionalservice !== undefined) {
      additionalservice.map((service, i) => (
        service.Selected === true ? (selectedadditionalservices !== ""
          ? selectedadditionalservices = selectedadditionalservices + " ," + service.name
          : selectedadditionalservices = service.name)
          : null
      ))
    }

    if (selectedadditionalservices === "")
      selectedadditionalservices = Trans("_lbladditionalServices")
    return (
      <div>
        <div
          className="form-group"
          onClick={() => this.handleClick()}
          ref={nodePatent => {
            this.nodePatent = nodePatent;
          }}
        >
          <label>{Trans("_lbladditionalServices")}</label>
          <button
            className="page-link rounded text-dark btn-block" style={{ border: "1px solid #ced4da" }}
            onClick={() => { this.setState({ showRooms: false }) }}
            ref={refBtnTitle => {
              this.refBtnTitle = refBtnTitle;
            }}
          >
            <div className="room-selector pull-left">
              <label className="m-0 ml-2">
                {selectedadditionalservices}
              </label>
            </div>
          </button>
        </div>

        {(showRooms || this.props.isValid === "invalid") ? (
          <div
            className="border shadow bg-white w-100 p-4 room-selection d-flex  flex-wrap flex-column "
            ref={node => {
              this.node = node;
            }}
          >

            <div className="row">
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>{Trans("_service")}</th>
                    <th>{Trans("Quantity")}</th>
                    <th>{Trans("_duration")}</th>
                  </tr>
                  {this.state.additionalservices.map((service, i) => (
                    <tr>
                      <td>
                        <input
                          className="form-control groundserviceadditionalservices"
                          type="checkbox"
                          id={service.name + "_" + service.id}
                          value={service.id}
                          name={service.name + "_" + service.id}
                          checked={service.Selected}
                          onChange={(e) => this.setAdditionalServiceSelection(e)}
                        />
                      </td>
                      <td>
                        <span>{service.name}</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          className={
                            "form-control" +
                            (this.props.isValid === "invalid" && service.Quantity === 0 && service.Selected === true ? " border-danger" : "")
                          }
                          disabled={service.Disabled}
                          onChange={(e) => {
                            if (e.target.value.indexOf(".") > -1) {
                              return false;
                            } else { this.setAdditionalServiceQuantity(service.id, e) }
                            return true;
                          }
                          }
                          value={service.Quantity}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          className={
                            "form-control" +
                            (this.props.isValid === "invalid" && service.Duration === 0 && service.Selected === true ? " border-danger" : "")
                          }
                          disabled={service.Disabled}
                          onChange={(e) => {
                            if (e.target.value.indexOf(".") > -1) {
                              return false;
                            } else { this.setAdditionalServiceDuration(service.id, e) }
                            return true;
                          }
                          }
                          value={service.Duration}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


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

export default GroundServiceAdditionalServiceWidget;
