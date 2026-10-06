sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "fiori/y2026/sapfioritraining2026/model/models"
], (Controller,mt, mb, JSONModel, models) => {
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
            let oModel = new JSONModel(vModel);
            this.getView().setModel(oModel, "myModel");
            vModel = { num1: 0, num2:0, sommaResult: Number(0).toLocaleString("it-IT")};
            oModel = new JSONModel(vModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.getView().setModel(oModel);
            vModel = { inputValue: "test"};
            oModel = new JSONModel(vModel);
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
        },

        // --- Dialog
        _initializeDialogModel(){
            this.getView().setModel(new JSONModel(models.defaultPanelModel()), "dialogModel");
        },

        _restoreDialogModel(){
            this.getView().getModel("dialogModel").setData(models.defaultPanelModel());
        },

        async onOpenDialog(){
            if(!this._oDialog){
                this._oDialog = await this.loadFragment({ name: "fiori.y2026.sapfioritraining2026.view.fragments.Dialog"});
                this._initializeDialogModel();
            }
            else{
                this._restoreDialogModel();
            }
            this._oDialog.open();
        },
        onCloseDialog(){
            this._oDialog?.close();
        },

        onConfirmBtn(){
            const nNumber = this.getView().getModel("dialogModel").getProperty("/inputNumber");
            mt.show(nNumber);
            this._oDialog?.close();
        },

        // --- DialogUsr
        _initializeDialogUsrModel(){
            this.getView().setModel(new JSONModel(models.defaultUsrModel()), "usrDialog");
        },

        _restoreDialogUsrModel(){
            this.getView().getModel("usrDialog").setData(models.defaultUsrModel());
        },

        async onOpenDialogUsr(){
            if(!this._oDialogUsr){
                this._oDialogUsr = await this.loadFragment({ name: "fiori.y2026.sapfioritraining2026.view.fragments.dialogUsr"});
                this._oDialogUsr.addEventDelegate({
                    onkeydown: function(oEvent){
                        if (oEvent.key === 'Enter'){
                            this.getView().byId("DialogUsrBtnConf").getEnabled() ? this.onConfirmUsrBtn() : mb.error("Popolare tutti i campi!!!");
                        }
                    }
                }, this, mb);
                this._initializeDialogUsrModel();
            }
            else{
                this._restoreDialogUsrModel();
            }
            this._oDialogUsr?.open();
        },

        onConfirmUsrBtn(){
            let oUsrModel = this.setConfirmed();
            let oData = oUsrModel.getData();
            let vMess = "";
            Object.entries(oData).forEach(([key, field]) => {
                const vStr = key.charAt(0).toUpperCase() + key.slice(1) + ": " + field.value;
                vMess = vMess ? vMess + '\n' + vStr : vStr;
            });
            mt.show(vMess);
            mb.show(vMess, {title: "Informazioni Utente", icon:"Information"});
            this._oDialogUsr?.close();
        },
        onCloseDialogUsr(){
            this._oDialogUsr?.close();
        },

        setConfirmed(oSource){
            let oUsrModel = this.getView().getModel("usrDialog");
            let vConfPath = oSource?.getBinding("value").getPath().replace("value", "confirmed");
            oUsrModel.setProperty(vConfPath, true);
            return oUsrModel;
        },
        onInputChange(oEvent){
            const oSource = oEvent.getSource();
            this.setConfirmed(oSource);
/*            if (oSource.getValue() === ""){
                oSource.setValueState(sap.ui.core.ValueState.Error);
                oSource.setValueStateText(Controller.oBundle.getText("error.insertValue"));
            }
            else{
                oSource.setValueState(sap.ui.core.ValueState.None);
                oSource.setValueStateText("");
            }*/
        }
    })
});