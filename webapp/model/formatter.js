sap.ui.define([
                "sap/ui/core/library",
                "fiori/y2026/sapfioritraining2026/model/utils"
            ],
    function(library,utils){
        "use strict";
        return {
            overallDeliveryStatusState: function (sStatus){
                switch (sStatus){
                    case "A":
                        return library.ValueState.Error;
                    case "B":
                        return library.ValueState.Warning;
                    case "C":
                        return library.ValueState.Success;
                    case "D":
                        return library.ValueState.None;
                }
            },
            overallDeliveryStatusText: function(sStatus){
                switch (sStatus){
                    case "A":
                        return utils.getI18nText("deliveryStatusA");
                    case "B":
                        return utils.getI18nText("deliveryStatusB");
                    case "C":
                        return utils.getI18nText("deliveryStatusC");
                    case "D":
                        return utils.getI18nText("deliveryStatusSpace");
                }
            },
            formatDate(vStringDate){
                if(!vStringDate){
                    return "";
                }

                const oDate = new Date(
                    Number.parseInt(vStringDate.match(/\d+/)[0], 10)
                );

                return sap.ui.core.format.DateFormat
                    .getDateInstance({ pattern: "dd/MM/yyyy" })
                    .format(oDate);
            }
        }
    }

)