# Exercise 5 - Define filter fields which depend on each other

Even with the filter field for countries the list of buildings can still be pretty large, e.g. if we select Germany. Therefore we want to be able to select also the location with a second filter field. The list of available locations should be dependent of the selected countries, of course. We can define this behavior by implementing the corresponding methods in our filter bar delegate.

## Exercise 5.1 - Add a second filter field to the filter bar for selecting locations

Add a second filter field for selecting the location after the filter field for the country to the filter bar in our building view. The drop down list box of this second filter field should be filtered by the selected countries of the first field. To implement this behavior we need our own value help delegate for the location filter field. Therefore the delegate for the value help of this filter field is not the base delegate but our own `ui5con/vhdemo/delegate/ValueHelp.delegate`which will be created in the next step.

***valuehelp/webapp/view/Building.view.xml***

```xml
...
    <vhfb:FilterBar 
        id="fbSelectBuildingDialog" 
        liveMode="true" 
        delegate="{name: 'ui5con/vhdemo/delegate/FilterBar.delegate', payload: {}}" >
        <vhfb:filterItems>
            <mdc:FilterField 
                id="ffCountry" 
                label="Country" 
                dataType= "String" 
                display="Description" 
                propertyKey="buildingCountry" 
                conditions= "{$filters>/conditions/buildingCountry}" 
                valueHelp= "vhCountry">
                <mdc:dependents>
                    <mdc:ValueHelp 
                        id="vhCountry" 
                        delegate="{name: 'sap/ui/mdc/ValueHelpDelegate', payload: {}}">
                        <mdc:typeahead>
                            <mdcv:Popover title="Country Selection">
                                <mdcvc:MTable 
                                    id="countryTypeAhead" 
                                    keyPath="id" 
                                    descriptionPath="name" 
                                    filterFields="*id,name*">
                                    <Table  id="ddListCountries" 
                                            items='{path : "facilities>/countries", sorter: { path: "name", ascending: "true" }  }' 
                                            width="20rem" 
                                            mode="MultiSelect">
                                        <columns>
                                            <Column/>
                                        </columns>
                                        <items>
                                            <ColumnListItem type="Active">
                                                <cells>
                                                    <Text text="{facilities>name}"/>
                                                </cells>
                                            </ColumnListItem>
                                        </items>
                                    </Table>
                                </mdcvc:MTable>
                            </mdcv:Popover>
                        </mdc:typeahead>                                                        
                    </mdc:ValueHelp>
                </mdc:dependents>
            </mdc:FilterField>
            <mdc:FilterField 
                id="ffLocation" 
                label="Location" 
                dataType= "String" 
                display="Description" 
                propertyKey="buildingLocation" 
                conditions="{$filters>/conditions/buildingLocation}" 
                valueHelp="vhLocation">
                <mdc:dependents>
                    <mdc:ValueHelp 
                        id="vhLocation" 
                        delegate="{name: 'ui5con/vhdemo/delegate/ValueHelp.delegate', payload: {}}">
                        <mdc:typeahead>
                            <mdcv:Popover title="Location Selection">
                                <mdcvc:MTable 
                                    id="locationTypeAhead" 
                                    keyPath="id" 
                                    descriptionPath="name" 
                                    filterFields="*id,name*">
                                    <Table  id="taTableLocation" 
                                            items='{path : "facilities>/locations", sorter: { path: "name", ascending: "true" }  }' 
                                            width="20rem" 
                                            mode="MultiSelect">
                                        <columns>
                                            <Column/>
                                        </columns>
                                        <items>
                                            <ColumnListItem type="Active">
                                                <cells>
                                                    <Text text="{facilities>name}"/>
                                                </cells>
                                            </ColumnListItem>
                                        </items>
                                    </Table>
                                </mdcvc:MTable>
                            </mdcv:Popover>
                        </mdc:typeahead>                                                        
                    </mdc:ValueHelp>
                </mdc:dependents>
            </mdc:FilterField>
        </vhfb:filterItems>
    </vhfb:FilterBar>
</mdcvc:filterBar>
...
```

## Exercise 5.2 - Enhance the filter field delegate with the metadata for locations

Since we now also use the country data, we have to enhance the filter bar delegate method ``fetchProperties`` with the metadata information for the country property.

**_valuehelp/webapp/delegate/FilterBar.delegate.js_**

```javascript
...
    MyFilterBarDelegate.fetchProperties = function (oFilterBar) {
		return Promise.resolve([{
			name : "buildingCountry",
			path : "countryId",
			label : "Country",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
		},{
			name : "buildingLocation",
			path : "locationId",
			label : "Location",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
		}])

	};
...

```

## Exercise 5.3 - Create a value help delegate to implement the filter conditions for the second filter field

Create a new file ***ValueHelp.delegate.js*** in the ***delegate*** folder of your project and implement the ``getFilterCondition``method, that applies the filter setting of the country filter field to the locations suggestion list so that only locations of the selected countries are displayed.

In this method we check that the currently used control is the filter field for the location. If this is the case we get the filter conditions of all other filters. In our case we retrieve the IDs (or technically the conditions containing ` "countryId" "EQ" "..." ` ) of the countries which have been selected in the country filter field. Based on these conditions we create a filter condition for the location's `countryId` property, which is applied to the suggestion list, narrowing down the list of locations to the selected countries.

***valuehelp/webapp/delegate/ValueHelp.delegate.js***

```javascript
sap.ui.define([
	"sap/ui/mdc/ValueHelpDelegate",
	"sap/ui/mdc/p13n/StateUtil"
], function (
	ValueHelpDelegate,
	StateUtil
) {
	"use strict";

	var MyValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

	MyValueHelpDelegate.getFilterConditions = function (oValueHelp, oContent, oConfig) {
		var oConditions = ValueHelpDelegate.getFilterConditions(oValueHelp, oContent, oConfig);
		var oFilterBar = oValueHelp.getParent().getParent();
		return StateUtil.retrieveExternalState(oFilterBar).then(function (oState) {
			var oFilter = oState.filter;
			if (oContent.getControl().sId.endsWith("ffLocation")) {
				if (oFilter.buildingCountry && oFilter.buildingCountry.length > 0) {
					oConditions["countryId"] = oFilter.buildingCountry;
				}
			}
			return oConditions;
		});
	};
	return MyValueHelpDelegate;

}

);
```

Run the app in the brwoser and check that the selectable locations depend on the formerly selected countries.


## Summary

You've successfully accomplished [Exercise 5 - Define filter fields which depend on each other](#exercise-5---define-filter-fields-which-depend-on-each-other)

Continue to [Exercise 6 - Further enhance the value help dialog](../ex6/README.md).
