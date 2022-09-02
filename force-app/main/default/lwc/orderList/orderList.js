import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import retrieveOrderData from '@salesforce/apex/orderListRetrieve.retrieveOrderData';
import openAccountRecordHandler from './navigateToRecord';

 
export default class DisplayContactsOnAccountName extends LightningElement {
 
   @track currentAccountName;
   @track searchAccountName;
    handleChangeAccName(event){
      this.currentAccountName = event.target.value;      
    }
 
    handleAccountSearch(){
       this.searchAccountName = this.currentAccountName;
    }
//
    navigateToRecordPage() {
        const data = navigateToRecordPage();
        }
   
    @track records;
    @track dataNotFound;
    @wire (retrieveOrderData)
    wireRecord({data,error}){
        if(data){           
            this.records = data;
            this.error = undefined;
            this.dataNotFound = '';
            if(this.records == ''){
                this.dataNotFound = 'There is no Contact found related to Account name';
            }
 
           }else{
               this.error = error;
               this.data=undefined;
           }
    }
}
