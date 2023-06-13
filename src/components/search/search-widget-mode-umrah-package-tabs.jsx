import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";
import * as DropdownList from "../../helpers/dropdown-list";

class SearchWidgetModeUmrahPackageTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type } = this.props;
    let availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    if (this.props.quotationInfo.umrahFlight) {
      availableBusinesses = availableBusinesses.filter(x => x.name !== "air");
    }

    let travelTo = DropdownList.LookupTravelTo.find(x => x.value === this.props.quotationInfo.umrahTravelTo);
    let FlightArrival = !this.props.quotationInfo.umrahFlight && travelTo.arrivalAirLocationCode !== "";
    let FlightDeparture = !this.props.quotationInfo.umrahFlight && travelTo.departureAirLocationCode !== "";
    let HotelMakkah = travelTo.hotelLocationCode1 === "SA26" || travelTo.hotelLocationCode2 === "SA26";
    let HotelMadinah = travelTo.hotelLocationCode1 === "SA25" || travelTo.hotelLocationCode2 === "SA25";
    let Transportation = true; //DropdownList.LookupTravelTo.find(x => x.value === travelTo).name;
    let GroundService = true; //DropdownList.LookupTravelTo.find(x => x.value === travelTo).name;

    var umrahPackageItems = JSON.parse(localStorage.getItem("umrahPackageItems"))
    var umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"))

    let isAirArrivalSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "air"
          && x.offlineItem.toLocation === travelTo.arrivalAirLocationCode) !== undefined;

    let isAirDepartureSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "air"
          && x.offlineItem.fromLocation === travelTo.departureAirLocationCode) !== undefined;

    let isHotelMakkahSelected =
      umrahPackageItems && umrahPackageItems
        .find(x => x.offlineItem.business === "hotel"
          && (x.offlineItem.fromLocation === "SA26")) !== undefined;

    let isHotelMadinahSelected =
    umrahPackageItems && umrahPackageItems
      .find(x => x.offlineItem.business === "hotel"
        && (x.offlineItem.fromLocation === "SA25")) !== undefined;
    
    let isTransportationSelected = umrahPackageItems && umrahPackageItems.find(x => x.offlineItem.business === "transportation");
    let isGroundserviceSelected = umrahPackageItems && umrahPackageItems.find(x => x.offlineItem.business === "groundservice");

    //isHotelMakkahSelected = false;

    return (
      <div className="quotation-btn umrah-package text-center">
        <h5 className="mb-4">
          <span className="d-inline-block bg-light border p-2">
            <SVGIcon name={"plus"} className="mr-2" width="10" type="fill"></SVGIcon>
            {type === "Quotation" && Trans("_addItemsToQuotation")}
            {type === "Itinerary" && Trans("_addItemsToItinerary")}
            {type === "umrah-package" && "Add Itinerary To Umrah Package"}
          </span>
        </h5>

        {FlightArrival && !isAirArrivalSelected &&
          <button className="btn" onClick={() => this.props.changeTab("air", "arrival")}>
            <SVGIcon name={"air"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              {"Flight to " + travelTo.arrivalAirLocationCode}</small>
          </button>
        }

        {FlightArrival && isAirArrivalSelected &&
          <button className="btn">
            <SVGIcon name={"air"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              <SVGIcon name={"yes"} className="yesSVG" width="10" fill={"white"} type="fill"></SVGIcon>{" "}
              {"Flight to " + travelTo.arrivalAirLocationCode}</small>
          </button>
        }

        {HotelMakkah && !isHotelMakkahSelected &&
          <button className="btn text-center" onClick={() => this.props.changeTab("hotel", "makkah")}>
            <SVGIcon name={"hotel"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>Makkah Hotel</small>
          </button>
        }
        {HotelMakkah && isHotelMakkahSelected &&
          <button className="btn text-center">
            <SVGIcon name={"hotel"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              <SVGIcon name={"yes"} className="yesSVG" width="10" fill={"white"} type="fill"></SVGIcon>
              Makkah Hotel</small>
          </button>
        }

        {HotelMadinah && !isHotelMadinahSelected &&
          <button className="btn text-center" onClick={() => this.props.changeTab("hotel", "madinah")}>
            <SVGIcon name={"hotel"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>Madinah Hotel</small>
          </button>
        }

        {HotelMadinah && isHotelMadinahSelected &&
          <button className="btn text-center">
            <SVGIcon name={"hotel"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              <SVGIcon name={"yes"} className="yesSVG" width="10" fill={"white"} type="fill"></SVGIcon>
              Makkah Hotel</small>
          </button>
        }

        {Transportation && !isTransportationSelected &&
          <button className="btn text-center" onClick={() => this.props.changeTab("transportation")}>
            <SVGIcon name={"transportation"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>Transportation</small>
          </button>
        }

        {Transportation && isTransportationSelected &&
          <button className="btn text-center">
            <SVGIcon name={"transportation"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              <SVGIcon name={"yes"} className="yesSVG" width="10" fill={"white"} type="fill"></SVGIcon>
            Transportation</small>
          </button>
        }

        {
          GroundService && !isGroundserviceSelected &&
          <button className="btn text-center" onClick={() => this.props.changeTab("groundservice")}>
            <SVGIcon name={"groundservice"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>Ground service</small>
          </button>
        }

        {
          GroundService && isGroundserviceSelected &&
          <button className="btn text-center">
            <SVGIcon name={"groundservice"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              <SVGIcon name={"yes"} className="yesSVG" width="10" fill={"white"} type="fill"></SVGIcon>
              Ground service</small>
          </button>
        }

        {FlightDeparture && !isAirDepartureSelected &&
          <button className="btn" onClick={() => this.props.changeTab("air", "departure")}>
            <SVGIcon name={"air"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>{"Flight From " + travelTo.departureAirLocationCode}</small>
          </button>
        }

        {FlightDeparture && isAirDepartureSelected &&
          <button className="btn">
            <SVGIcon name={"air"} width="28" type="fill"></SVGIcon>{" "}
            <small className='yesSmall'>
              <SVGIcon name={"yes"} className="yesSVG" width="10" fill={"white"} type="fill"></SVGIcon>
              {"Flight From " + travelTo.departureAirLocationCode}</small>
          </button>
        }

        {/* {availableBusinesses.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {(item.name === "hotel" ||
                item.name === "air" ||
                item.name === "activity" ||
                item.name === "transfers" ||
                item.name === "transportation" ||
                item.name === "groundservice"
              ) && (
                  <button className="btn" onClick={() => this.props.changeTab(item.name)}>
                    <SVGIcon name={item.name + "new"} width="28" type="fill"></SVGIcon>{" "}
                    <small>{Trans("_widgetTab" + item.name + "")}</small>
                  </button>
                )}
            </React.Fragment>
          );
        })} */}

      </div >
    );
  }
}

export default SearchWidgetModeUmrahPackageTabs;
