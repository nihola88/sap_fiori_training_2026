sap.ui.define([
], 
function () {
    "use strict";
    return{
        _initializeGlobal(oView){
            this.oComponent = oView.getController().getOwnerComponent();
        },
        getI18nText(sKey, aAttributes){
            return this.oComponent.getModel("i18n").getResourceBundle().getText(sKey, aAttributes);
        }
    }   

}
)