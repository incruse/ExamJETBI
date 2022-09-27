import { LightningElement , track, wire, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOrders from '@salesforce/apex/OrdersResultController.getOrders';
import title from '@salesforce/label/c.Orders';
import labelError from '@salesforce/label/c.Error';
import labelLoading from '@salesforce/label/c.Loading';

export default class OrdersFilteringComponent extends LightningElement {
    labelLoading = this.labelLoading;
    selectedAccount = '';
    selectedMonth = '';
    searchOrderBy = '';
    searchByFieldValue = '';
    @track records = [];
    recordsData = [];
    isLoaded = false;
    title = title;

    @wire(getOrders, {selectedAccount: '$selectedAccount',
                      selectedMonth: '$selectedMonth'}) waredOrders(result, error) {
        if (result && result?.data) {
            this.records = JSON.parse(JSON.stringify(result.data));
            this.records.forEach(item => item['Order Name'] = '/' + item['Id']);
            this.records.forEach(item => item['Account Name'] = item['Account__r'].Name);
            this.records.forEach(item => item['AccountURL'] = '/' + item['Account__c']);
            this.recordsData = this.records;
            this.isLoaded = false;
        } else if (error) {
            this.showToast(labelError + '! ', error, 'error');
            this.records = [];
            this.recordsData = this.records;
        }
    }

    getAccountFilter(event) {
        if (event.detail == '') {
            this.isLoaded = true;
            this.selectedAccount = null;
        }
        this.selectedAccount = event.detail;
    }

    getMonthFilter(event) {
        if (event.detail == '') {
            this.isLoaded = true;
            this.selectedMonth = null;
        }
        this.selectedMonth = event.detail;
    }

    getFieldNameFilter(event) {
        let field = event.detail.searchFrom;
        this.recordsData = this.records;
        let searchName = event.detail.value;
        let result = [];
        if (searchName) {
            for (let order of JSON.parse(JSON.stringify(this.records))) {
                let searchFrom = Object.keys(order).filter( el => el == field);
                if (order[field].toUpperCase().includes(searchName.toUpperCase())) {
                    result.push(order);
                }
            }
            this.recordsData = result;
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}