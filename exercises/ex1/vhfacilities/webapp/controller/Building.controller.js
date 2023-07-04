sap.ui.define([
  "./BaseController",
  "sap/m/MessageBox"
], function (BaseController, MessageBox) {
  "use strict";

  return BaseController.extend("ui5con.vhdemo.controller.Main", {
    onInit: function () {
      this.getView().bindElement({ path: "/buildings/59", model: "facilities" });
    },
    onBuildingSelected: function (oEvent) {
      let selID = oEvent.getSource().getValue();
      let oModel = this.getView().getModel("facilities");
      let aBuildings = oModel.getObject("/buildings");
      let selIndex = aBuildings.findIndex(building => building.id === selID);
      this.getView().bindElement({ path: "/buildings/" + selIndex, model: "facilities" });
    },
    onGetCountryName: function (countryId) {
      return countryId ? this.getView().getModel("facilities").oData.countries.find(c => c.id == countryId).name : '';
    },
    onGetLocationName: function (locationId) {
      return locationId ? this.getView().getModel("facilities").oData.locations.find(c => c.id == locationId).name : '';
    },
    onGetAddress: function (buildingId) {
      let street = buildingId ? this.getView().getModel("facilities").oData.buildings.find(c => c.id == buildingId).street : '';
      let zip_code = buildingId ? this.getView().getModel("facilities").oData.buildings.find(c => c.id == buildingId).zip : '';
      let city = buildingId ? this.getView().getModel("facilities").oData.buildings.find(c => c.id == buildingId).city : '';
      return street + ', ' + zip_code + ' ' + city;
    }


  });

});
