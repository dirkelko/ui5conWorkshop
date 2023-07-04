/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/FilterBarDelegate"
	], function (FilterBarDelegate) {
	"use strict";

	let MyFilterBarDelegate = Object.assign({}, FilterBarDelegate);

    MyFilterBarDelegate.fetchProperties = function (oFilterBar) {
		return Promise.resolve([{
			name : "buildingCountry",
			path : "countryId",
			label : "Location",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
		}])
	};

	return MyFilterBarDelegate;
});