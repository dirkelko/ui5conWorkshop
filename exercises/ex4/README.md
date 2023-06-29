# Exercise 4 - Adding a filter field to the value help dialog

In this exercise you'll enhance the application with a real value help dialog by adding this in the view.


## Exercise 4.1 - Add a filter bar with filter field to the view
The value help dialog with the list of buildings becomes much more useful if we can filter the list based on the building's properties. We enhance the dialog with a filter bar containing a filter field to select the country where we want to select a building from. The filter bar is again a pretty complex control tree which contains the filter field with value help specific wrapper controls. To maximize the comfort, the filter field has also a type ahead drop down list box which contains the list of available countries.

***valuehelp/webapp/view/Building.view.xml***

```xml
...
<mdc:dialog>
    <mdcv:Dialog id="diaSelectBuilding" title="SAP Buildings">
        <mdcvc:MDCTable keyPath="id" id="mdcvcTableBuildings" descriptionPath="name" >
            <mdcvc:filterBar>
                <vhfb:FilterBar 
                    id="FH1-Dialog-MDCTable-default-FB" 
                    liveMode="true" 
                    delegate="{name: 'ui5con/vhdemo/delegate/FilterBar.delegate', payload: {}}" >
                    <vhfb:filterItems>
                        <mdc:FilterField id="ffCountry" label="Country" dataType= "String" display="Description" propertyKey="buildingCountry" conditions= "{$filters>/conditions/buildingCountry}" fieldHelp= "vhCountry">
                            <mdc:dependents>
                                <mdc:ValueHelp id="vhCountry" delegate="{name: 'sap/ui/mdc/ValueHelpDelegate', payload: {}}">
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
                    </vhfb:filterItems>
                </vhfb:FilterBar>
            </mdcvc:filterBar>
            <mdc:Table id="mdcTableBuildings">
            ...
            </mdc:Table>
        </mdcvc:MDCTable>
    </mdcv:Dialog>
</mdc:dialog>
...
```

## Exercise 4.2 - Implement your own filter bar delegate
Like for the MDC Table we also have to provide a filter bar delegate for the MDC FilterBar to describe the property infos of our model. 
Create in the **delegate** folder of your project a new file **FilterBar.delegate.js** and implement the `fetchProperties` method to tell the filter bar the metadata of the `countryId` of our building model has.

***valuehelp/webapp/delegate/FilterBar.delegate.js***

```javascript
sap.ui.define([
	"sap/ui/mdc/FilterBarDelegate"
	], function (FilterBarDelegate) {
	"use strict";

	var MyFilterBarDelegate = Object.assign({}, FilterBarDelegate);

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
```

Run the example and check how the selection of one or more countries filters the table of the value help dialog.
## Summary

You've successfully accomplished [Exercise 4 - Adding a filter field to the value help dialog](#exercise-3---adding-a-filter-field-to-the-value-help-dialog)

Continue to [Exercise 5 - Define filter fields which depend on each other](../ex5/README.md).