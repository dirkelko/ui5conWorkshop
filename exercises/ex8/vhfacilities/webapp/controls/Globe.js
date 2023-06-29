sap.ui.define([
	'sap/ui/core/Control',
	'globe.gl'
],
	function(Control, GlobeGL) {
		"use strict";

		// We start from a basic control rendering a div claiming 100% width and height
		var Globe = Control.extend("ui5con.vhdemo.controls.Globe", {
			metadata: {
				properties: {
					htmlElements: {
						type: "object[]",
						defaultValue: [],
					}
				},
				events: {
					htmlElementClick: {}
				}
			},
			renderer: {
				apiVersion: 2,
				render: function(oRm, oControl) {
					oRm.openStart("div", oControl);
					oRm.class("Globe");
					oRm.style("width","100%");
					oRm.style("height","100%");
					oRm.openEnd();
					oRm.close("div");
				}
			}
		});

		// Whenever this control is rendered, we use globe.gl to also render a 3d globe to our div
		// We also observe size changes of our div to keep the globe's size in sync
		Globe.prototype.onAfterRendering = function () {
			var oDomRef = this.getDomRef();
			var oBoundaries = oDomRef.getBoundingClientRect();
			var aHtmlElements = this.getHtmlElements();
			
			this._o3DGlobe = GlobeGL()
				.width(oBoundaries.width)
				.height(oBoundaries.height)
				.globeImageUrl('/assets/earth-day.jpg')
				.htmlElementsData(aHtmlElements)
				.htmlElement(d => {
				const el = document.createElement('div');
				el.innerHTML = `<svg class="Globe--marker" viewBox="-4 0 36 36">
					<path class="Globe--marker--outer" fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
					<circle class="Globe--marker--inner" fill="black" cx="14" cy="14" r="7"></circle>
					<title>${d.context.name}: ${d.context.street}, ${d.context.zip} ${d.context.city} ${d.context.countryId}</title>
				</svg>`;
				el.style.color = d.color;
				el.style.width = `${d.size}px`;

				el.style['pointer-events'] = 'auto';
				el.style.cursor = 'pointer';
				el.onclick = function (oEvent) {
					this.fireEvent("htmlElementClick", {htmlElement: d, globeEvent: oEvent});
					this._focusHtmlElement(d);
				}.bind(this);
				return el;
				})
				(oDomRef);

			var oFirstSelectedEl = aHtmlElements.find(d => d.color === 'orange');
			this._focusHtmlElement(oFirstSelectedEl);

			this._oResizeObserver = this._oResizeObserver || new ResizeObserver(function (aEntries) {
				this._o3DGlobe.width(aEntries[0].contentRect.width)
				this._o3DGlobe.height(aEntries[0].contentRect.height)
			}.bind(this));
			this._oResizeObserver.observe(oDomRef);
		};

		// We want to focus some elements via globe.gl's pointOfView method
		Globe.prototype._focusHtmlElement = function (oElement) {
			this._o3DGlobe.pointOfView({lat: oElement && oElement.lat || 0 , lng: oElement && oElement.lng || 0, altitude: 2}, 750);
		};	

		// We push htmlElement changes also to our _o3DGlobe control to keep it in sync
		Globe.prototype.setHtmlElements = function (aValues) {
			this.setProperty("htmlElements", aValues, true);
			
			if (this._o3DGlobe) {
				this._o3DGlobe.htmlElementsData(aValues);
			}
		};	

		// We do some cleanup
		Globe.prototype.exit = function() {
			if (this._oResizeObserver) {
				this._oResizeObserver.disconnect()
				this._oResizeObserver = null;
			}
			Control.prototype.exit.apply(this, arguments);	
			this._o3DGlobe = null;
		};
	
		return Globe;
	});