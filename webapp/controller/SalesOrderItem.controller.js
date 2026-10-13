sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "fiori/y2026/sapfioritraining2026/model/utils",
    "sap/ui/core/routing/History"
], (Controller, utils, hist) => {
    "use strict";

    return Controller.extend("fiori.y2026.sapfioritraining2026.controller.SalesOrderItem", {
        onInit() {
            utils._initializeGlobal(this);

            this.oRouter.getRoute("RouteSalesOrderItem").attachPatternMatched(this._onRouteMatched, this)
        },

        _onRouteMatched(oEvent){
            const sPath = window.decodeURIComponent( oEvent.getParameter("arguments").SalesOrderPath );

            this.getView().bindElement({
                path: sPath,
                model: "salesOrders"
            })
        },
        onBackButton(oEvent){
            const sPreviousHash = hist.getInstance().getPreviousHash();

            if(sPreviousHash){
                window.history.go(-1);
            }else{
                this.oRouter.navTo("RouteLandingView");
            }
        }
    })
});