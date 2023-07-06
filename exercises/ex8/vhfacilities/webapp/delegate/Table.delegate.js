/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/mdc/TableDelegate",
	"sap/ui/mdc/util/FilterUtil",
	"sap/ui/model/Filter",
	"sap/ui/core/Core"
], function (
	TableDelegate,
	FilterUtil,
	Filter,
	Core
) {
	"use strict";

	var MyTableDelegate = Object.assign({}, TableDelegate);

	// this is the stuff which would be steered by annotiations in OData scenarios
	MyTableDelegate.fetchProperties = function (oTable) {

		return Promise.resolve([{
			name : "buildingId",
			path : "id",
			label : "Id",
			key : true,
			dataType : "sap.ui.model.type.String",
			sortable : true
		},{
			name : "buildingName",
			path : "name",
			label : "Building Name",
			dataType : "sap.ui.model.type.String",
			sortable : true
		},{
			name : "buildingLocation",
			path : "locationId",
			label : "Location",
			dataType : "sap.ui.model.type.String",
			sortable : true
		},{
			name : "buildingCountry",
			path : "countryId",
			label : "Country",
			dataType : "sap.ui.model.type.String",
			sortable : true
		},{
			name : "buildingRegion",
			path : "regionId",
			label : "Region",
			dataType : "sap.ui.model.type.String",
			sortable : true
		}])
	};

	MyTableDelegate.updateBindingInfo = function (oMDCTable, oBindingInfo) {
		TableDelegate.updateBindingInfo.apply(this, arguments);
		oBindingInfo.path = oMDCTable.getPayload().collectionPath;

		/*var oFilter = Core.byId(oMDCTable.getFilter());
		var aFilters = [];

		var oFilterInfo = FilterUtil.getFilterInfo(
			MyTableDelegate.getTypeUtil(),
			oFilter.getConditions(),
			oFilter.getPropertyInfoSet());

		if (oFilterInfo.filters) {
			aFilters.push(oFilterInfo.filters);
		}
		oBindingInfo.filters = new Filter(aFilters, true);*/

	};

	return MyTableDelegate;
});