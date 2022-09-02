import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
export default class NavigationServiceExample extends NavigationMixin(
  LightningElement
) {
   openAccountRecordHandler() {
       this[NavigationMixin.Navigate]({
         type: "standard__recordPage",
         attributes: {
           objectApiName: "Account",
           actionName: "view",
           recordId: "$recordId"
         }
       });
     }
}