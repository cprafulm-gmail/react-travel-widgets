import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon"

const HotelRoomWidgets = props => {
  const { roomID } = props;
  return (
    <div id={"Room" + roomID} className="mb-2">
      <div className="border-bottom pb-2 mb-2">
        <b>
          {Trans("_widgetRoom")} {roomID}
        </b>
        {roomID > 1 && (
          <button class="btn-remove-room page-link border-0 text-dark pull-right p-0 align-middle pt-1"
            onClick={() => props.onRoomDelete(roomID)}
          >
            <SVGIcon name="times"></SVGIcon>
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-6">
          <label className="d-block mb-2">{Trans("_widgetAdults")}</label>
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link font-weight-bold"
                onClick={() => props.removeAdultChild(roomID, "noOfAdults")}
                ref={props.inputRef}
              >
                -
              </button>
            </li>
            <li className="page-item">
              <span className="page-link bg-light">{props.noOfAdults}</span>
            </li>
            <li className="page-item">
              <button
                onClick={() => props.addAdultChild(roomID, "noOfAdults")}
                className="page-link font-weight-bold"
              >
                +
              </button>
            </li>
          </ul>
        </div>

        <div className="col-6">
          <label className="d-block mb-2">
            {Trans("_widgetChildren")}{" "}
          </label>
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link font-weight-bold"
                onClick={() => props.removeAdultChild(roomID, "noOfChild")}
              >
                -
              </button>
            </li>
            <li className="page-item">
              <span className="page-link bg-light">{props.noOfChild}</span>
            </li>
            <li className="page-item">
              <button
                onClick={() => props.addAdultChild(roomID, "noOfChild")}
                className="page-link font-weight-bold"
              >
                +
              </button>
            </li>
          </ul>
        </div>
        {!props.ishandleRoomType && props.noOfChild ? (
          <div className="col-12 mb-2">
            <label className="d-block">{Trans("_widgetAgeOfChild")}</label>
            {props.childAgeDDL(roomID, props.noOfChild)}
          </div>
        ) : null}

        {props.ishandleRoomType &&
          <div className="col-12 mb-2">
            <label for="roomtype" className="d-block">Room Type</label>
            <input type="text" value={props.roomType === "Unnamed" ? "" : props.roomType} className="w-100" maxlength="50" name="roomtype" onChange={(e) => props.handleRoomType(roomID, e.target.value)} />
          </div>}
      </div>
    </div>
  );
};

export default HotelRoomWidgets;
