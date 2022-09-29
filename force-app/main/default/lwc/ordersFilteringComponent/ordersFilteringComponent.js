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
            this.records.forEach(item => {
                item['Order Name'] = '/' + item['Id'];
                item['Account Name'] = item['Account__r'].Name;
                item['AccountURL'] = '/' + item['Account__c'];
            });
            this.recordsData = this.records;
            this.isLoaded = false;
        } else if (error) {
            this.showToast(labelError, error, 'error');
            this.records = [];
            this.recordsData = [];
        }
    }

    getAccountFilter(event) {
        if (!event.detail) {
            this.isLoaded = true;
            this.selectedAccount = null;
        }
        this.selectedAccount = event.detail;
    }

    getMonthFilter(event) {
        if (!event.detail) {
            this.isLoaded = true;
            this.selectedMonth = null;
        }
        this.selectedMonth = event.detail;
    }

    orderFiltering(event) {
        let field = event.detail.searchFrom;
        this.recordsData = this.records;
        let result = [];
        this.isLoaded = true;
        if (event.detail.dateFrom || event.detail.dateTo) {
            this.recordsData = this.dateFiltering(event);
        }
        if (event.detail.value) {
            for (let order of JSON.parse(JSON.stringify(this.records))) {
                if (order[field].toString().toUpperCase().includes(event.detail.value.toUpperCase())) {
                    result.push(order);
                }
            }
            this.recordsData = result;
        }
        this.isLoaded = false;
    }

    dateFiltering(event) {
        let result = [];
        let dateFrom = event.detail.dateFrom;
        let dateTo = event.detail.dateTo;
        JSON.parse(JSON.stringify(this.records)).forEach( (item, index) => {
            let orderDate = item.Payment_Due_Date__c;
            if (dateFrom && !dateTo) {
                orderDate >= dateFrom ? result.push(item) : null;
            }
            if (dateTo && !dateFrom) {
                orderDate <= dateTo ? result.push(item) : null;
            }
            if (dateFrom && dateTo) {
                orderDate >= dateFrom && orderDate <= dateTo ? result.push(item) : null;
            }
        })
        return result;
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