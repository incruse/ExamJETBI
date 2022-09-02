import { LightningElement , wire} from 'lwc';
import getAccountOptions from '@salesforce/apex/filteringActionsController.getAccountOptions';
import getMonthOptions from '@salesforce/apex/filteringActionsController.getMonthOptions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ComboboxBasic extends LightningElement {
    selectedAccount = undefined;
    selectedMonth = undefined;
    accounts;
    month;

    @wire(getAccountOptions)
    wiredAccounts({error, data}) {
        if(data) {
			this.accounts = data;
            this.error = undefined;
		} else {
			this.accounts = undefined;
            this.showToast('Error!', error, 'error');
		}
	};

    filterByAccount(event) {
        this.selectedAccount = event.detail.value;
        if (this.selectedAccount == '--None--') {
            this.selectedAccount = undefined;
            this.selectedMonth = undefined;
            this.month = undefined;
        }
        this.dispatchEvent(new CustomEvent('accountselected', {detail: this.selectedAccount}));

            getMonthOptions({ selectedAccount: event.detail.value })
                .then(result => {
                    this.month = result;
                })
                .catch(error => {
                    this.showToast('Error!', error, 'error');
            });
    }

    filterByMonth(event) {
        this.selectedMonth = event.detail.value;
            if (this.selectedMonth == '--None--') {
            this.selectedMonth = undefined;
            }
        this.dispatchEvent(new CustomEvent('monthselected', {detail: this.selectedMonth}));
    }

     showToast(tittle, message, variant) {
         const event = new ShowToastEvent({
             title: tittle,
             message: message,
             variant: variant
         });
         this.dispatchEvent(event);
     }
}
