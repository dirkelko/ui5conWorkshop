/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/FilterBarDelegate"
	], function (FilterBarDelegate) {
	"use strict";

	/**
	 * Helper class for sap.ui.mdc.FilterBar.
	 * <h3><b>Note:</b></h3>
	 * The class is experimental and the API/behaviour is not finalized and hence this should not be used for productive usage.
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.odata.v4.FilterBarDelegate
	 */
	var MyFilterBarDelegate = Object.assign({}, FilterBarDelegate);

    MyFilterBarDelegate.fetchProperties = function (oFilterBar) {
		return Promise.resolve([{
			name : "buildingRegion",
			path : "regionId",
			label : "Region",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
			//typeConfig: MyFilterBarDelegate.getTypeUtil().getTypeConfig("String")
		},{
			name : "buildingCountry",
			path : "countryId",
			label : "Country",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
			//typeConfig: MyFilterBarDelegate.getTypeUtil().getTypeConfig("String")
		},{
			name : "buildingLocation",
			path : "locationId",
			label : "Location",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
			//typeConfig: MyFilterBarDelegate.getTypeUtil().getTypeConfig("String")
		}])

};

	return MyFilterBarDelegate;
});