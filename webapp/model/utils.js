sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], 
function (JSONModel, Filter, FilterOp) {
    "use strict";
    return{
        _initializeGlobal(that){
            that.oComponent = this.oComponent = that.getView().getController().getOwnerComponent();
            that.getView().setModel(new JSONModel({}), "filterbarModel");
            this.setLanguage();
            void this.loadGlobalData();
            
            /*
            let aCreatedBy = [];
            that.oComponent.getModel("salesOrders").read("/A_SalesOrder",{
                success:(oData)=>{
                    oData.results.forEach( (so) => {
                        let vCreatedBy = so.CreatedByUser;
                        let vFind = aCreatedBy.find( (names)=>names.name === vCreatedBy )
                        if(!vFind) aCreatedBy.push({name: vCreatedBy}) ;
                        aCreatedBy.sort((a,b)=>{   
                            if(a.name > b.name){
                                return 1;
                            }else if(a.name < b.name){
                                return - 1;
                            }else{
                                return 0;
                            }
                            });
                    let filterbarModel = {
                        createdBy: aCreatedBy
                    };
                    that.getView().setModel(new JSONModel(filterbarModel), "filterbarModel");
                });

                }
            });
            */

            that.oRouter = that.getOwnerComponent().getRouter();

        },
        getI18nText(sKey, aAttributes){
            return this.oComponent.getModel("i18n").getResourceBundle().getText(sKey, aAttributes);
        },
        setLanguage()      {
            const vLang = sap.ui.getCore().getConfiguration().getLanguage();
            const oLangu = {
                langu: vLang,
                SAPLanguage: vLang.substring(0,2).toUpperCase()
            }
            this.oComponent.setModel(new JSONModel(oLangu), "languageModel");
        },
        async loadGlobalData(){
            //sales orgs
            const aFilter = [new Filter("Language", FilterOp.EQ, this.oComponent.getModel("languageModel").getProperty("/SAPLanguage"))];
            const that = this;
            this.oComponent.getModel("salesOrgs").read("/A_SalesOrganizationText",{
                filters: aFilter,
                success: (oData)=>{
                    that.oComponent.setModel(new JSONModel(oData.results), "LocSalesOrg");
                },
                error:(error)=>{
                    debugger;
                }
            })
        }
    }   

}
)