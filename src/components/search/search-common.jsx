import { Component } from "react";
import moment from "moment";
import * as Global from "../../helpers/global";
import { apiRequester } from "../../services/requester";

class SearchCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  initialize_State = (isUmrahPackage = false) => {
    let availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    let business = Global.getEnvironmetKeyValue("availableBusinesses").find(x => x.sequenceNo === 1).name;
    if (this.props.mode === "home" || !this.props.match.params.locationName)
      return {
        searchKey: (new Date()).getTime(),
        businessName: business,
        isPaperRateMode: false,
        toLocation: "",
        fromLocation: localStorage.getItem("isUmrahPortal")
          ? {
            commonCode: "",
            countryID: "SA",
            id: "SA26",
            latitude: 0,
            longitude: 0,
            name: "Makkah, Saudi Arabia - Location",
            priority: 9999,
            type: "Location",
          }
          : "",
        dates: {
          checkInDate: moment()
            .add(Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays, 'days')
            .format(Global.DateFormate),
          checkOutDate: moment()
            .add(Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays
              + Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.stayInDays, 'days')
            .format(Global.DateFormate)
        },
        pax: business === "air" ? [
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
        ] : "",
        toLocationIsValid: "valid",
        fromLocationIsValid: "valid",
        paxIsValid: "valid",
        datesIsValid: "valid",
        isShowPaxInfoPopup: false,
        isShowMultiCityInfoPopup: false,
        isTripTypeInternational: true,
        tripDirection: "RoundTrip",
        searchWidgetKey: "",
        nationalityCode:
          (Global.getEnvironmetKeyValue("SETHOTELDEFAULTNATIONALITY", "cobrand") === "true")
            ? Global.getEnvironmetKeyValue("PortalCountryCode")
            : "",
        ACPercentage: "",
        ACPercentageIsValid: "valid",
        transportation_RouteIsValid: "valid",
        transportation_NoOfVehicleIsValid: "valid",
        transportation_NoOfPersonIsValid: "valid",
        transportation_Data_Route: this.getTransportationLookupData("route"),
        transportation_Data_Companies: this.getTransportationLookupData("companies"),
        transportation_Route: Global.getTransportationLookupData("route").length > 0 ? Global.getTransportationLookupData("route")[0].id : "",
        transportation_Companies: "",
        transportation_NoOfVehicle: "",
        transportation_NoOfPerson: "",
        groundservice_Data_Category: this.getGroundServiceLookupData("categories"),
        groundservice_Data_UOCompanies: this.getGroundServiceLookupData("uocompanies"),
        groundservice_Data_AdditionalService: this.getGroundServiceLookupData("additionalservice"),
        groundservice_Category: "",
        groundservice_UOCompanies: "",
        groundservice_AdditionalServices: [],
        groundservice_AdditionalServicesQuantity: [],
        groundservice_AdditionalServicesDuration: [],
        groundservice_CountryofResidence: Global.getEnvironmetKeyValue("PortalCountryCode"),
        groundservice_nationalityCode: Global.getEnvironmetKeyValue("PortalCountryCode"),
        groundservice_NoOfPersonIsValid: "valid",
        groundservice_NationalityIsValid: "valid",
        groundservice_CountryofResidenceIsValid: "valid",
        groundservice_NoOfPerson: "1",
        isAdvanceSearch: false,
        airCabinClass: "",
        isIndividualRoute: false,
        airAirLine: [],
        airDirectFlight: false,
        airRefundable: false,
        subPCCCode: "",
        specialCode: "",
        transfer_Hour: "09:00",
        transfer_HourIsValid: "valid",
        transfer_ReturnHour: "09:00",
        transfer_ReturnHourIsValid: "valid",
        transfer_PickupType: "Airport",
        transfer_DropoffType: "Airport",
        driverAge: "",
        driverAgeIsValid: "valid",
        minimumdriverAgeIsValid: "valid",
        getpromotion: false,
        showvehiclepromotion: false,
        vehiclepromotion_data: [],
        selectedvehiclepromotionprovider: "",
        selectedvehiclepromotioncode: "",
        showcodetextbox: false,
        showLoader: false,
        isUmrahPackage: isUmrahPackage,
        airMultiDestincationData: {
          noOfLocation: 2,
          locationInfo: [
            {
              fromLocationIsValid: "valid",
              fromLocation: {},
              toLocationIsValid: "valid",
              toLocation: {},
              datesIsValid: "valid",
              dates: {
                checkInDate: moment().add(availableBusinesses.find((x) => x.name === "air")?.cutOffDays ?? 0, "days").format(Global.InnerDateFormate)
              }
            },
            {
              fromLocationIsValid: "valid",
              fromLocation: {},
              toLocationIsValid: "valid",
              toLocation: {},
              datesIsValid: "valid",
              dates: {
                checkInDate: moment().add(availableBusinesses.find((x) => x.name === "air")?.cutOffDays ?? 0 + availableBusinesses.find((x) => x.name === "air")?.stayInDays ?? 0, "days").format(Global.InnerDateFormate)
              }
            }
          ]
        }
      };
    else if (this.props.mode === "modify") {
      return this.GetStateForListPage();
    }
  };

  changeTab = (businessName, umrahPackageInfo = null, isPaperRateMode = false,) => {
    //if ((businessName !== this.state.businessName && isPaperRateMode !== this.state.isPaperRateMode) || umrahPackageInfo) {
    if ((businessName !== this.businessName && isPaperRateMode !== this.isPaperRateMode)
      && (this.props?.match?.params?.checkInDate === undefined
        || umrahPackageInfo)) {
      let stateData = this.initialize_State();
      if (businessName === "air") {
        stateData.pax = [
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
        ]
      }
      stateData.businessName = businessName;
      if (stateData.businessName === "transfers") {
        stateData.tripDirection = "OneWay";
      }
      stateData.isPaperRateMode = isPaperRateMode;
      if (umrahPackageInfo) {
        stateData.dates = { checkInDate: umrahPackageInfo.startDate, checkOutDate: umrahPackageInfo.endDate };
        if (stateData.businessName === "air" && umrahPackageInfo.mode === "arrival") {
          stateData.dates = { checkInDate: moment(umrahPackageInfo.startDate).add(-1, 'days').format(Global.DateFormate), checkOutDate: umrahPackageInfo.endDate };
          if (umrahPackageInfo.umrahTravelTo === "4")
            stateData.tripDirection = "OneWay";
          else
            stateData.tripDirection = "RoundTrip";
          stateData.fromLocation = "";
          stateData.toLocation = {
            "name": umrahPackageInfo.umrahArrivalAirLocationName,
            "id": umrahPackageInfo.umrahArrivalAirLocationCode,
            "commonCode": "",
            "countryID": umrahPackageInfo.umrahCountryOfResidence,
            "latitude": 0,
            "longitude": 0,
            "priority": 1,
            "address": umrahPackageInfo.umrahArrivalAirLocationName
          };
          stateData.pax = [
            {
              type: "ADT",
              count: umrahPackageInfo.umrahPax.reduce((sum, i) => sum += (parseInt(i.noOfAdults) * parseInt(i.noOfRooms)), 0)
            },
            {
              type: "CHD",
              count: umrahPackageInfo.umrahPax.reduce((sum, i) => sum += (parseInt(i.noOfChild) * parseInt(i.noOfRooms)), 0)
            },
            {
              type: "INF",
              count: 0
            }
          ]
        }
        else if (stateData.businessName === "air" && umrahPackageInfo.mode === "departure") {
          stateData.dates = { checkInDate: umrahPackageInfo.endDate, checkOutDate: umrahPackageInfo.endDate };
          if (umrahPackageInfo.umrahTravelTo === "4")
            stateData.tripDirection = "OneWay";
          else
            stateData.tripDirection = "RoundTrip";
          stateData.fromLocation = {
            "name": umrahPackageInfo.umrahDepartureAirLocationName,
            "id": umrahPackageInfo.umrahDepartureAirLocationCode,
            "commonCode": "",
            "countryID": umrahPackageInfo.umrahCountryOfResidence,
            "latitude": 0,
            "longitude": 0,
            "priority": 1,
            "address": umrahPackageInfo.umrahDepartureAirLocationName
          };
          stateData.toLocation = "";
          stateData.pax = [
            {
              type: "ADT",
              count: umrahPackageInfo.umrahPax.reduce((sum, i) => sum += parseInt(i.noOfAdults), 0)
            },
            {
              type: "CHD",
              count: umrahPackageInfo.umrahPax.reduce((sum, i) => sum += parseInt(i.noOfChild), 0)
            },
            {
              type: "INF",
              count: 0
            }
          ]
        }
        else if (stateData.businessName === "hotel" && umrahPackageInfo.mode === "makkah") {
          stateData.fromLocation = {
            commonCode: "",
            countryID: "SA",
            id: "SA26_Makkah, Saudi Arabia - Location",
            latitude: 0,
            longitude: 0,
            name: "Makkah, Saudi Arabia - Location",
            priority: 9999,
            type: "Location",
          };
        }
        else if (stateData.businessName === "hotel" && umrahPackageInfo.mode === "madinah") {
          stateData.fromLocation = {
            commonCode: "",
            countryID: "SA",
            id: "SA25_Madinah, Saudi Arabia - Location",
            latitude: 0,
            longitude: 0,
            name: "Madinah, Saudi Arabia - Location",
            priority: 9999,
            type: "Location",
          };
        }
        let TotalPax = umrahPackageInfo.umrahPax.reduce((itemName, item) => itemName + (item.noOfRooms * item.noOfAdults) + (item.noOfRooms * item.noOfChild), 0);

        stateData.transportation_NoOfVehicle = umrahPackageInfo.umrahNoOfVehicle;
        stateData.transportation_NoOfPerson = TotalPax;
        stateData.groundservice_NoOfPerson = TotalPax;
        stateData.mode = umrahPackageInfo.mode;
        stateData.nationalityCode = umrahPackageInfo.umrahNationality;
        stateData.groundservice_CountryofResidence = umrahPackageInfo.umrahCountryOfResidence;
        stateData.isUmrahPackage = true;
        stateData.mode = umrahPackageInfo.mode;
      }
      this.setState(stateData);
      // Set State for Quotation Search Show
      this.setState({
        isSearch: true,
      });
    }
  };

  getSearchWidgetKey = () => {
    // key = { this.state.searchKey }
    let searchWidgetKey =
      this.props.match.params.checkInDate +
      this.props.match.params.checkOutDate +
      this.props.match.params.roomDetails;
    if (this.props.match.url.toLowerCase().indexOf("paperratesresults") > -1
      && this.props.match.params.checkInDate === undefined) {
      searchWidgetKey = "AirPaperRatesAll";
    }
    return searchWidgetKey;
  };

  changeairTripType1 = (mode) => {
    let dates = this.state.dates;
    if (this.state.businessName === "air") {
      if (this.state.tripDirection === "RoundTrip") dates.checkOutDate = dates.checkInDate;
      else {
        let checkOutDate = new Date(dates.checkOutDate);
        checkOutDate.setDate(checkOutDate.getDate() + 2);
        dates.checkOutDate = moment(checkOutDate).format(Global.DateFormate);
      }
    } else if (this.state.businessName === "transfers") {
      if (this.state.tripDirection === "RoundTrip") dates.checkOutDate = dates.checkInDate;
      else {
        let checkOutDate = new Date(dates.checkOutDate);
        checkOutDate.setDate(checkOutDate.getDate() + 2);
        dates.checkOutDate = moment(checkOutDate).format(Global.DateFormate);
      }
    }

    this.setState({
      tripDirection: !this.state.tripDirection,
      dates: dates,
    });
  };

  setPax = (pax) => {
    this.setState({
      pax: pax,
      paxIsValid: "valid",
    });
  };

  setAdditionalServices = (additionalservices) => {
    this.setState({
      groundservice_AdditionalServices: additionalservices,
      paxIsValid: "valid"
    });
  };

  setDate = (startDate, endDate) => {
    this.setState({
      dates: { checkInDate: startDate, checkOutDate: endDate },
      datesIsValid: "valid",
    });
  };

  handleStartDate = (startDate) => {
    if (moment(startDate).diff(moment(this.state.dates.checkInDate), "days") === 0)
      return;
    let availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    let endDate = moment(startDate).add(availableBusinesses.find((x) => x.name === this.state.businessName)?.stayInDays ?? 0, "days").format(Global.DateFormate);
    this.setDate(startDate, endDate);
  }

  handleEndDate = (startDate, endDate) => {
    if (this.state.dates.checkInDate)
      this.setDate(this.state.dates.checkInDate, startDate);
  }
  setToLocation = (toLocation) => {
    if (toLocation === undefined) {
      toLocation = "";
      this.setState({
        toLocation: toLocation,
        toLocationIsValid: "invalid",
      });
    }
    if (toLocation)
      this.setState({
        toLocation: toLocation,
        toLocationIsValid: "valid",
      });
  };

  setTransferStartHour = (TransferStartHour) => {
    if (TransferStartHour)
      this.setState({
        transfer_Hour: TransferStartHour,
        transfer_HourIsValid: "valid",
      });
  };

  setTransferReturnStartHour = (TransferReturnStartHour) => {
    if (TransferReturnStartHour)
      this.setState({
        transfer_ReturnHour: TransferReturnStartHour,
        transfer_ReturnHourIsValid: "valid",
      });
  };

  setPickupType = (TransferPickupType) => {
    if (TransferPickupType)
      this.setState({
        transfer_PickupType: TransferPickupType,
      });
  };

  setDropoffType = (TransferDropoffType) => {
    if (TransferDropoffType)
      this.setState({
        transfer_DropoffType: TransferDropoffType,
      });
  };

  setFromLocation = (fromLocation) => {
    if (fromLocation === undefined) {
      fromLocation = "";
      this.setState({
        fromLocation: fromLocation,
        fromLocationIsValid: "invalid",
        toLocation: this.state.toLocation,
        toLocationIsValid: this.state.toLocationIsValid,
      });
    }
    if ((localStorage.getItem("isUmrahPortal") && fromLocation && this.state.businessName !== "air") || (this.state.businessName === "transportation" || this.state.businessName === "groundservice"))
      fromLocation = {
        commonCode: "",
        countryID: "SA",
        id: fromLocation.split("_")[0],
        latitude: 0,
        longitude: 0,
        name: fromLocation.split("_")[1],
        priority: 9999,
        type: "Location",
      };

    let toLocation = this.state.toLocation;
    let toLocationIsValid = this.state.toLocationIsValid;
    if ((this.state.businessName === "transfers" || this.state.businessName === "vehicle") && fromLocation) {
      toLocation = fromLocation;
      toLocationIsValid = "valid"
    }
    if (fromLocation || localStorage.getItem("isUmrahPortal")) {
      this.setState({
        fromLocation: fromLocation,
        fromLocationIsValid: "valid",
        toLocation: toLocation,
        toLocationIsValid: toLocationIsValid,
      });
    }

  };

  ShowHideMulityCityInfoPopup = () => {
    this.setState({
      isShowMultiCityInfoPopup: !this.state.isShowMultiCityInfoPopup,
    });
  };

  ShowHidePaxInfoPopup = () => {
    this.setState({
      isShowPaxInfoPopup: !this.state.isShowPaxInfoPopup,
      isShowMultiCityInfoPopup: this.state.tripDirection === "multicity" && !this.state.isShowPaxInfoPopup ? false : this.state.isShowMultiCityInfoPopup
    });
  };

  clearCart = () => {
    var reqURL = "api/v1/cart/clear";
    var reqOBJ = {
      Request: {
        CartID: localStorage.getItem("cartLocalId"),
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
      }
    );
  };

  validateSearch = (mode) => {
    if (localStorage.getItem("portalType") === "B2C"
      && localStorage.getItem("isUmrahPortal") === "true"
      && localStorage.getItem("umrahPackageDetails")
      && !mode) {
      localStorage.removeItem('umrahPackageItems');
      localStorage.removeItem('umrahPackageDetails');
      this.clearCart();
    }

    var fromLocationIsValid =
      this.state.fromLocation !== "" &&
      typeof this.state.fromLocation === "object" &&
      this.state.fromLocation.name !== "";
    var toLocationIsValid =
      (this.state.businessName === "air" || this.state.businessName === "transfers") &&
        this.state.tripDirection === "RoundTrip"
        ? this.state.toLocation !== "" &&
        typeof this.state.toLocation === "object" &&
        this.state.toLocation.name !== ""
        : (this.state.businessName === "transfers" || this.state.businessName === "vehicle")
          ? this.state.toLocation !== "" &&
          typeof this.state.toLocation === "object" &&
          this.state.toLocation.name !== ""
          : true;
    if (mode === "umrah-package" && this.state.businessName === "air") {
      toLocationIsValid =
        this.state.toLocation !== "" &&
        typeof this.state.toLocation === "object" &&
        this.state.toLocation.name !== "";
    }

    var paxIsValid =
      this.state.pax !== "" && typeof this.state.pax === "object" && this.state.pax.length > 0;

    if (localStorage.getItem("isUmrahPortal") && this.state.businessName === "hotel" && (this.props.mode === "home" || this.props.mode === "modify")) {
      let TotalPax = this.state.pax.reduce((itemName, item) => itemName + (item.noOfRooms * item.noOfAdults) + (item.noOfRooms * item.noOfChild), 0);
      if (TotalPax > 9)
        paxIsValid = false;
    }

    var datesIsValid =
      this.state.dates !== "" &&
      typeof this.state.dates === "object" &&
      this.state.dates.checkInDate !== "" &&
      this.state.dates.checkOutDate !== "";

    if (this.state.businessName === "air") {
      if (fromLocationIsValid && toLocationIsValid) {
        let fromLocationID = Array.isArray(this.state.fromLocation)
          ? this.state.fromLocation[0].id
          : this.state.fromLocation.id;
        let toLocationID = Array.isArray(this.state.toLocation)
          ? this.state.toLocation[0].id
          : this.state.toLocation.id;
        if (fromLocationID === toLocationID) {
          fromLocationIsValid = false;
          toLocationIsValid = false;
        }
      }

      if (
        paxIsValid &&
        parseInt(this.state.pax.filter((x) => x.type === "ADT")[0].count) +
        parseInt(this.state.pax.filter((x) => x.type === "CHD")[0].count) +
        parseInt(this.state.pax.filter((x) => x.type === "INF")[0].count) >
        9
      )
        paxIsValid = false;
      else if (
        paxIsValid &&
        parseInt(this.state.pax.filter((x) => x.type === "ADT")[0].count) <
        parseInt(this.state.pax.filter((x) => x.type === "INF")[0].count)
      )
        paxIsValid = false;
    }

    let airMultiDestincationData = this.state.airMultiDestincationData;
    if (this.state.tripDirection.toLowerCase() === "multicity") {
      fromLocationIsValid = true;
      toLocationIsValid = true;
      datesIsValid = true;

      //Check no of trip
      let locationInfo = airMultiDestincationData.locationInfo;
      if (locationInfo.length < 2) {
        fromLocationIsValid = false;
        toLocationIsValid = false;
      }

      locationInfo.forEach((item, index, arr) => {
        if (arr.length - 1 > index) {
          if (locationInfo[index].dates === "" ||
            typeof locationInfo[index].dates !== "object" ||
            locationInfo[index].dates.checkInDate === "")
            datesIsValid = false;
          if (datesIsValid && (moment(locationInfo[index].dates.checkInDate).isAfter(locationInfo[index + 1].dates.checkInDate) || locationInfo[index].dates.checkInDate === locationInfo[index + 1].dates.checkInDate))
            datesIsValid = false;
        }

        let fromLocation = locationInfo[index].fromLocation;
        if (fromLocation === ""
          || typeof fromLocation !== "object"
          || fromLocation.name === "")
          fromLocationIsValid = false;

        let toLocation = locationInfo[index].toLocation;
        if (toLocation === ""
          || typeof toLocation !== "object"
          || toLocation.name === "")
          toLocationIsValid = false;

        if (fromLocationIsValid && toLocationIsValid &&
          (Array.isArray(locationInfo[index].fromLocation) && (locationInfo[index].fromLocation[0].id === locationInfo[index].toLocation[0].id
            || !Array.isArray(locationInfo[index].fromLocation)) && locationInfo[index].fromLocation.id === locationInfo[index].toLocation.id)) {
          fromLocationIsValid = false;
          toLocationIsValid = false;
        }

        airMultiDestincationData.locationInfo[index].datesIsValid = datesIsValid ? "valid" : "invalid";
        airMultiDestincationData.locationInfo[index].fromLocationIsValid = fromLocationIsValid ? "valid" : "invalid";
        airMultiDestincationData.locationInfo[index].toLocationIsValid = toLocationIsValid ? "valid" : "invalid";

      });
      airMultiDestincationData.isvalid = airMultiDestincationData.locationInfo.filter(x => x.datesIsValid === "invalid").length > 0 ? "invalid" :
        airMultiDestincationData.locationInfo.filter(x => x.datesIsValid === "invalid").length > 0 ? "invalid" :
          airMultiDestincationData.locationInfo.filter(x => x.datesIsValid === "invalid").length > 0 ? "invalid" : "valid";

      if (airMultiDestincationData.isvalid === "valid") {
        airMultiDestincationData.isvalid = airMultiDestincationData.locationInfo.filter(x => x.fromLocationIsValid === "invalid").length > 0 ? "invalid" :
          airMultiDestincationData.locationInfo.filter(x => x.fromLocationIsValid === "invalid").length > 0 ? "invalid" :
            airMultiDestincationData.locationInfo.filter(x => x.fromLocationIsValid === "invalid").length > 0 ? "invalid" : "valid";
      }
      if (airMultiDestincationData.isvalid === "valid") {
        airMultiDestincationData.isvalid = airMultiDestincationData.locationInfo.filter(x => x.toLocationIsValid === "invalid").length > 0 ? "invalid" :
          airMultiDestincationData.locationInfo.filter(x => x.toLocationIsValid === "invalid").length > 0 ? "invalid" :
            airMultiDestincationData.locationInfo.filter(x => x.toLocationIsValid === "invalid").length > 0 ? "invalid" : "valid";
      }
    }


    let transfer_HourIsValid = true;
    let transfer_ReturnHourIsValid = true;
    if (
      paxIsValid &&
      (this.state.businessName === "activity" ||
        this.state.businessName === "package" ||
        this.state.businessName === "transfers")
    ) {
      //Check blank values
      var inValidPaxCount = this.state.pax.reduce(
        (sum, key) => sum + (parseInt(key === "" ? 0 : key) > 0 ? 0 : 1),
        0
      );
      //Check atlease 1 adult
      let adultCount = this.state.pax.reduce(
        (sum, key) => sum + (parseInt(key === "" ? 0 : key) > 15 ? 1 : 0),
        0
      );
      if (adultCount === 0) inValidPaxCount = 1;
      if (inValidPaxCount > 0) paxIsValid = !paxIsValid;

      if (this.state.businessName === "transfers") {
        transfer_HourIsValid =
          this.state.transfer_Hour !== "-Select Hour-" && this.state.transfer_Hour !== "";
      }
      if (this.state.businessName === "transfers" && this.state.tripDirection === "RoundTrip") {
        transfer_ReturnHourIsValid =
          this.state.transfer_ReturnHour !== "-Select Hour-" &&
          this.state.transfer_ReturnHour !== "";
      }
    }

    let driverAgeIsValid = true;
    let minimumdriverAgeIsValid = true;
    if (this.state.businessName === "vehicle") {
      transfer_HourIsValid =
        this.state.transfer_Hour !== "-Select Hour-" && this.state.transfer_Hour !== "";
      transfer_ReturnHourIsValid =
        this.state.transfer_ReturnHour !== "-Select Hour-" &&
        this.state.transfer_ReturnHour !== "";
      driverAgeIsValid = this.state.driverAge !== ""
      if (driverAgeIsValid)
        minimumdriverAgeIsValid = parseInt(this.state.driverAge === "" ? 0 : this.state.driverAge) >= 18 ? true : false
      paxIsValid = true
    }

    let groundservice_NoOfPersonIsValid = true;
    let groundservice_NationalityIsValid = true;
    let groundservice_CountryofResidenceIsValid = true;
    if (this.state.businessName === "groundservice") {
      paxIsValid = true;
      if (
        isNaN(parseInt(this.state.groundservice_NoOfPerson)) ||
        parseInt(this.state.groundservice_NoOfPerson) <= 0
      )
        groundservice_NoOfPersonIsValid = false;
      if (this.state.groundservice_nationalityCode === "Select Nationality")
        groundservice_NationalityIsValid = false;
      if (this.state.groundservice_CountryofResidence === "Select Country")
        groundservice_CountryofResidenceIsValid = false;

      if (this.state.groundservice_AdditionalServices.length > 0) {
        this.state.groundservice_AdditionalServices.filter((x) => x.Selected === true).map((service) => {
          if (service.Quantity <= 0 || service.Duration <= 0) {
            paxIsValid = false;
            return null; // Add a return statement here
          }
          return service; // Return the service if the condition is not met (optional)
        });
      }
    }

    let transportation_RouteIsValid = true;
    let transportation_NoOfPersonIsValid = true;
    let transportation_NoOfVehicleIsValid = true;
    if (this.state.businessName === "transportation") {
      fromLocationIsValid = true;
      paxIsValid = true;
      transportation_RouteIsValid = this.state.transportation_Route !== "";
      if (
        isNaN(parseInt(this.state.transportation_NoOfPerson)) ||
        parseInt(this.state.transportation_NoOfPerson) <= 0
      )
        transportation_NoOfPersonIsValid = false;
      if (
        isNaN(parseInt(this.state.transportation_NoOfVehicle)) ||
        parseInt(this.state.transportation_NoOfVehicle) <= 0
      )
        transportation_NoOfVehicleIsValid = false;
      if (
        transportation_NoOfPersonIsValid &&
        transportation_NoOfVehicleIsValid &&
        parseInt(this.state.transportation_NoOfPerson) <
        parseInt(this.state.transportation_NoOfVehicle)
      ) {
        transportation_NoOfPersonIsValid = false;
        transportation_NoOfVehicleIsValid = false;
      }
      if (parseInt(this.state.transportation_NoOfPerson) > 60)
        transportation_NoOfPersonIsValid = false;
      if (parseInt(this.state.transportation_NoOfVehicle) > 10)
        transportation_NoOfVehicleIsValid = false;
    }

    var ACPercentageIsValid =
      this.state.ACPercentage === "" ||
      (/^\d+(\.\d+)?$/g.test(this.state.ACPercentage) &&
        parseFloat(this.state.ACPercentage) <= 100);

    this.setState({
      fromLocationIsValid: fromLocationIsValid ? "valid" : "invalid",
      toLocationIsValid: toLocationIsValid ? "valid" : "invalid",
      paxIsValid: paxIsValid ? "valid" : "invalid",
      datesIsValid: datesIsValid ? "valid" : "invalid",
      isShowPaxInfoPopup: !paxIsValid,
      ACPercentageIsValid: ACPercentageIsValid ? "valid" : "invalid",
      transportation_RouteIsValid: transportation_RouteIsValid ? "valid" : "invalid",
      transportation_NoOfPersonIsValid: transportation_NoOfPersonIsValid ? "valid" : "invalid",
      transportation_NoOfVehicleIsValid: transportation_NoOfVehicleIsValid ? "valid" : "invalid",
      transfer_HourIsValid: transfer_HourIsValid ? "valid" : "invalid",
      transfer_ReturnHourIsValid: transfer_ReturnHourIsValid ? "valid" : "invalid",
      driverAgeIsValid: driverAgeIsValid ? "valid" : "invalid",
      minimumdriverAgeIsValid: minimumdriverAgeIsValid ? "valid" : "invalid",
      groundservice_NoOfPersonIsValid: groundservice_NoOfPersonIsValid ? "valid" : "invalid",
      groundservice_NationalityIsValid: groundservice_NationalityIsValid ? "valid" : "invalid",
      groundservice_CountryofResidenceIsValid: groundservice_CountryofResidenceIsValid ? "valid" : "invalid",
      airMultiDestincationData: airMultiDestincationData,
      isShowMultiCityInfoPopup: airMultiDestincationData.isvalid === "invalid"
    });

    if (
      fromLocationIsValid &&
      toLocationIsValid &&
      paxIsValid &&
      datesIsValid &&
      ACPercentageIsValid &&
      transportation_RouteIsValid &&
      transportation_NoOfPersonIsValid &&
      transportation_NoOfVehicleIsValid &&
      transportation_NoOfVehicleIsValid &&
      transfer_HourIsValid &&
      transfer_ReturnHourIsValid &&
      driverAgeIsValid &&
      minimumdriverAgeIsValid &&
      groundservice_NoOfPersonIsValid &&
      groundservice_CountryofResidenceIsValid &&
      groundservice_NationalityIsValid
    ) {
      this.getRedirectToListPage(mode);
    }
    else {
    }
  };

  getRedirectToListPage = (mode) => {
    if (Global.getEnvironmetKeyValue("ClearCartOnSearch", "cobrand") === "true" && localStorage.getItem("cartLocalId") !== null) {
      this.clearCart();
    }
    let strQueryString = "";
    if (this.state.businessName === "hotel") {
      strQueryString = this.generateListPageQueryStringForHotel();
    } else if (this.state.businessName === "activity" || this.state.businessName === "package") {
      strQueryString = this.generateListPageQueryStringForActivity();
    } else if (this.state.businessName === "air") {
      strQueryString = this.generateListPageQueryStringForAir();
    } else if (this.state.businessName === "transportation") {
      strQueryString = this.generateListPageQueryStringForTransportation();
    } else if (this.state.businessName === "transfers") {
      strQueryString = this.generateListPageQueryStringForTransfers();
    } else if (this.state.businessName === "vehicle") {
      strQueryString = this.generateListPageQueryStringForVehicle();
    } else if (this.state.businessName === "groundservice") {
      strQueryString = this.generateListPageQueryStringForgroundservice();
    }
    //this.props.history.push(strQueryString);
    // For Quotation Check If mode quotation - not redirect to details
    if (mode === "quotation" || mode === "umrah-package") {
      this.handleSearchRequest(this.state)
    }
    else {
      this.props.history.push(strQueryString);
    }
  };

  generateListPageQueryStringForHotel = () => {
    let {
      fromLocation,
      dates,
      pax,
      ACPercentage,
      nationalityCode,
      specialCode,
      subPCCCode,
    } = this.state;

    Global.getEnvironmetKeyValue("SETHOTELDEFAULTNATIONALITY", "cobrand");

    fromLocation = Array.isArray(fromLocation) ? fromLocation[0] : fromLocation;
    var strQS = "";
    var totalNoOfAdult = 0;
    var totalNoOfChild = 0;
    if (localStorage.getItem("isUmrahPortal")) {
      strQS = pax
        .map((item) => {
          return (
            "noofrooms=" +
            item.noOfRooms +
            ",noofadults=" +
            item.noOfAdults +
            ",noofchild=" +
            item.noOfChild
          );
        })
        .join("|");
      //noofrooms=2|room1noOfAdults=2|room1noOfChild=1|room1childage=3|room2noOfAdults=2|room2noOfChild=1|room2childage=16|totalNoOfAdult=4|totalNoOfChild=2
    } else {
      strQS = "noofrooms=" + pax.length;
      for (var i = 0; i < pax.length; i++) {
        totalNoOfAdult += pax[i].noOfAdults;
        totalNoOfChild += pax[i].noOfChild;
        strQS += "|room" + (i + 1) + "noOfAdults=" + pax[i].noOfAdults;
        strQS += "|room" + (i + 1) + "noOfChild=" + pax[i].noOfChild;
        strQS += "|room" + (i + 1) + "childage=" + pax[i].childAge.toString().replace(/<1/g, "0");
      }
      strQS += "|totalNoOfAdult=" + totalNoOfAdult + "|totalNoOfChild=" + totalNoOfChild;
    }
    let strFilter = "";
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;
    if (specialCode && specialCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "specialCode=" + specialCode;
    if (subPCCCode && subPCCCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "subPCCCode=" + subPCCCode;
    if (nationalityCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "nationalityCode=" + nationalityCode;
    strFilter = strFilter === "" ? "filters" : strFilter;
    return `/Results/${this.state.businessName}/${fromLocation.name}/${fromLocation.id}/${fromLocation.commonCode}_${fromLocation.type}_${fromLocation.countryID}/${dates.checkInDate}/${dates.checkOutDate}/${strQS}/${strFilter}`;
  };

  generateListPageQueryStringForActivity = () => {
    let { fromLocation, dates, pax, ACPercentage, nationalityCode, } = this.state;
    fromLocation = Array.isArray(fromLocation) ? fromLocation[0] : fromLocation;
    let strFilter = "";
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;
    if (nationalityCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "nationalityCode=" + nationalityCode;
    strFilter = strFilter === "" ? "filters" : strFilter;

    return `/Results/${this.state.businessName}/${fromLocation.name}/${fromLocation.id}/${fromLocation.countryID
      }/${dates.checkInDate}/${dates.checkOutDate}/${pax.toString()}/${strFilter}`;
  };

  generateListPageQueryStringForAir = () => {
    let {
      fromLocation,
      toLocation,
      dates,
      pax,
      isTripTypeInternational,
      tripDirection,
      ACPercentage,
      nationalityCode,
      airCabinClass,
      airDirectFlight,
      airRefundable,
      airAirLine,
      isIndividualRoute,
      airMultiDestincationData
    } = this.state;

    let isShowIndividualRoutes = Global.getEnvironmetKeyValue("INDIVIDUALROUTES", "cobrand");
    if (isShowIndividualRoutes)
      isShowIndividualRoutes = isShowIndividualRoutes.toLowerCase() === "true";
    const isShowIndividualRoutesCountryID = isShowIndividualRoutes && Global.getEnvironmetKeyValue("INDIVIDUALROUTESCOUNTRYID", "cobrand");
    if (tripDirection.toLowerCase() === "roundtrip" && isShowIndividualRoutesCountryID) {
      if (fromLocation.countryID === isShowIndividualRoutesCountryID
        && toLocation.countryID === isShowIndividualRoutesCountryID) {
        isIndividualRoute = true;
        isTripTypeInternational = false
      }
      else
        isIndividualRoute = false;
    }
    if (tripDirection.toLowerCase() === "oneway" || tripDirection.toLowerCase() === "multicity") {
      isIndividualRoute = false;
    }
    fromLocation = Array.isArray(fromLocation) ? fromLocation[0] : fromLocation;
    toLocation = Array.isArray(toLocation) ? toLocation[0] : toLocation;
    let strLocation = '';
    let strIds = '';
    let strCountryCode = '';
    let strCheckinDate = "";
    let strCheckOutDate = "";
    if (tripDirection.toLowerCase() === "multicity") {
      airMultiDestincationData.locationInfo.forEach((item, index, arr) => {
        var tmpFromLocation = Array.isArray(item.fromLocation) ? item.fromLocation[0] : item.fromLocation;
        var tmpToLocation = Array.isArray(item.toLocation) ? item.toLocation[0] : item.toLocation;
        strLocation += (strLocation === "" ? "" : "|") + (tmpFromLocation.address ? tmpFromLocation.address : tmpFromLocation.name) +
          "|" + (tmpToLocation.address ? tmpToLocation.address : tmpToLocation.name);
        strIds += (strIds === "" ? "" : "|") + tmpFromLocation.id + "|" + tmpToLocation.id;
        strCountryCode += (strCountryCode === "" ? "" : "|") + tmpFromLocation.countryID + "|" + tmpToLocation.countryID;
        strCheckinDate += (strCheckinDate === "" ? "" : "|") + item.dates.checkInDate;
        strCheckOutDate += (strCheckOutDate === "" ? "" : "|") + (item.dates.checkOutDate ?? item.dates.checkInDate);
      });
    }
    else {
      strLocation = (fromLocation.address ? fromLocation.address : fromLocation.name) + "|" + (toLocation.address ? toLocation.address : toLocation.name);
      strIds = fromLocation.id + "|" + toLocation.id;
      strCountryCode = fromLocation.countryID + "|" + toLocation.countryID;
      strCheckinDate = dates.checkInDate;
      strCheckOutDate = dates.checkOutDate;
    }

    let strFilter = "";
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;
    if (nationalityCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "nationalityCode=" + nationalityCode;
    if (airCabinClass) strFilter += (strFilter === "" ? "" : "|") + "cabinclass=" + airCabinClass;
    if (airDirectFlight)
      strFilter += (strFilter === "" ? "" : "|") + "directflight=" + airDirectFlight;
    if (airRefundable) strFilter += (strFilter === "" ? "" : "|") + "refundable=" + airRefundable;
    if (airAirLine && airAirLine.id)
      strFilter +=
        (strFilter === "" ? "" : "|") +
        "airlinecode=" +
        airAirLine.id +
        "|airlinename=" +
        airAirLine.name;
    if (isShowIndividualRoutes && isIndividualRoute) strFilter += (strFilter === "" ? "" : "|") + "isIndividualRoute=" + isIndividualRoute;
    strFilter = strFilter === "" ? "filters" : strFilter;

    if (this.state.isPaperRateMode) {
      return `/PaperRatesResults/${this.state.businessName}/${strLocation}/${strIds}/${strCountryCode}/${strCheckinDate}/${strCheckOutDate}/${(isTripTypeInternational ? "international" : "domestic") +
        "," +
        tripDirection.toLowerCase() +
        "," +
        pax[0].count +
        "," +
        pax[1].count +
        "," +
        pax[2].count
        }/${strFilter}`;
    }
    else
      return `/Results/${this.state.businessName}/${strLocation}/${strIds}/${strCountryCode}/${strCheckinDate}/${strCheckOutDate}/${(isTripTypeInternational ? "international" : "domestic") +
        "," +
        tripDirection.toLowerCase() +
        "," +
        pax[0].count +
        "," +
        pax[1].count +
        "," +
        pax[2].count
        }/${strFilter}`;
  };
  generateListPageQueryStringForgroundservice = () => {
    let {
      dates,
      groundservice_AdditionalServices,
      groundservice_Category,
      groundservice_CountryofResidence,
      groundservice_nationalityCode,
      groundservice_UOCompanies,
      groundservice_NoOfPerson,
      ACPercentage,
    } = this.state;

    let strFilter = "";

    if (groundservice_UOCompanies !== "" && groundservice_UOCompanies !== undefined)
      strFilter += (strFilter === "" ? "" : "|") + "companies=" + groundservice_UOCompanies;
    if (groundservice_Category !== "")
      strFilter += (strFilter === "" ? "" : "|") + "category=" + groundservice_Category;
    if (groundservice_nationalityCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "nationality=" + groundservice_nationalityCode;
    if (groundservice_CountryofResidence !== "")
      strFilter += (strFilter === "" ? "" : "|") + "countryofresidence=" + groundservice_CountryofResidence;
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;

    let AdditionalServices = "";
    if (groundservice_AdditionalServices.length > 0) {
      groundservice_AdditionalServices
        .filter((x) => x.Selected === true)
        .forEach((service) => {
          if (AdditionalServices !== "") {
            AdditionalServices += "," + service.id + "_" + service.Quantity + "_" + service.Duration;
          } else {
            AdditionalServices = service.id + "_" + service.Quantity + "_" + service.Duration;
          }
        });
    }
    if (AdditionalServices !== "")
      strFilter += (strFilter === "" ? "" : "|") + "additionalservices=" + AdditionalServices;

    strFilter = strFilter === "" ? "filters" : strFilter;
    return `/Results/${this.state.businessName
      }/${groundservice_nationalityCode}/${groundservice_CountryofResidence}/${groundservice_NoOfPerson}/${dates.checkInDate
      }/${groundservice_NoOfPerson}/${groundservice_NoOfPerson}/${strFilter}`;
  };
  generateListPageQueryStringForTransportation = () => {
    let {
      dates,
      transportation_NoOfVehicle,
      transportation_NoOfPerson,
      transportation_Route,
      ACPercentage,
      transportation_Companies,
    } = this.state;

    let strFilter = "";

    if (transportation_Companies !== "")
      strFilter += (strFilter === "" ? "" : "|") + "companies=" + transportation_Companies;
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;
    strFilter = strFilter === "" ? "filters" : strFilter;
    let transportation_Route_Name = this.state.transportation_Data_Route.filter(
      (x) => x.id === transportation_Route.toString()
    )[0].name;
    return `/Results/${this.state.businessName
      }/${transportation_Route_Name}/${transportation_Route}/${transportation_NoOfVehicle}/${dates.checkInDate
      }/${transportation_NoOfPerson}/${transportation_Route + transportation_NoOfPerson + transportation_NoOfVehicle
      }/${strFilter}`;
    //path = "/Results/:    businessName            /:locationName          /:locationID            /:countryID                 /:checkInDate         /:checkOutDate        /:roomDetails   /:filters"
  };

  generateListPageQueryStringForTransfers = () => {
    let {
      fromLocation,
      toLocation,
      dates,
      pax,
      tripDirection,
      ACPercentage,
      transfer_PickupType,
      transfer_DropoffType,
      transfer_Hour,
      transfer_ReturnHour,
    } = this.state;
    fromLocation = Array.isArray(fromLocation) ? fromLocation[0] : fromLocation;
    toLocation = Array.isArray(toLocation) ? toLocation[0] : toLocation;
    let strFilter = "";
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;
    strFilter +=
      (strFilter === "" ? "" : "|") +
      "TripType=" +
      tripDirection.toLowerCase() +
      "|" +
      "PickupType=" +
      transfer_PickupType +
      "|" +
      "DropoffType=" +
      transfer_DropoffType +
      "|" +
      "TransfersStartHour=" +
      transfer_Hour.split(":")[0] +
      "|" +
      "TransfersStartMinute=" +
      transfer_Hour.split(":")[1];
    if (tripDirection === "RoundTrip")
      strFilter +=
        (strFilter === "" ? "" : "|") +
        "TransfersReturnStartHour=" +
        transfer_ReturnHour.split(":")[0] +
        "|" +
        "TransfersReturnStartMinute=" +
        transfer_ReturnHour.split(":")[1];
    strFilter = strFilter === "" ? "filters" : strFilter;
    return `/Results/${this.state.businessName}/${(fromLocation.address ? fromLocation.address : fromLocation.name) +
      "|" +
      (toLocation.address ? toLocation.address : toLocation.name)
      }/${fromLocation.id + "|" + toLocation.id}/${fromLocation.countryID + "|" + toLocation.countryID
      }/${dates.checkInDate}/${dates.checkOutDate}/${pax.toString()}/${strFilter}`;
  };

  generateListPageQueryStringForVehicle = () => {
    let {
      fromLocation,
      toLocation,
      dates,
      driverAge,
      ACPercentage,
      nationalityCode,
      transfer_Hour,
      transfer_ReturnHour,
      getpromotion,
      selectedvehiclepromotionprovider,
      selectedvehiclepromotioncode,
    } = this.state;
    fromLocation = Array.isArray(fromLocation) ? fromLocation[0] : fromLocation;
    toLocation = Array.isArray(toLocation) ? toLocation[0] : toLocation;
    let strFilter = "";
    if (ACPercentage !== "")
      strFilter += (strFilter === "" ? "" : "|") + "ACPercentage=" + ACPercentage;
    if (nationalityCode !== "")
      strFilter += (strFilter === "" ? "" : "|") + "nationalityCode=" + nationalityCode;
    strFilter +=
      (strFilter === "" ? "" : "|") +
      "PickupHour=" +
      transfer_Hour.split(":")[0] +
      "|" +
      "PickupMinute=" +
      transfer_Hour.split(":")[1];

    strFilter +=
      (strFilter === "" ? "" : "|") +
      "DropOffHour=" +
      transfer_ReturnHour.split(":")[0] +
      "|" +
      "DropOffMinute=" +
      transfer_ReturnHour.split(":")[1];

    if (getpromotion) {
      if (selectedvehiclepromotionprovider !== "" && selectedvehiclepromotioncode !== "") {
        strFilter +=
          (strFilter === "" ? "" : "|") +
          "PromotionProviderID=" +
          selectedvehiclepromotionprovider.split("_")[0] +
          "|" +
          "PromotionProviderName=" +
          selectedvehiclepromotionprovider.split("_")[1] +
          "|" +
          "PromotionCode=" +
          selectedvehiclepromotioncode;
      }
    }
    strFilter = strFilter === "" ? "filters" : strFilter;
    return `/Results/${this.state.businessName}/${(fromLocation.address ? fromLocation.address : fromLocation.name) +
      "|" +
      (toLocation.address ? toLocation.address : toLocation.name)
      }/${fromLocation.id + "|" + toLocation.id}/${fromLocation.countryID + "|" + toLocation.countryID
      }/${dates.checkInDate}/${dates.checkOutDate}/${driverAge.toString()}/${strFilter}`;
  };

  GetStateForListPage = () => {
    let availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    var roomDetailsElements = this.props.match.params.roomDetails.split("|");
    return {
      businessName: this.props.match.params.businessName,
      totalNoOfAdult:
        this.props.match.params.businessName === "hotel" &&
          roomDetailsElements.find((element) => element.startsWith("totalNoOfAdult="))
          ? parseInt(
            roomDetailsElements
              .find((element) => element.startsWith("totalNoOfAdult="))
              .replace("totalNoOfAdult=", "")
          )
          : 0,
      totalNoOfChild:
        this.props.match.params.businessName === "hotel" &&
          roomDetailsElements.find((element) => element.startsWith("totalNoOfChild="))
          ? parseInt(
            roomDetailsElements
              .find((element) => element.startsWith("totalNoOfChild="))
              .replace("totalNoOfChild=", "")
          )
          : 0,
      fromLocation: [
        {
          name: this.props.match.params.locationName.split("|")[0],
          id: this.props.match.params.locationID.split("|")[0],
          commonCode:
            this.props.match.params.businessName === "hotel"
              ? this.props.match.params.countryID.split("_")[0]
              : "",
          countryID:
            this.props.match.params.businessName === "hotel"
              ? this.props.match.params.countryID.split("_")[2]
              : this.props.match.params.countryID.split("|")[0],
          latitude: 0,
          longitude: 0,
          priority: 1,
          address:
            this.props.match.params.businessName === "air" ||
              this.props.match.params.businessName === "transfers"
              ? this.props.match.params.locationName.split("|")[0]
              : null,
          type: this.props.match.params.countryID
            ? this.props.match.params.countryID.split("_")[1]
            : "Location",
        },
      ],
      toLocation:
        this.props.match.params.locationID.indexOf("|") === -1
          ? []
          : [
            {
              name: this.props.match.params.locationName.split("|")[1],
              id: this.props.match.params.locationID.split("|")[1],
              commonCode: "",
              countryID: this.props.match.params.countryID.split("|")[1],
              latitude: 0,
              longitude: 0,
              priority: 1,
              address:
                this.props.match.params.businessName === "air" ||
                  this.props.match.params.businessName === "transfers"
                  ? this.props.match.params.locationName.split("|")[1]
                  : null,
              type: "Location",
            },
          ],
      dates: this.props.match.params.roomDetails.toLowerCase().split(",")[1] === "multicity" ? {
        checkInDate: this.props.match.params.checkInDate.split("|")[0] + "T00:00:00",
        checkOutDate: this.props.match.params.checkInDate.split("|")[0] + "T00:00:00",
      } : {
        checkInDate: this.props.match.params.checkInDate,
        checkOutDate: this.props.match.params.checkOutDate,
      },
      pax:
        this.props.match.params.businessName === "hotel"
          ? this.getroomDetailsFromQueryString(this.props.match.params.roomDetails)
          : this.props.match.params.businessName === "activity" ||
            this.props.match.params.businessName === "package" ||
            this.props.match.params.businessName === "transfers" ||
            this.props.match.params.businessName === "transportation"
            ? this.props.match.params.roomDetails.split(",")
            : this.props.match.params.businessName === "air"
              ? [
                {
                  type: "ADT",
                  count: this.props.match.params.roomDetails.split(",")[2],
                },
                {
                  type: "CHD",
                  count: this.props.match.params.roomDetails.split(",")[3],
                },
                {
                  type: "INF",
                  count: this.props.match.params.roomDetails.split(",")[4],
                },
              ]
              : [],
      toLocationIsValid: "valid",
      fromLocationIsValid: "valid",
      paxIsValid: "valid",
      datesIsValid: "valid",
      isShowPaxInfoPopup: false,
      isTripTypeInternational:
        this.props.match.params.businessName === "air"
          ? this.props.match.params.roomDetails.toLowerCase().split(",")[0] === "international"
            ? true
            : false
          : true,
      tripDirection:
        this.props.match.params.businessName === "air" ||
          this.props.match.params.businessName === "transfers"
          ? this.props.match.params.businessName === "transfers" &&
            this.getFilterValue("TripType") === "roundtrip"
            ? "RoundTrip"
            : this.props.match.params.roomDetails.toLowerCase().split(",")[1] === "roundtrip"
              ? "RoundTrip"
              : this.props.match.params.roomDetails.toLowerCase().split(",")[1] === "multicity" ? "multicity" : "OneWay"
          : "RoundTrip",
      ACPercentage: this.getFilterValue("ACPercentage"),
      nationalityCode: this.getFilterValue("nationalityCode"),
      transportation_Data_Route: Global.getTransportationLookupData("route"),
      transportation_Data_Companies: Global.getTransportationLookupData("companies"),
      transportation_Route: parseInt(this.props.match.params.locationID),
      transportation_NoOfVehicle: this.props.match.params.countryID,
      transportation_NoOfPerson: this.props.match.params.checkOutDate,
      transportation_Companies: this.getFilterValue("companies"),
      groundservice_Data_Category: this.getGroundServiceLookupData("categories"),
      groundservice_Data_UOCompanies: this.getGroundServiceLookupData("uocompanies"),
      groundservice_Data_AdditionalService: this.getGroundServiceLookupData("additionalservice"),
      groundservice_Category: this.getFilterValue("category"),
      groundservice_UOCompanies: this.getFilterValue("companies"),
      groundservice_nationalityCode: this.getFilterValue("nationality"),
      groundservice_CountryofResidence: this.getFilterValue("countryofresidence"),
      groundservice_AdditionalServices: this.getgroundserviceadditionalService(this.getFilterValue("additionalservices")),
      groundservice_NoOfPerson: this.props.match.params.checkOutDate,
      transfer_PickupType: this.getFilterValue("PickupType"),
      transfer_DropoffType: this.getFilterValue("DropoffType"),
      transfer_Hour: (this.props.match.params.businessName === "transfers" ?
        this.getFilterValue("TransfersStartHour") +
        ":" +
        this.getFilterValue("TransfersStartMinute") : this.getFilterValue("PickupHour") +
        ":" +
        this.getFilterValue("PickupMinute")),
      transfer_ReturnHour:
        this.props.match.params.businessName === "transfers" &&
          this.getFilterValue("TripType") === "roundtrip"
          ? this.getFilterValue("TransfersReturnStartHour") +
          ":" +
          this.getFilterValue("TransfersReturnStartMinute")
          : this.getFilterValue("DropOffHour") +
          ":" +
          this.getFilterValue("DropOffMinute"),
      driverAge: this.props.match.params.roomDetails,
      airMultiDestincationData: this.props.match.params.businessName === "air" && this.props.match.params.roomDetails.toLowerCase().split(",")[1] === "multicity" ? this.getAirMultiDestincationData() :
        {
          noOfLocation: 2,
          locationInfo: [
            {
              fromLocationIsValid: "valid",
              fromLocation: {},
              toLocationIsValid: "valid",
              toLocation: {},
              datesIsValid: "valid",
              dates: {
                checkInDate: moment().add(availableBusinesses.find((x) => x.name === "air")?.cutOffDays ?? 0, "days").format(Global.InnerDateFormate)
              }
            },
            {
              fromLocationIsValid: "valid",
              fromLocation: {},
              toLocationIsValid: "valid",
              toLocation: {},
              datesIsValid: "valid",
              dates: {
                checkInDate: moment().add(availableBusinesses.find((x) => x.name === "air")?.cutOffDays ?? 0 + availableBusinesses.find((x) => x.name === "air")?.stayInDays ?? 0, "days").format(Global.InnerDateFormate)
              }
            }
          ]
        }
    };
  };

  getAirMultiDestincationData = () => {
    return {
      noOfLocation: this.props.match.params.checkInDate.split('|').length,
      locationInfo: [...Array(this.props.match.params.checkInDate.split('|').length).keys()].map((element, index) => {
        return {
          fromLocationIsValid: "valid",
          fromLocation: [
            {
              name: this.props.match.params.locationName.split("|")[index * 2],
              id: this.props.match.params.locationID.split("|")[index * 2],
              commonCode: "",
              countryID: this.props.match.params.countryID.split("|")[index * 2],
              latitude: 0,
              longitude: 0,
              priority: 1,
              address: this.props.match.params.locationName.split("|")[index * 2],
              type: "Location",
            },
          ],
          toLocationIsValid: "valid",
          toLocation:
            [
              {
                name: this.props.match.params.locationName.split("|")[(index * 2) + 1],
                id: this.props.match.params.locationID.split("|")[(index * 2) + 1],
                commonCode: "",
                countryID: this.props.match.params.countryID.split("|")[(index * 2) + 1],
                latitude: 0,
                longitude: 0,
                priority: 1,
                address: this.props.match.params.locationName.split("|")[(index * 2) + 1],
                type: "Location",
              },
            ],
          datesIsValid: "valid",
          dates: {
            checkInDate: this.props.match.params.checkInDate.split("|")[index],
            checkOutDate: this.props.match.params.checkInDate.split("|")[index],
          }
        }

      })
    };
  }

  getgroundserviceadditionalService = (additionalfiltervalues) => {
    let services = this.getGroundServiceLookupData("additionalservice");
    let additionalservices = [];
    services.map((service) => (
      additionalservices.push(
        {
          id: service.id,
          name: service.name,
          Quantity: 0,
          Duration: 0,
          Selected: false,
          Disabled: true
        }
      )
    ))
    if (additionalfiltervalues !== "") {
      let additionalservicessplitted = additionalfiltervalues.split(",");
      additionalservicessplitted.forEach((item) => {
        additionalservices.find((x) => x.id === item.split("_")[0]).Quantity = item.split("_")[1];
        additionalservices.find((x) => x.id === item.split("_")[0]).Duration = item.split("_")[2];
        additionalservices.find((x) => x.id === item.split("_")[0]).Selected = true;
        additionalservices.find((x) => x.id === item.split("_")[0]).Disabled = true;
      });
    }
    return additionalservices;
  };
  getFilterValue = (filter) => {
    if (this.props.match.params.filters === "filters") return "";
    else if (this.props.match.params.filters.split("|").find((x) => x.startsWith(filter + "="))) {
      return this.props.match.params.filters
        .split("|")
        .find((x) => x.startsWith(filter + "="))
        .replace(filter + "=", "");
    } else return "";
  };

  //Method for detial page landing
  getPaxObject = (data) => {
    if (this.props.match.params.businessName === "hotel") {
      var paxInfo = [];
      data.map((room, index) => {
        var noOfAdults = 0;
        var noOfChildren = 0;
        var childage = [];
        (room.item !== undefined ? room.item : room.Item !== undefined ? room.Item : []).map(
          (pax) => {
            if (pax.typeString === "ADT") noOfAdults += pax.quantity;
            if (pax.typeString === "CHD") {
              noOfChildren += pax.quantity;
              childage.push(pax.age);
            }
            return true;
          }
        );
        var roomData = {
          roomID: index + 1,
          noOfAdults: noOfAdults,
          noOfChild: noOfChildren,
          childAge: childage,
        };
        paxInfo.push(roomData);
        return true;
      });
      return paxInfo;
    } else if (
      this.props.match.params.businessName === "activity" ||
      this.props.match.params.businessName === "package" ||
      this.props.match.params.businessName === "transfers"
    ) {
      return data[0].Item.reduce((sum, key) => sum + (sum === "" ? "" : ",") + key.Age, "").split(
        ","
      );
    }
  };

  //Query string to search widget pax component
  getroomDetailsFromQueryString = (data) => {
    var strArray = data.split("|");
    var roomInfo = [];
    if (localStorage.getItem("isUmrahPortal")) {
      roomInfo = strArray.map((room, key) => {
        return {
          groupID: key + 1,
          noOfRooms: parseInt(
            room
              .split(",")
              .find((element) => element.startsWith("noofrooms"))
              .replace("noofrooms=", "")
          ),
          noOfAdults: parseInt(
            room
              .split(",")
              .find((element) => element.startsWith("noofadults"))
              .replace("noofadults=", "")
          ),
          noOfChild: parseInt(
            room
              .split(",")
              .find((element) => element.startsWith("noofchild"))
              .replace("noofchild=", "")
          ),
        };
      });
    } else {
      var noofroom = localStorage.getItem("isUmrahPortal")
        ? "0"
        : parseInt(
          strArray.find((element) => element.startsWith("noofrooms")).replace("noofrooms=", "")
        );
      for (let i = 0; i < noofroom; i++) {
        var objroom = {
          roomID: i + 1,
          noOfAdults: localStorage.getItem("isUmrahPortal")
            ? "0"
            : parseInt(
              strArray
                .find((element) => element.startsWith("room" + (i + 1) + "noOfAdults="))
                .replace("room" + (i + 1) + "noOfAdults=", "")
            ),
          noOfChild: localStorage.getItem("isUmrahPortal")
            ? "0"
            : parseInt(
              strArray
                .find((element) => element.startsWith("room" + (i + 1) + "noOfChild="))
                .replace("room" + (i + 1) + "noOfChild=", "")
            ),
          childAge: localStorage.getItem("isUmrahPortal")
            ? []
            : strArray
              .find((element) => element.startsWith("room" + (i + 1) + "childage="))
              .replace("room" + (i + 1) + "childage=", "")
              .split(","),
        };
        roomInfo.push(objroom);
      }
    }
    return roomInfo;
  };

  changeairType = (type) => {
    let isTripTypeInternational = false;
    if (type === "Domestic") {
      //this.changeairTripType("OneWay");
    }
    else
      isTripTypeInternational = true;

    this.setState({
      isTripTypeInternational: isTripTypeInternational,
    });
  }

  changeairTripType = (mode) => {
    let dates = this.state.dates;
    if (this.state.businessName === "air") {
      if (this.state.tripDirection === "RoundTrip")
        dates.checkOutDate = dates.checkInDate;
      else {
        let checkOutDate = moment(dates.checkOutDate);
        dates.checkOutDate = moment(checkOutDate).add(2, 'days').format(Global.DateFormate);
      }
    } else if (this.state.businessName === "transfers") {
      if (this.state.tripDirection === "RoundTrip") dates.checkOutDate = dates.checkInDate;
      else {
        let checkOutDate = moment(dates.checkOutDate);
        dates.checkOutDate = moment(checkOutDate).add(2, 'days').format(Global.DateFormate);
      }
    }

    this.setState({
      tripDirection: mode,
      dates: dates,
      isShowMultiCityInfoPopup: false
    });
  };

  handleNationality = (e) => {
    this.setState({ nationalityCode: e.target.value });
  };

  handleGroundServiceNationality = (e) => {
    this.setState({ groundservice_nationalityCode: e.target.value });
  };

  handleCountryofResidence = (e) => {
    let groundservice_nationalityCode = e.target.value;
    this.setState({
      groundservice_CountryofResidence: e.target.value,
      groundservice_CountryofResidenceIsValid: "valid",
      groundservice_nationalityCode: groundservice_nationalityCode,
      groundservice_NationalityIsValid: "valid"
    });
  };

  handleACPercentage = (e) => {
    this.setState({
      ACPercentage: e.target.value,
    });
  };

  handlevehiclePromotionCode = (e) => {
    this.setState({
      selectedvehiclepromotioncode: e.target.value,
    });
  };

  handleTransportationRoute = (data) => {
    this.setState({
      transportation_Route: data,
    });
  };

  handleGroundServiceCategory = (data) => {
    this.setState({
      groundservice_Category: data,
    });
  };

  handleVehiclePromotionProvider = (data) => {
    let showcodetextbox = false;
    if (data !== "") {
      showcodetextbox = true;
    }
    this.setState({
      selectedvehiclepromotionprovider: data,
      showcodetextbox: showcodetextbox,
    });
  };

  getGroundServiceLookupData = (lookupName) => {
    let isLookupAvailable = true;
    if (lookupName === "categories") {
      if (this.state.groundservice_Data_Category && this.state.groundservice_Data_Category.length > 0)
        return this.state.groundservice_Data_Category;
      else if (
        localStorage.getItem("groundservice_Category_" + localStorage.getItem("lang")) !== null
      ) {
        return JSON.parse(
          localStorage.getItem("groundservice_Category_" + localStorage.getItem("lang"))
        );
      }
      isLookupAvailable = false;
    } else if (lookupName === "uocompanies") {
      if (
        this.state.groundservice_Data_UOCompanies &&
        this.state.groundservice_Data_UOCompanies.length > 0
      )
        return this.state.groundservice_Data_UOCompanies;
      else if (
        localStorage.getItem("groundservice_UOCompanies_" + localStorage.getItem("lang")) !== null
      ) {
        return JSON.parse(
          localStorage.getItem("groundservice_UOCompanies_" + localStorage.getItem("lang"))
        );
      }
      isLookupAvailable = false;
    } else if (lookupName === "additionalservice") {
      if (
        this.state.groundservice_Data_AdditionalService &&
        this.state.groundservice_Data_AdditionalService.length > 0
      )
        return this.state.groundservice_Data_AdditionalService;
      else if (
        localStorage.getItem("groundservice_AdditionalService_" + localStorage.getItem("lang")) !== null
      ) {
        return JSON.parse(
          localStorage.getItem("groundservice_AdditionalService_" + localStorage.getItem("lang"))
        );
      }
      isLookupAvailable = false;
    }
    if (
      !isLookupAvailable &&
      Global.getEnvironmetKeyValue("availableBusinesses") &&
      Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === "transportation")
    ) {
      let reqURL = "api/v1/lookup";
      let lang = localStorage.getItem("lang");
      let availableLang = Global.getEnvironmetKeyValue("availableLanguages");
      localStorage.setItem("groundservice_Category_" + localStorage.getItem("lang"), "[]");
      localStorage.setItem("groundservice_UOCompanies_" + localStorage.getItem("lang"), "[]");
      localStorage.setItem("groundservice_AdditionalService_" + localStorage.getItem("lang"), "[]");


      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "groundservice:categories",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "groundservice_Category_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
            this.setState({
              groundservice_Data_Category: data.response,
            });
          } else localStorage.removeItem("groundservice_Category_" + localStorage.getItem("lang"));
        }
      );
      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "groundservice:uocompanies",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "groundservice_UOCompanies_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
          } else
            localStorage.removeItem("groundservice_UOCompanies_" + localStorage.getItem("lang"));
        }
      );
      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "groundservice:additionalservice",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "groundservice_AdditionalService_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
          } else
            localStorage.removeItem("groundservice_AdditionalService_" + localStorage.getItem("lang"));
        }
      );
      return [];
    } else return [];
  };

  getTransportationLookupData = (lookupName) => {
    let isLookupAvailable = true;
    if (lookupName === "route") {
      if (this.state.transportation_Data_Route && this.state.transportation_Data_Route.length > 0)
        return this.state.transportation_Data_Route;
      else if (
        localStorage.getItem("transportation_route_" + localStorage.getItem("lang")) !== null
      ) {
        return JSON.parse(
          localStorage.getItem("transportation_route_" + localStorage.getItem("lang"))
        );
      }
      isLookupAvailable = false;
    } else if (lookupName === "companies") {
      if (
        this.state.transportation_Data_Companies &&
        this.state.transportation_Data_Companies.length > 0
      )
        return this.state.transportation_Data_Companies;
      else if (
        localStorage.getItem("transportation_companies_" + localStorage.getItem("lang")) !== null
      ) {
        return JSON.parse(
          localStorage.getItem("transportation_companies_" + localStorage.getItem("lang"))
        );
      }
      isLookupAvailable = false;
    }
    if (
      !isLookupAvailable &&
      Global.getEnvironmetKeyValue("availableBusinesses") &&
      Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === "transportation")
    ) {
      let reqURL = "api/v1/lookup";
      let lang = localStorage.getItem("lang");
      let availableLang = Global.getEnvironmetKeyValue("availableLanguages");
      localStorage.setItem("transportation_route_" + localStorage.getItem("lang"), "[]");
      localStorage.setItem("transportation_categories_" + localStorage.getItem("lang"), "[]");
      localStorage.setItem("transportation_vehicletypes_" + localStorage.getItem("lang"), "[]");
      localStorage.setItem("transportation_companies_" + localStorage.getItem("lang"), "[]");

      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "transportation:routes",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "transportation_route_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
            this.setState({
              transportation_Data_Route: data.response,
              transportation_Route: data.response.length > 0 ? data.response[0].id : ""
            });
          } else localStorage.removeItem("transportation_route_" + localStorage.getItem("lang"));
        }
      );
      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "transportation:categories",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "transportation_categories_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
          } else
            localStorage.removeItem("transportation_categories_" + localStorage.getItem("lang"));
        }
      );
      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "transportation:vehicletypes",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "transportation_vehicletypes_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
          } else
            localStorage.removeItem("transportation_vehicletypes_" + localStorage.getItem("lang"));
        }
      );
      apiRequester(
        reqURL,
        {
          info: {
            cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
          },
          request: "transportation:companies",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "transportation_companies_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
          } else
            localStorage.removeItem("transportation_companies_" + localStorage.getItem("lang"));
        }
      );
      return [];
    } else return [];
  };

  handleTransportationPax = (event) => {
    if (event.target.name === "noofvehicle")
      this.setState({
        transportation_NoOfVehicle: event.target.value,
      });
    else if (event.target.name === "noofperson")
      this.setState({
        transportation_NoOfPerson: event.target.value,
      });
  };

  handleGroundservicePax = (event) => {
    if (event.target.name === "noofperson")
      this.setState({
        groundservice_NoOfPerson: event.target.value,

      });
  };

  handlePickupType = (event) => {
    this.setState({
      transfer_PickupType: event.target.value,
    });
  };

  handleDropoffType = (event) => {
    this.setState({
      transfer_DropoffType: event.target.value,
    });
  };

  handleTransferStartHour = (event) => {
    this.setState({
      transfer_Hour: event.target.value,
    });
  };

  handleAdvanceSearch = () => {
    this.setState({
      isAdvanceSearch: !this.state.isAdvanceSearch,
    });
  };

  handleAirAirline = (data) => {
    this.setState({
      airAirLine: data,
    });
  };

  handleAirCabinClass = (e) => {
    this.setState({
      airCabinClass: e.target.value,
    });
  };

  handleAirRefundable = () => {
    this.setState({
      airRefundable: !this.state.airRefundable,
    });
  };

  handleAirDirectFlight = () => {
    this.setState({
      airDirectFlight: !this.state.airDirectFlight,
    });
  };

  handleIsIndividualRoute = () => {
    this.setState({
      isIndividualRoute: !this.state.isIndividualRoute,
    });
  };

  handlegetpromotions = () => {
    let showvehiclepromotion = false;
    let reqURL = "api/v1/vehicle/search/operator";
    let vehiclepromotion_data = [];
    let getpromotion = false;
    if (!this.state.getpromotion) {
      getpromotion = true;
      apiRequester(
        reqURL,
        {
          request: "vehicle",
        },
        function (data) {
          if (data.status.code === 0) {
            localStorage.setItem(
              "promotionlist_" + localStorage.getItem("lang"),
              JSON.stringify(data.response)
            );
            vehiclepromotion_data = data.response;
            showvehiclepromotion = true;
            this.setState({
              getpromotion: getpromotion,
              showvehiclepromotion: showvehiclepromotion,
              vehiclepromotion_data: vehiclepromotion_data,
            });
          }
          else {
            localStorage.removeItem("promotionlist_" + localStorage.getItem("lang"));
            this.setState({
              getpromotion: getpromotion,
              showvehiclepromotion: false,
              vehiclepromotion_data: [],
            });
          }
        }
      );
    }
    else {
      this.setState({
        getpromotion: getpromotion,
        showvehiclepromotion: showvehiclepromotion,
        vehiclepromotion_data: vehiclepromotion_data,
        showcodetextbox: false,
        selectedvehiclepromotioncode: "",
      });
    }
  }

  handleTransportationCompany = (data) => {
    if (data)
      this.setState({
        transportation_Companies: data.id,
      });
  };

  handleGroundServiceCompany = (data) => {
    let uocompines = "";
    if (data) {
      uocompines = data.id;
    }
    this.setState({
      groundservice_UOCompanies: uocompines,
    });

  };

  handleSwapLocation = () => {
    this.setState({
      toLocation: JSON.parse(JSON.stringify(this.state.fromLocation)),
      fromLocation: JSON.parse(JSON.stringify(this.state.toLocation)),
    });
  };

  handleSpecialCode = (e) => {
    this.setState({
      specialCode: e.target.value,
    });
  };

  handleSubPCCCode = (e) => {
    this.setState({
      subPCCCode: e.target.value,
    });
  };

  handleDriverAge = (e) => {
    this.setState({
      driverAge: e.target.value,
    });
  };

  addRemoveMultidestinationData = (mode, index) => {
    let airMultiDestincationData = this.state.airMultiDestincationData;

    if (mode === "add") {
      let availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
      let dateAdds = moment(airMultiDestincationData.locationInfo[airMultiDestincationData.locationInfo.length - 1].dates.checkInDate).diff(moment(), 'days') + 1
      dateAdds = dateAdds + availableBusinesses.find((x) => x.name === "air").stayInDays;

      airMultiDestincationData.noOfLocation = airMultiDestincationData.noOfLocation++;
      airMultiDestincationData.locationInfo.push({
        fromLocationIsValid: "valid",
        fromLocation: {},
        toLocationIsValid: "valid",
        toLocation: {},
        datesIsValid: "valid",
        dates: {
          checkInDate: moment().add(dateAdds, "days").format(Global.InnerDateFormate)
        }
      });
    }
    else if (mode === "remove") {
      airMultiDestincationData.locationInfo.splice(index, 1);
    }
    this.setState({
      airMultiDestincationData
    });
  }

  handleMultidestinationData = (sequenceNo, element, data) => {

    let airMultiDestincationData = this.state.airMultiDestincationData;
    if (element === "date") {
      var startDate = data;
      airMultiDestincationData.locationInfo[sequenceNo].dates = { checkInDate: startDate };
      airMultiDestincationData.locationInfo[sequenceNo].datesIsValid = "valid";
    }

    if (element === "fromlocation") {
      var fromLocation = data;
      if (fromLocation === undefined) {
        fromLocation = "";
        airMultiDestincationData.locationInfo[sequenceNo].fromLocation = fromLocation;
        airMultiDestincationData.locationInfo[sequenceNo].fromLocationIsValid = "invalid";
      }

      if (fromLocation) {
        airMultiDestincationData.locationInfo[sequenceNo].fromLocation = fromLocation;
        airMultiDestincationData.locationInfo[sequenceNo].fromLocationIsValid = "valid";
      }
    }

    if (element === "tolocation") {
      var toLocation = data;
      if (toLocation === undefined) {
        toLocation = "";
        airMultiDestincationData.locationInfo[sequenceNo].toLocation = toLocation;
        airMultiDestincationData.locationInfo[sequenceNo].toLocationIsValid = "invalid";
      }
      if (toLocation) {
        airMultiDestincationData.locationInfo[sequenceNo].toLocation = toLocation;
        airMultiDestincationData.locationInfo[sequenceNo].toLocationIsValid = "valid";
      }
    }

    this.setState({
      airMultiDestincationData
    });

  }

  handlePaperRates_ViewAll = () => {
    this.props.history.push(`/PaperRatesResults/${this.state.businessName}`);
  }
}

export default SearchCommon;
