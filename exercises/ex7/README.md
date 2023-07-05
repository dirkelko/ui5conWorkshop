# Exercise 7 - Define filter fields which depend on each other - Out Parameters

Another functionality which can be implemented by value help delegates is to propagate a filter field with values (as if they have been selected by user) based on the selection of another filter field. In our scenario this could be done for the country filter field. We want to set automatically the corresponding country in the country filter field if the user chooeses directly a location without selecting the country before manually. (This doesn't make a lot of sense here but we want to demanstrate the functionality)

## Exercise 7.1 - Add the logic in the value help delegate to add a filter condition to the country filter field

Implementing out-parameters for filter fields is more complex. We hava to implement the functions `createConditionPayload` and `onConditionPropagation` to create the filter items based on the country of the selected location and then apply this condition to the country filter field. 

***vhfacilities/webapp/delegate/ValueHelp.delegate.js***

```javascript
...
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

		if (oContent.sId.endsWith("locationTypeAhead")) {
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
			StateUtil.retrieveExternalState(oFilterBar).then(function (oState) {
				var bModify = false;
				aAllConditionCountrys.forEach(function (sCountry) {
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

...
```

Run the app in the brwoser and check that selecting a location directly adds the correct country to the country filter field.


## Summary

You've successfully accomplished [Exercise 5 - Define filter fields which depend on each other](#exercise-5---define-filter-fields-which-depend-on-each-other)

Continue to [Exercise 6 - Further enhance the value help dialog](../ex6/README.md).
