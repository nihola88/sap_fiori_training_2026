sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller,mt, mb) => {
    "use strict";

    return Controller.extend("fiori.y2026.sapfioritraining2026.controller.LandingView", {
        onInit() {
            
        },
        onAfterRendering (){
            Controller.oBundle = this.getView().getModel("i18n").getResourceBundle();
            this.getView().byId("stepInputDescr").setText(Controller.oBundle.getText("StepInputDescription", ["0"]));
        },
        onToastButtonPress() {
            mt.show(Controller.oBundle.getText("ToastMessage"));
        },
        onMessageBoxButtonPress() {
            mb.show(
                Controller.oBundle.getText("MessageBoxText"),
                { icon: sap.m.MessageBox.Icon.INFORMATION,
                  title: Controller.oBundle.getText("MessageBoxTitle") 
                }
            );
        },
        onStepInputChange(oEvent) {
            let vText = Controller.oBundle.getText("StepInputDescription", [oEvent.getParameter("value")]);
            this.getView().byId("stepInputDescr").setText(vText);

        }
    })
});