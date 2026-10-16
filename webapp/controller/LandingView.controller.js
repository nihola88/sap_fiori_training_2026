sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "fiori/y2026/sapfioritraining2026/model/models",
    "fiori/y2026/sapfioritraining2026/model/formatter",
    "fiori/y2026/sapfioritraining2026/model/utils",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,mt, mb, JSONModel, models, formatter, utils, Filter, FilterOp) => {
    "use strict";

    return Controller.extend("fiori.y2026.sapfioritraining2026.controller.LandingView", {
        formatter,
        onInit() {
            this._initializeBindingsDemoModel();
        },
        onBeforeRendering(){
            utils._initializeGlobal(this);
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

            this.getView().byId("dateRangeFilter").addEventDelegate({
                    onkeydown: function(oEvent){
                        if (oEvent.key === 'Enter'){
                            this.onSearchFilterBar();          
                        }
                    }
                }, this);

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
            const sText = utils.getI18nText("SayHelloMessage", [oModelData.inputValue]);
            mt.show(sText);
        },
        onSommaButton() {
            let vNum1 = Number( this.getView().getModel().getProperty("/num1") );
            let vNum2 = Number( this.getView().getModel().getProperty("/num2") );
            if(Number.isNaN(vNum1) || Number.isNaN(vNum2)){
                mb.error(utils.getI18nText("NaNErrorMessage")); return;
            }
            let vSomma = vNum1 + vNum2;
            vSomma = Number.parseFloat(vSomma).toFixed(2);
            vSomma = Number.parseFloat(vSomma).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
            
            mt.show(Controller.oBundle.getText("SommaMessage", [vNum1, vNum2, vSomma]));
            this.getView().getModel().setProperty("/sommaResult", vSomma);
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
        },
        onSearchSO(oEvent){
            const sSearchValue = oEvent.getSource().getValue();
            let aFilters = [];
            let aFilters2 = [] ;
            let oFilters;
            if (sSearchValue){

                //obiettivo: ( (SalesOrder = SearchValue OR Createdby=ROSSI) AND (DelStatus="B") )
                aFilters.push(
//v1 filtro funziona ma non con AND
                    //new Filter("SalesOrder", FilterOp.Contains, sSearchValue),
                    //new Filter("CreatedByUser",FilterOp.Contains,"ROSSI")
//v2 ko
                    //new Filter({path:"SalesOrder", operator: FilterOp.Contains, value1:sSearchValue, and: false}),
                    //new Filter({path:"CreatedByUser",operator:FilterOp.Contains,value1:"ROSSI", and:false})
                               );
//v1
                //aFilters2 = [new Filter(aFilters, false)];
//v2
                //aFilters2 = aFilters;
//v3 okissimo
            aFilters = new Filter([
                    new Filter("SalesOrder", FilterOp.Contains, sSearchValue),
                    new Filter("CreatedByUser", FilterOp.Contains,"ROSSI")
            ], false
                            )
            aFilters2 = new Filter("OverallDeliveryStatus", FilterOp.EQ, "B");
            oFilters = new Filter({filters:[aFilters, aFilters2], and: true});

            }

            const oSalesOrdersList = this.byId("salesOrderList");
            const oListBinding = oSalesOrdersList.getBinding("items");
            oListBinding.filter(oFilters);

        },
        onSearchFilterBar(oEvent){
            //createdBy
            let selItems = this.getView().byId("comboBox1").getSelectedItems();
            let aCreatedBySelected = selItems.map((item)=> { 
                return new Filter("CreatedByUser", FilterOp.Contains, item.getKey())}
            );

            
            let aFilterArray = [];
            if(aCreatedBySelected.length>0){    
                aFilterArray.push( new Filter( aCreatedBySelected, false ) );
            }

            //CreationDate
            let oDateRangeFilter =  this.getView().byId("dateRangeFilter");
            let vDateFrom = oDateRangeFilter.getDateValue();
            let vDateTo   = oDateRangeFilter.getSecondDateValue();
            if(vDateFrom || vDateTo){
                
                vDateTo = vDateTo || new Date(vDateFrom);
                vDateTo.setHours(23,59,59,999);
                //let vDateFromJSON = `/Date(${vDateFrom?.getTime()})/`;
                //let vDateToJSON = `/Date(${vDateTo?.getTime()})/`;

                aFilterArray.push(new Filter("SalesOrderDate", FilterOp.BT, vDateFrom, vDateTo));
            }

            //salesOrg
            const aSalesOrg = this.byId("salesOrgFiltInput").getValue();
            if(aSalesOrg){
                let aSaledOrgFilt = aSalesOrg.split(",").map((sOrg)=> new Filter("SalesOrganization", FilterOp.EQ, sOrg));

                aFilterArray.push( new Filter(aSaledOrgFilt, false ));
            }

            this.getView().byId("respTab").getBinding("items").filter(aFilterArray);
        },
        onSalesOrderDetail(oEvent){
            const sPath = oEvent.getSource().getBindingContext("salesOrders").getPath();
            const sEncodePath = window.encodeURIComponent(sPath);

            this.getOwnerComponent().getRouter().navTo("RouteSalesOrderDetail", {SalesOrderPath: sEncodePath})
        },
        async onSalesOrgFiltVHReq(oEvent){
            if(!this._oDivFiltSelectDialog){
                this._oDivFiltSelectDialog = await this.loadFragment({ name: "fiori.y2026.sapfioritraining2026.view.fragments.SalesOrgFiltSelDialog"});
                this._oDivFiltSelectDialog.addEventDelegate({
                    onkeydown: function(oEvent){
/*                        if (oEvent.key === 'Enter'){
                        }*/
                    }
                }, this, mb);
            }

            this._oDivFiltSelectDialog?.open();
            
        },
        onSelectSalesOrg(oEvent){
            const aMap = oEvent.getParameter("selectedItems").map((item)=> item.getDescription());
            this.byId("salesOrgFiltInput").setValue(aMap);
        },
        onSearchFiltSalesOrg(oEvent){
            const vFilter = oEvent.getParameter("value");
            /*
            if(!this.salesOrgs){
                this.salesOrgs = this.getView().getModel())
            }

           let aFilter = oEvent.getSource().getItems().filter(item=>{
                return item.getProperty("title")?.includes(vFilter) ||
               item.getProperty("description")?.includes(vFilter)
           });
           oEvent.getSource().getBinding("items").setData(aFilter);
           
           oEvent.getSource().getItems().forEach((item)=>{
            item.getProperty("title")?.includes(vFilter) ||
            item.getProperty("description")?.includes(vFilter) ? item.setVisible(true) : item.setVisible(false);
        })
        */
        let aFilter = [ 
            new Filter( "SalesOrganization", FilterOp.Contains, vFilter ),
            new Filter( "SalesOrganizationName", FilterOp.Contains, vFilter )
        ];
            
            oEvent.getSource().getBinding("items").filter(new Filter(aFilter, false));
        }
    })
});