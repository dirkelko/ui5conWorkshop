# Exercise 2 - Adding type-ahead functionality

In this exercise you'll enhance the application with a type-ahead functionality including a suggestion list by simply adding this to the view.


## Exercise 2.1 - Add a value help tag to the view

1. Open the ***Building.view.xml*** in the ***view*** folder of the project. We have to build the value help out of several UI5 controls from the new `sap.ui.mdc` library. 
Add the namespaces needed for the value help and filter bar of the `sap.ui.mdc` library to the view. We use several namespaces for the library to keep the tags in the view short and clean. (The `sap.ui.mdc.table` and `sap.ui.mdc.filterbar.vh` will be used in a later chapter, but we can include it also now).

***vhfacilities/webapp/view/Building.view.xml***
```xml
<mvc:View
	controllerName="ui5con.vhdemo.controller.Building"
    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"
    xmlns="sap.m"
	xmlns:mdc="sap.ui.mdc"
	xmlns:mdct="sap.ui.mdc.table"
    xmlns:mdcv="sap.ui.mdc.valuehelp"
    xmlns:mdcvc="sap.ui.mdc.valuehelp.content"
    xmlns:vhfb="sap.ui.mdc.filterbar.vh">
```

2. Now add a `ValueHelp` tag from the `sap.ui.mdc` library with a typeahead declaration to the `mdc.Field` and add the id of the value help to the `valueHelp="vhSelectBuilding"` property of the `mdc.Field`. 
We also specify the path to a so-called **delegate** which provides central functionality for the value help. In this still simple scenario the base delegate provided by the `sap.ui.mdc` library is sufficient. Later we have to implement our own delegates for more complex scenarios. 
The typeahead consists of a pop over control with the suggestion list of possible entries as a responsive table from the `sap.m` library. The `sap.ui.mdc` library contains value help specific wrapper controls. For example the `sap.ui.mdc.valuehelp.content.Table` control's property `filterFields` allows to specify which properties of the entity set will be used by the type-ahead search functionality. The columns and list items of the `sap.m.Table` are declared as usual.

***vhfacilities/webapp/view/Building.view.xml***
```xml
...
<mdc:Field 
    id="fieldSelectBuilding" 
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
                <mdcv:Popover title="Select Building">
                    <mdcvc:MTable 
                        keyPath="id" 
                        descriptionPath="name" 
                        filterFields="*name,city*">
                        <Table  id="listBuildings"
                                items='{path : "facilities>/buildings" }' 
                                width="30rem" 
                                mode="SingleSelectMaster">
                            <columns>
                                <Column visible="false">
                                    <header>
                                        <Text text="ID" />
                                    </header>
                                </Column>
                                <Column>
                                    <header>
                                        <Text text="Name" />
                                    </header>
                                </Column>
                                <Column>
                                    <header>
                                        <Text text="Location ID" />
                                    </header>
                                </Column>
                            </columns>
                            <items>
                                <ColumnListItem type="Active">
                                    <cells>
                                        <Text text="{facilities>id}"/>
                                        <Text text="{facilities>name}"/>
                                        <Text text="{facilities>locationId}"/>
                                    </cells>
                                </ColumnListItem>
                            </items>
                        </Table>
                    </mdcvc:MTable>
                </mdcv:Popover>
            </mdc:typeahead>
        </mdc:ValueHelp>
    </mdc:dependents>
</mdc:Field>        
...
```
Check the result in the browser.

## Summary

You've successfully accomplished [Exercise 2 - Adding type-ahead functionality](#exercise-2---adding-type-ahead-functionality)!

Continue to [Exercise 3 - Adding a value help dialog](../ex3/README.md).