/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/mdc/ValueHelpDelegate",
	"sap/ui/mdc/p13n/StateUtil"
], function(
	ValueHelpDelegate,
	StateUtil
) {
	"use strict";

	let MyValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

	MyValueHelpDelegate.getFilterConditions = function (oValueHelp, oContent, oConfig) {

		let oConditions = ValueHelpDelegate.getFilterConditions(oValueHelp, oContent, oConfig);
		
		let oFilterBar = oValueHelp.getParent().getParent();
	
		return StateUtil.retrieveExternalState(oFilterBar).then(function (oState) {
	
			let oFilter = oState.filter;

			let oFilterConditions = oValueHelp.getPayload().filterConditions;

			if(oFilter){
				oFilterConditions.forEach(filterCondition => {
					if (oFilter[filterCondition.filter]){
						oConditions[filterCondition.condition] = oFilter[filterCondition.filter];
					}
				});
			}
	
			/*
			if (oContent.getControl().sId.endsWith("ffLocation")){
				if (oFilter.buildingCountry && oFilter.buildingCountry.length>0){
					oConditions["countryId"] = oFilter.buildingCountry;
				}
				if (oFilter.buildingRegion && oFilter.buildingRegion.length>0){
					oConditions["regionId"] = oFilter.buildingRegion;
				}
			}
			if (oContent.getControl().sId.endsWith("ffCountry")){
				if (oFilter.buildingRegion && oFilter.buildingRegion.length>0){
					oConditions["regionId"] = oFilter.buildingRegion;
				}
			}
			*/
		
			return oConditions;
		});
	
	};			

	return MyValueHelpDelegate;

}

);