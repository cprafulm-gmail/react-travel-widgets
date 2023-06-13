import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon"

const HotelRoomWidgetsUmrah = props => {
  const { groupID, noOfRooms, noOfAdults, noOfChild } = props;
  let opts = {};
  if (props.type === "umrah-package")
    opts['disabled'] = 'disabled';
  return (
    <div id={"Group" + groupID} className="mb-2">
      <div className="border-bottom pb-2 mb-2">
        <b>
          {Trans("_widgetRoomGroup")} {groupID}
        </b>
        {groupID > 1 && props.type !== "umrah-package" && (
          <i
            className="pull-right"
            style={{ cursor: "pointer" }}
            onClick={() => props.onRoomDelete(groupID)}
          >
            <SVGIcon name="times"></SVGIcon>
          </i>
        )}
      </div>

      <div className="row">
        <div className="col-12 row">
          <label className="d-block mb-2 col-8">{Trans("_widgetNoofRooms")}</label>
          <ul className="pagination">
            <li className="page-item">
              <select
                {...opts}
                id={"ddlRoom" + groupID + "Room"}
                name={"ddlRoom" + groupID + "Room"}
                onChange={e => props.handleRoom('room', groupID, e.target.value)}
                className="form-control form-control-sm pull-left mr-1 mb-1"
                style={{ width: "auto" }}
                defaultValue={noOfRooms}
              >
                <option value="1">1</option>
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
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
              </select>
            </li>
          </ul>
        </div>
        <div className="col-12 row">
          <label className="d-block mb-2 col-8">{Trans("_widgetAdultsPerRoom")}</label>
          <ul className="pagination">
            <li className="page-item">
              <select
                {...opts}
                id={"ddlRoom" + groupID + "Adult"}
                name={"ddlRoom" + groupID + "Adult"}
                onChange={e => props.handleRoom('adult', groupID, e.target.value)}
                className="form-control form-control-sm pull-left mr-1 mb-1"
                style={{ width: "auto" }}
                defaultValue={noOfAdults}
              >
                <option value="1">1</option>
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
              </select>
            </li>
          </ul>
        </div>
        <div className="col-12 row">
          <label className="d-block mb-2 col-8">{Trans("_widgetChildrenPerRoom")}</label>
          <ul className="pagination">
            <li className="page-item">
              <select
                {...opts}
                id={"ddlRoom" + groupID + "Child"}
                name={"ddlRoom" + groupID + "Child"}
                onChange={e => props.handleRoom('child', groupID, e.target.value)}
                className="form-control form-control-sm pull-left mr-1 mb-1"
                style={{ width: "auto" }}
                defaultValue={noOfChild}
              >
                <option value="1">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default HotelRoomWidgetsUmrah;
