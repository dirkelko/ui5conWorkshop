/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/mdc/ValueHelpDelegate",
	"sap/ui/mdc/p13n/StateUtil",
	"sap/ui/core/Core",
	"sap/ui/mdc/condition/Condition",	
	'sap/ui/mdc/enum/ConditionValidated'
], function(
	ValueHelpDelegate,
	StateUtil,
	Core,
	Condition,
	ConditionValidated
) {
	"use strict";

	var MyValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

	// called when ValueHelp for one of the three FilterFields is called
	MyValueHelpDelegate.getFilterConditions = function (oValueHelp, oContent, oConfig) {

		var oConditions = ValueHelpDelegate.getFilterConditions(oValueHelp, oContent, oConfig);
		
		//var oActiveControl = oConfig && oConfig.control || oContent.getControl();
        //var oFilterBar = oActiveControl && oActiveControl.getParent();
		var oFilterBar = oValueHelp.getParent().getParent();
	
		return StateUtil.retrieveExternalState(oFilterBar).then(function (oState) {
	
			var oFilter = oState.filter;

			var oFilterConditions = oValueHelp.getPayload().filterConditions;

			oFilterConditions.forEach(filterCondition => {
				oConditions[filterCondition.condition] = oFilter[filterCondition.filter];
			});
	
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