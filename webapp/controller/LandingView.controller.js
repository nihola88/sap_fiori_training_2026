sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller,mt, mb) => {
    "use strict";

    return Controller.extend("fiori.y2026.sapfioritraining2026.controller.LandingView", {
        onInit() {
            this._initializeBindingsDemoModel();
        },
        _initializeBindingsDemoModel(){
            let vModel = [
                { var1: "value1", var2: "value2" },
                { var1: "value3", var2: "value4" },
                { var1: "value5", var2: "value6" }
            ];
            let oModel = new sap.ui.model.json.JSONModel(vModel);
            this.getView().setModel(oModel, "myModel");
            vModel = { num1: 0, num2:0, sommaResult: Number(0).toLocaleString("it-IT", { style: "currency", currency: "EUR" })};
            oModel = new sap.ui.model.json.JSONModel(vModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oModel);
            vModel = { inputValue: "test"};
            oModel = new sap.ui.model.json.JSONModel(vModel);
            this.getView().setModel(oModel, "bindingsDemo");
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

        },
        onSayHello(){
            const oModelData = this.getView().getModel("bindingsDemo").getData();
            //mt.show(`Ciao ${oModelData.inputValue}`);
            const sText = this.getI18nText("SayHelloMessage", [oModelData.inputValue]);
            mt.show(sText);
        },
        onSommaButton() {
            let vNum1 = Number( this.getView().getModel().getProperty("/num1") );
            let vNum2 = Number( this.getView().getModel().getProperty("/num2") );
            if(Number.isNaN(vNum1) || Number.isNaN(vNum2)){
                mb.error(this.getI18nText("NaNErrorMessage")); return;
            }
            let vSomma = vNum1 + vNum2;
            vSomma = Number.parseFloat(vSomma).toFixed(2);
            vSomma = Number.parseFloat(vSomma).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
            
            mt.show(Controller.oBundle.getText("SommaMessage", [vNum1, vNum2, vSomma]));
            this.getView().getModel().setProperty("/sommaResult", vSomma);
        },
        getI18nText(sKey, aAttributes){
            return this.getView().getModel("i18n").getResourceBundle().getText(sKey, aAttributes);
        }
    })
});