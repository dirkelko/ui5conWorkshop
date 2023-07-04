# Exercise 3 - Create a value help dialog with a table

In this exercise you'll enhance the application with a value help dialog by adding this to the view. 

## Exercise 3.1 - Add a value help dialog to the view
In addition to the type-ahead functionality we want to have a more complex dialog which allows you to select a building. In the first step we just want to see a table which displays the list of buildings with a few more columns than the suggestion list of the last step. Add the code for the dialog below the `mdc:typeahed` control into the view. Also the value help dialog consists of several nested controls. The buildings are displayed in the new `sap.ui.mdc.Table`. It can contain different kinds of inner tables, here we choose the grid table for this task.

***vhfacilities/webapp/view/Building.view.xml***

```xml
<mdc:Field 
    id="fldBuilding" 
    value="{path: 'id', type: 'sap.ui.model.type.String', mode: 'OneWay'}"
    valueHelp="vhSelectBuilding" 
    display="Description" 
    editMode="Editable" 
    width="20rem"
    change=".onBuildingSelected">
    <mdc:dependents>
        <mdc:ValueHelp 
            id="vhSelectBuilding"
            delegate="{name: 'sap/ui/mdc/ValueHelpDelegate', payload: {}}"> 
            <mdc:typeahead>
            ....
            </mdc:typeahead>
            <mdc:dialog>
                <mdcv:Dialog id="diaSelectBuilding" title="SAP Buildings">
                    <mdcvc:MDCTable 
                        keyPath="id" 
                        id="mdcvcTableBuildings" 
                        descriptionPath="name" >
                        <mdc:Table id="mdcTableBuildings"
                            autoBindOnInit="true"
                            width="100%"
                            height="100%"
                            p13nMode="Sort"
                            selectionMode="SingleMaster"
                            delegate="{name: 'ui5con/vhdemo/delegate/Table.delegate', payload: {collectionPath: 'facilities>/buildings'}}"
                            threshold="50"
                            enableAutoColumnWidth="true">
                            <mdc:columns>
                                <mdct:Column id="cnBuildingId" header="ID" propertyKey="buildingId" width="10%">
                                    <Text text="{facilities>id}"/>
                                </mdct:Column> 
                                <mdct:Column id="cnBuildingName" header="Building Name" propertyKey="buildingName" width="40%">
                                    <Text text="{facilities>name}"/>
                                </mdct:Column>
                                <mdct:Column id="cnBuildingLocation" header="Location" propertyKey="buildingLocation" width="10%">
                                    <Text text="{path: 'facilities>locationId', formatter: '.onGetLocationName'}"/>
                                </mdct:Column>
                                    <mdct:Column id="cnBuildingCountry" header="Country" propertyKey="buildingCountry" width="25%">
                                    <Text text="{path: 'facilities>countryId', formatter: '.onGetCountryName'}"/>
                                </mdct:Column>
                                    <mdct:Column id="cnBuildingRegion" header="Region" propertyKey="buildingRegion" width="15%">
                                    <Text text="{facilities>regionId}"/>
                                </mdct:Column>
                            </mdc:columns>
                            <mdc:type>
                                <mdct:GridTableType rowCountMode="Auto"/>
                            </mdc:type>
                        </mdc:Table>
                    </mdcvc:MDCTable>
                </mdcv:Dialog>
            </mdc:dialog>
        </mdc:ValueHelp>
    </mdc:dependents>
</mdc:Field>        

```

## Exercise 3.2 - Add a Table delegate for your application

The functionality of the `sap.ui.mdc` controls like the `sap.ui.mdc.Table` is steered by so-called delegates. While the framework already contains basis delegates for the `sap.ui.mdc` controls (like the `sap/ui/mdc/ValueHelpDelegate` used in the ValueHelp tag in our example), protocol- and data-specific functionality has to be implemented in your own delegates which inherit from the base delegates. In our case we have to provide our own table delegate to tell the `sap.ui.mdc.Table` which data it should be bound to by implementing the `updateBindingInfo` method. This method provides the `collectionPath`. The structure of the data is defined by implementing the `fetchProperties` method. 
Create a new folder ***delegate*** under the ***webapp*** folder and create a new file ***Table.delegate.js*** in this folder:

***vhfacilities/webapp/delegate/Table.delegate.js***

```js
sap.ui.define([
	"sap/ui/mdc/TableDelegate"
], function (
	TableDelegate
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
			sortable : true,
			groupable: true
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

	};

	return MyTableDelegate;
});
```
## Summary

You've successfully accomplished [Exercise 3 - Create a value help dialog with a table](#exercise-3---create-a-value-help-dialog-with-a-table)!

Continue to [Exercise 4 - Add a FilterField to the ValueHelp Dialog](../ex4/README.md).