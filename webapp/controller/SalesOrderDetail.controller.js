sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "fiori/y2026/sapfioritraining2026/model/utils",
    "sap/ui/core/routing/History"
], (Controller, utils, hist) => {
    "use strict";

    return Controller.extend("fiori.y2026.sapfioritraining2026.controller.SalesOrderDetail", {
        onInit() {
            utils._initializeGlobal(this);

            this.oRouter.getRoute("RouteSalesOrderDetail").attachPatternMatched(this._onRouteMatched, this)
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
        },
        onDebug(){
            debugger;
        },
        onItemSelect(oEvent){
            const sPath = oEvent.getSource().getBindingContextPath("salesOrders");
            const sEncodePath = window.encodeURIComponent(sPath);

            this.oRouter.navTo("RouteSalesOrderItem", {SalesOrderPath: sEncodePath })
        }
    })
});