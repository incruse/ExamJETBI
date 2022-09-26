import { LightningElement , wire } from 'lwc';
import getAccountOptions from '@salesforce/apex/FilteringActionsController.getAccountOptions';
import getMonthOptions from '@salesforce/apex/FilteringActionsController.getMonthOptions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import noneLabel from '@salesforce/label/c.None';
import labelAccount from '@salesforce/label/c.Account';
import labelMonth from '@salesforce/label/c.Month';
import labelError from '@salesforce/label/c.Error';
import placeholderAccountPicklist from '@salesforce/label/c.PlaceholderAccountOption';
import placeholderMonthPicklist from '@salesforce/label/c.PlaceholderMonthOption';


export default class ComboboxBasic extends LightningElement {
    selectedAccount = '';
    selectedMonth = '';
    accounts;
    month;
    isValueSelected = false;
    labels = {
        labelAccount : labelAccount,
        labelMonth : labelMonth,
        accountPicklistPlaceholder : placeholderAccountPicklist,
        monthPicklistPlaceholder : placeholderMonthPicklist
    };
    @wire(getAccountOptions)
    wiredAccounts({error, data}) {
        if (data) {
			this.accounts = data;
		} else if (error?.body?.message) {
			this.accounts = [];
            this.showToast(labelError, error.body.message, 'error');
		}
	};

     filterByAccount(event) {
         this.selectedAccount = event.currentTarget.dataset.label;
         let account = event.currentTarget.dataset.value;
             if (this.selectedAccount == noneLabel) {
                 this.selectedAccount = '';
                 this.selectedMonth = '';
                 this.month = [];
                 account = '';
             }
             this.eventDispatcher('accountselected', account);
             if (this.selectedAccount) {
                 getMonthOptions({ selectedAccount: account})
                     .then(result => {
                         this.month = result;
                     })
                     .catch(error => {
                         this.showToast(labelError + '! ', error.body.message, 'error');
                     });
             this.eventDispatcher('monthselected', this.selectedMonth);
             }
     }

    filterByMonth(event) {
        this.selectedMonth = event.detail.value;
            if (this.selectedMonth == noneLabel) {
            this.selectedMonth = '';
            }
        this.eventDispatcher('monthselected', this.selectedMonth);
    }

     showToast(tittle, message, variant) {
         const event = new ShowToastEvent({
             title: tittle,
             message: message,
             variant: variant
         });
         this.dispatchEvent(event);
     }

     eventDispatcher(nameEvent, eventDetail) {
         this.dispatchEvent(new CustomEvent(nameEvent, {detail: eventDetail}));
     }

     optionVisibilitySwitch() {
         if (!this.isValueSelected) {
            this.template.querySelector('.dropdown').classList.remove('slds-hidden');
            this.isValueSelected = true;
         } else {
            this.template.querySelector('.dropdown').classList.add('slds-hidden');
            this.isValueSelected = false;
         }
     }
}