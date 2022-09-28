import { LightningElement , wire } from 'lwc';
import getAccountOptions from '@salesforce/apex/FilteringActionsController.getAccountOptions';
import getMonthOptions from '@salesforce/apex/FilteringActionsController.getMonthOptions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import noneLabel from '@salesforce/label/c.None';
import labelName from '@salesforce/label/c.Name';
import labelAccount from '@salesforce/label/c.Account';
import labelFilterBy from '@salesforce/label/c.Filter_by';
import labelMonth from '@salesforce/label/c.Month';
import labelOrderName from '@salesforce/label/c.OrderName';
import labelAccountName from '@salesforce/label/c.AccountName';
import labelTotalAmount from '@salesforce/label/c.totalAmount';
import labelTo from '@salesforce/label/c.From';
import labelFrom from '@salesforce/label/c.To';
import labelPaymentDueDate from '@salesforce/label/c.paymentDueDate';
import labelError from '@salesforce/label/c.Error';
import placeholderAccountPicklist from '@salesforce/label/c.PlaceholderAccountOption';
import placeholderMonthPicklist from '@salesforce/label/c.PlaceholderMonthOption';

export default class ComboboxBasic extends LightningElement {
    selectedAccount = '';
    selectedMonth = '';
    selectedOrdersFilteringBy = '';
    searchingName = '';
    accounts = [];
    accountsOptions = [];
    month;
    dateFrom = '';
    dateTo = '';
    inputType = 'search';
    isDateInput = false;
    isValueSelected = false;
    labels = {
        filterBy : labelFilterBy,
        orderName : labelOrderName,
        accountName : labelAccountName,
        paymentDueDate : labelPaymentDueDate,
        totalAmount : labelTotalAmount,
        name : labelName,
        to : labelTo,
        from : labelFrom,
        account : labelAccount,
        month : labelMonth,
        accountPicklistPlaceholder : placeholderAccountPicklist,
        monthPicklistPlaceholder : placeholderMonthPicklist
    };
    ordersFilterByOptions = [
            { label: this.labels.orderName , value: 'Name' },
            { label: this.labels.accountName, value: 'Account Name' },
            { label: this.labels.paymentDueDate, value: 'Payment_Due_Date__c' },
            { label: this.labels.totalAmount, value: 'Total_Amount__c' }
    ];
    @wire(getAccountOptions)
    wiredAccounts({error, data}) {
        if (data) {
            this.accounts = data;
        } else if (error?.body?.message) {
            this.accounts = [];
            this.showToast(labelError, error.body.message, 'error');
        }
        this.accountsOptions = this.accounts;
        this.selectedOrdersFilteringBy = this.ordersFilterByOptions[0].value;
    };

    filterByAccount(event) {
        this.selectedAccount = event.currentTarget.dataset.label;
        let account = event.currentTarget.dataset.value;
        if (this.selectedAccount == noneLabel) {
            this.selectedAccount = '';
            this.selectedMonth = '';
            this.dateFrom = '';
            this.dateTo = '';
            this.month = [];
            account = '';
            this.accountsOptions = this.accounts;
        }
        this.searchingName = '';
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

    tableFiltering(event) {
        this.selectedOrdersFilteringBy = event.detail.value;
        this.searchingName = '';
        this.dateFrom = '';
        this.dateTo = '';
        this.switchInputType(this.selectedOrdersFilteringBy);
        this.eventDispatcher('searchorder', {
            searchFrom: this.selectedOrdersFilteringBy,
            value: this.searchingName
        } );
    }

    searchOrder(event) {
        this.searchingName = event.target.value;
        this.eventDispatcher('searchorder', {
            searchFrom: this.selectedOrdersFilteringBy,
            value: this.searchingName
        } );
    }

    datePicker(event) {
        event.target.name == 'Date From' ? this.dateFrom = event.target.value : this.dateTo = event.target.value;
        this.eventDispatcher('searchorder', {
            searchFrom: this.selectedOrdersFilteringBy,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo
        } );
    }

    getAccountOptions(event) {
        this.accountsOptions = this.accounts;
        this.selectedAccount = event.target.value;
        let accounts = JSON.parse(JSON.stringify(this.accountsOptions));
        let result = [];
        if (this.selectedAccount) {
            for (let acc of accounts) {
                let searchFrom = Object.keys(acc).filter( el => el == 'label');
                if (acc.label.toUpperCase().includes(this.selectedAccount.toUpperCase())) {
                    result.push(acc);
                }
            }
            result.unshift(accounts[0]);
            this.accountsOptions = result;
        }
    }

    switchInputType(selectedOption) {
        switch (selectedOption) {
            case 'Payment_Due_Date__c' :
                this.isDateInput = true;
                break;
            case 'Total_Amount__c' :
                this.inputType = 'number';
                this.isDateInput = false;
                break;
            default :
                this.inputType = 'search';
                this.isDateInput = false;
        }
    }
}