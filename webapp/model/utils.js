sap.ui.define([
    "sap/ui/model/json/JSONModel"
], 
function (JSONModel) {
    "use strict";
    return{
        _initializeGlobal(that){
            that.oComponent = this.oComponent = that.getView().getController().getOwnerComponent();
            let aSOrders = that.oComponent.getModel("salesOrders").getProperty("/A_SalesOrder");
            let aCreatedBy = [];
            aSOrders.forEach( (so) => {
                let vCreatedBy = so.CreatedByUser;
                let vFind = aCreatedBy.find( (names)=>names.name === vCreatedBy )
                if(!vFind) aCreatedBy.push({name: vCreatedBy}) ;
            });
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
            that.oRouter = that.getOwnerComponent().getRouter();

        },
        getI18nText(sKey, aAttributes){
            return this.oComponent.getModel("i18n").getResourceBundle().getText(sKey, aAttributes);
        }      
    }   

}
)