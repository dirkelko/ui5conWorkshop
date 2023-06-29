sap.ui.define([
	'sap/ui/mdc/valuehelp/base/Content',
	'sap/ui/mdc/enum/SelectType',
	'sap/base/util/restricted/_debounce',
	'../Globe'
],
	function(Content, SelectType, debounce, Globe) {
		"use strict";

		// Starting from a valuehelp/base/Content ...
		var GlobeContent = Content.extend("ui5con.vhdemo.controls.valuehelp.GlobeContent", {
			metadata: {
				properties: {
					htmlElements: {
						type: "object[]",
						defaultValue: [],
						bindable: true
					},
				}
			}
		});

		// ... we create our Globe display content with a click listener which creates or removes valuehelp conditions via an event
		GlobeContent.prototype.init = function () {
			Content.prototype.init.apply(this, arguments);
			
			this._oGlobeControl = new Globe({
				htmlElementClick: function (oEvent) {
					var oContext = oEvent.mParameters.htmlElement.context
					var oCondition = this.createCondition(oContext.id, oContext.name);
					var bSelected = this._isContextSelected(oContext);
					this.fireSelect({ type: bSelected ? SelectType.Remove : SelectType.Add, conditions: [oCondition] });
				}.bind(this)
			});
			this.setAggregation("displayContent", this._oGlobeControl);
		}

		// We update the globe's markers whenever htmlElements or ...
		GlobeContent.prototype.setHtmlElements = function(aValues) {
			this.setProperty("htmlElements", aValues, true)
			this._oGlobeControl.setHtmlElements(this._getHTMLElementsWithState());
		};

		// ... conditions are updated
		GlobeContent.prototype.handleConditionsUpdate = function () {
			this._oGlobeControl.setHtmlElements(this._getHTMLElementsWithState());
		};

		// We change marker colors depending on the contexts selection state
		GlobeContent.prototype._getHTMLElementsWithState = function () {
			return this.getHtmlElements().map(function (oElement) {
				return Object.assign({}, oElement, {size: oElement.size || 20, color: (this._isContextSelected(oElement.context) ? "orange" : (oElement.color || "lightblue"))})
			}.bind(this));
		};

		// We determine the selection state for contexts by comparing their id attribute with condition values
		GlobeContent.prototype._isContextSelected = function(oContext) {
			var aSelectedValues = this.getConditions().map(function(oCondition) { return oCondition.values[0]; });
			return aSelectedValues.indexOf(oContext.id) >= 0;
		};

		// We do some cleanup
		GlobeContent.prototype.exit = function () {
			this._oGlobeControl = null;
			Content.prototype.exit.apply(this, arguments);
		};
		
		return GlobeContent;
	});