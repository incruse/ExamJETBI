import { LightningElement , track, wire, api} from 'lwc';
import getOrders from '@salesforce/apex/ordersResultController.getOrders';

export default class OrdersFilteringComponent extends LightningElement {
    selectedAccount = '';
    selectedMonth = '';
    @track records;

    @wire(getOrders, {selectedAccount: '$selectedAccount', selectedMonth: '$selectedMonth'}) waredOrders (result, error) {
        if (result && result?.data) {
            this.records = JSON.parse(JSON.stringify(result.data));
            this.records.forEach(item => item['Order Name'] = '/lightning/r/Order__c/' +item['Id'] +'/view');
            this.error = undefined;
        } else if (error) {
            this.error = result.error;
            this.records = undefined;
        }
    }

    getAccountFilter(event) {
        this.selectedAccount = event.detail;
    }

    getMonthFilter(event) {
        this.selectedMonth = event.detail;
    }
}