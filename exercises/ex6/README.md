# Exercise 6 - Further enhance the value help dialog

In this exercise we enhance the value help dialog with another filter field for the region and we generalize the value help delegate in way that we don't hard code the relationship between region, country and location but we declare this relationship in the XML view by using the so-called payload.

## Exercise 6.1 - Enhance the filter field delegate with the metadata for regions

Since we now also use the region data, we have to enhance the filter bar delegate method ``fetchProperties``with the metadata informations for the region property.

**_vhfacilities/webapp/delegate/FilterBar.delegate.js_**

```javascript
...
    MyFilterBarDelegate.fetchProperties = function (oFilterBar) {
		return Promise.resolve([{
			name : "buildingRegion",
			path : "regionId",
			label : "Region",
			maxConditions: -1,
			dataType : "sap.ui.model.type.String"
		},{
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

## Exercise 6.2 - Add a filter field for the region to the view

Add a new filter field with a value help for the region to the filter bar in the `Building.view.xml`view.
Also make sure you define your own value help delegate `ui5con/vhdemo/delegate/ValueHelp.delegate`for all three filter fields, because we have to implement the relationship between them in the value help delegate.
Add a payload to each value help delegate for each filter field. The payload can be an arbitrary json object which is used in our case to describe the dependency between the conditions of the filter fields, for example, that a selected `buildingRegion` should set the filter for the property `RegionId` of the country and location filter fields.
Make sure to set the `name` of the `delegate` property of all three `mdc.ValueHelp`tags to your own `ui5con/vhdemo/delegate/ValueHelp.delegate` because the payload handling will be done in your delegate.

**_vhfacilities/webapp/view/Building.view.xml_**

```xml
...
<mdcvc:filterBar>
    <vhfb:FilterBar
        id="fbSelectBuildingDialog"
        liveMode="true"
        delegate="{name: 'ui5con/vhdemo/delegate/FilterBar.delegate', payload: {}}" >
        <vhfb:filterItems>
            <mdc:FilterField id="ffRegion" label="Region" dataType= "String" display="Description" propertyKey="buildingRegion" conditions= "{$filters>/conditions/buildingRegion}" valueHelp= "vhRegion">
                <mdc:dependents>
                    <mdc:ValueHelp id="vhRegion" delegate="{name: 'ui5con/vhdemo/delegate/ValueHelp.delegate', payload: {filterConditions:[]}}">
                        <mdc:typeahead>
                            <mdcv:Popover title="Region Selection">
                                <mdcvc:MTable id="regionTypeAhead" keyPath="id" descriptionPath="name" filterFields="*id,name*">
                                    <Table id="ddListRegions" items='{path : "facilities>/regions" }' width="20rem" mode="SingleSelectMaster">
                                        <columns>
                                            <Column/>
                                            <Column/>
                                        </columns>
                                        <items>
                                            <ColumnListItem type="Active">
                                                <cells>
                                                    <Text text="{facilities>id}"/>
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
            <mdc:FilterField id="ffCountry" label="Country" dataType= "String" display="Description" propertyKey="buildingCountry" conditions= "{$filters>/conditions/buildingCountry}" valueHelp= "vhCountry">
                <mdc:dependents>
                    <mdc:ValueHelp id="vhCountry" delegate="{name: 'ui5con/vhdemo/delegate/ValueHelp.delegate', payload: {filterConditions:[{condition:'regionId', filter:'buildingRegion'}]}}">
                        <mdc:typeahead>
                            <mdcv:Popover title="Country Selection">
                                <mdcvc:MTable id="countryTypeAhead" keyPath="id" descriptionPath="name" filterFields="*id,name*">
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
            <mdc:FilterField id="ffLocation" label="Location" dataType= "String" display="Description" propertyKey="buildingLocation" conditions="{$filters>/conditions/buildingLocation}" valueHelp="vhLocation">
                <mdc:dependents>
                    <mdc:ValueHelp id="vhLocation" delegate="{name: 'ui5con/vhdemo/delegate/ValueHelp.delegate', payload: {filterConditions:[{condition:'regionId', filter:'buildingRegion'},{condition:'countryId', filter:'buildingCountry'}]}}">
                        <mdc:typeahead>
                            <mdcv:Popover title="Location Selection">
                                <mdcvc:MTable id="locationTypeAhead" keyPath="id" descriptionPath="name" filterFields="*id,name*">
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

## Exercise 6.3 - Adapt the value help delegate to use the payload data

Setting the filters for the filter fields suggestion lists has to be implemented in the `getFilterConditions` method of the value help delegate. Since we now define this with the help of the payload in the XML view, we don't have to hard code this behavior for regions, countries, and locations but we retrieve the payload data from the view and create the filters based on that data. This way, the value help delegate could also be used for other kinds of data.

**_vhfacilities/webapp/delegate/ValueHelp.delegate.js_**

```javascript
sap.ui.define(
  ["sap/ui/mdc/ValueHelpDelegate", "sap/ui/mdc/p13n/StateUtil"],
  function (ValueHelpDelegate, StateUtil) {
    "use strict";

    var MyValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

    // called when ValueHelp for one of the three FilterFields is called
    MyValueHelpDelegate.getFilterConditions = function (
      oValueHelp,
      oContent,
      oConfig
    ) {
      var oConditions = ValueHelpDelegate.getFilterConditions(
        oValueHelp,
        oContent,
        oConfig
      );
      var oFilterBar = oValueHelp.getParent().getParent();

      return StateUtil.retrieveExternalState(oFilterBar).then(function (
        oState
      ) {
        var oFilter = oState.filter;
        var oFilterConditions = oValueHelp.getPayload().filterConditions;

        oFilterConditions.forEach((filterCondition) => {
          oConditions[filterCondition.condition] =
            oFilter[filterCondition.filter];
        });

        return oConditions;
      });
    };

    return MyValueHelpDelegate;
  }
);
```



## Summary

You've successfully accomplished [Exercise 6 - Further enhance the value help dialog](#exercise-6---further-enhance-the-value-help-dialog)

Continue to [Exercise 8 - Implementing custom content for the value help dialog](../ex8/README.md).
