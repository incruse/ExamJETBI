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
    isValueSelected = false;
    isTypingInSearch = false;
    labels = {
        filterBy : labelFilterBy,
        orderName : labelOrderName,
        accountName : labelAccountName,
        name : labelName,
        account : labelAccount,
        month : labelMonth,
        accountPicklistPlaceholder : placeholderAccountPicklist,
        monthPicklistPlaceholder : placeholderMonthPicklist
    };
    ordersFilterByOptions = [
            { label: this.labels.orderName , value: 'Name' },
            { label: this.labels.accountName, value: 'Account Name' }
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
            this.month = [];
            account = '';
            this.accountsOptions = this.accounts;
            this.isTypingInSearch = false;
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
        this.selectedOrdersFilteringBy == '' ? this.disabledInput = true : this.disabledInput = false;
        this.eventDispatcher('searchorder', {
            searchFrom: this.selectedOrdersFilteringBy,
            value: this.searchingName
        } );
    }

    searchOrder(event) {
        this.searchingName = event.target.value;
        this.searchingName == '' ? this.isTypingInSearch = false : this.isTypingInSearch = true;
        this.eventDispatcher('searchorder', {
            searchFrom: this.selectedOrdersFilteringBy,
            value: this.searchingName
        } );
    }

    getAccountOptions(event) {
        let accountName = event.target.value;
        this.accountsOptions = this.accounts;
        this.selectedAccount = accountName;
        let accounts = JSON.parse(JSON.stringify(this.accountsOptions));
        let result = [];
        if (accountName) {
            for (let acc of accounts) {
                let searchFrom = Object.keys(acc).filter( el => el == 'label');
                if (acc.label.toUpperCase().includes(accountName.toUpperCase())) {
                    result.push(acc);
                }
            }
            result.unshift(accounts[0]);
            this.accountsOptions = result;
        }
    }

    resetSearch(event) {
        this.searchingName = '';
        this.searchOrder(event);
    }
}