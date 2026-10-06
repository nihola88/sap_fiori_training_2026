sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            let oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        defaultPanelModel(){
            return {
                inputNumber: 0
            };;
        },

        defaultUsrModel(){
            return {
                name: { value: "", confirmed: false },
                surname: { value: "", confirmed: false },
                email: { value: "", confirmed: false },
                phone: { value: "", confirmed: false }
            };
        
        }
    };

});