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
            },
            formatNumber(vStringNumb){
                if(!vStringNumb) return;

                if(vStringNumb > 100) {
                    return library.ValueState.Success;
                }
                else {
                    return library.ValueState.Error;
                }
            },
            formatCurrency(vAmount, vCurr){
                if(!vAmount) return;

                if(vAmount > 1000) {
                    return library.ValueState.Success;
                }
                else {
                    return library.ValueState.Error;
                }  
            },
            manageSalesOrg(sOrg, sOrgText){
                if(sOrgText) return sOrgText;
                const sOrgModel = this.getView().getModel("salesOrgs");
                const oSalesOrg = sOrgModel.getProperty(
                    `/A_SalesOrganization('${sOrg}')`
                );

                const aTexts = oSalesOrg?.to_Text?.__list;
                if (!aTexts?.length) {
                    return sOrg;
                }

                let sKey = 
                    aTexts.find(oText => sOrgModel.getProperty("/"+oText).Language === "IT") ||
                    aTexts.find(oText => sOrgModel.getProperty("/"+oText).Language === "EN") ||
                    aTexts[0];

                return sOrgModel.getProperty("/"+ sKey)?.SalesOrganizationName || sOrg;

          }
        }
    }

)