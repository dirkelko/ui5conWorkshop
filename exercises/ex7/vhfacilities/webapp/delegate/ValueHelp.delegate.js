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
], function (
	ValueHelpDelegate,
	StateUtil,
	Core,
	Condition,
	ConditionValidated
) {
	"use strict";

	let MyValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

	MyValueHelpDelegate.getFilterConditions = function (oValueHelp, oContent, oConfig) {

		let oConditions = ValueHelpDelegate.getFilterConditions(oValueHelp, oContent, oConfig);

		let oFilterBar = oValueHelp.getParent().getParent();
		return StateUtil.retrieveExternalState(oFilterBar).then(function (oState) {

			let oFilter = oState.filter;

			if (oContent.getControl().sId.endsWith("ffLocation")) {
				if (oFilter.buildingCountry && oFilter.buildingCountry.length > 0) {
					oConditions["countryId"] = oFilter.buildingCountry;
				}
			}

			return oConditions;
		});

	};

	function _addContext(oContext, sProperty, oStore) {
		var vProp = oContext.getProperty(sProperty);
			if (vProp) {
				oStore[sProperty] = vProp;
			}
	}

	MyValueHelpDelegate.createConditionPayload = function (oValueHelp, oContent, aValues, oContext) {
		var sIdentifier = oContent.getId();
		var oConditionPayload = {};
		oConditionPayload[sIdentifier] = [];

		if (oContent.sId.endsWith("locationTypeAhead")){
			if (oContext) {
				var oEntry = {};
				_addContext(oContext, "countryId", oEntry);
				if (Object.keys(oEntry).length) {
					oConditionPayload[sIdentifier].push(oEntry);
				}
			}
		}
		return oConditionPayload;
	};

	MyValueHelpDelegate.onConditionPropagation = function (oValueHelp, sReason, oConfig) {
		var oControl = oValueHelp.getControl();

			if (sReason !== "ControlChange") {
				return;
			}

			// find all conditions carrying country information
			var aAllConditionCountrys = oControl && oControl.getConditions().reduce(function (aResult, oCondition) {
				if (oCondition.payload) {
					Object.values(oCondition.payload).forEach(function (aSegments) {
						aSegments.forEach(function (oSegment) {
							if (oSegment["countryId"] && aResult.indexOf(oSegment["countryId"]) === -1) {
								aResult.push(oSegment["countryId"]);
							}
						});
					});
				}
				return aResult;
			}, []);

			if (aAllConditionCountrys && aAllConditionCountrys.length) {
				var oFilterBar = oControl.getParent();
				//var oFilterBar = Core.byId("FB0");
				StateUtil.retrieveExternalState(oFilterBar).then(function (oState) {
					var bModify = false;
					aAllConditionCountrys.forEach(function(sCountry) {
						var bExists = oState.filter && oState.filter['buildingCountry'] && oState.filter['buildingCountry'].find(function (oCondition) {
							return oCondition.values[0] === sCountry;
						});
						if (!bExists) {
							var oNewCondition = Condition.createCondition("EQ", [sCountry], undefined, undefined, ConditionValidated.Validated);
							oState.filter['buildingCountry'] = oState.filter && oState.filter['buildingCountry'] || [];
							oState.filter['buildingCountry'].push(oNewCondition);
							bModify = true;
						}
					});

					if (bModify) {
						StateUtil.applyExternalState(oFilterBar, oState);
					}
				});
			}
	};


	return MyValueHelpDelegate;

}

);