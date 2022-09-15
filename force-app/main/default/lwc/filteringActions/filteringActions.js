import {LightningElement , wire} from 'lwc';
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
    labels = {
        labelAccount : labelAccount,
        labelMonth : labelMonth,
        accountPicklistPlaceholder : placeholderAccountPicklist,
        monthPicklistPlaceholder : placeholderMonthPicklist
    };
    @wire(getAccountOptions)
    wiredAccounts({error, data}){
        if(data) {
			this.accounts = data;
		} else if(error?.body?.message){
			this.accounts = [];
            this.showToast(labelError, error.body.message, 'error');
		}
	};

    filterByAccount(event){
        this.selectedAccount = event.detail.value;
        if (this.selectedAccount == noneLabel){
            this.selectedAccount = '';
            this.selectedMonth = '';
            this.month = '';
        }
        this.eventDispatcher('accountselected', this.selectedAccount);

        if (this.selectedAccount){
            getMonthOptions({ selectedAccount: event.detail.value })
                .then(result => {
                    this.month = result;
                })
                .catch(error => {
                    this.showToast(labelError + '! ', error, 'error');
                });
        }
        this.eventDispatcher('monthselected', this.selectedMonth);
    }

    filterByMonth(event){
        this.selectedMonth = event.detail.value;
            if (this.selectedMonth == '--None--'){
            this.selectedMonth = '';
            }
        this.eventDispatcher('monthselected', this.selectedMonth);
    }

     showToast(tittle, message, variant){
         const event = new ShowToastEvent({
             title: tittle,
             message: message,
             variant: variant
         });
         this.dispatchEvent(event);
     }

     eventDispatcher(nameEvent, eventDetail){
         this.dispatchEvent(new CustomEvent(nameEvent, {detail: eventDetail}));
     }
}