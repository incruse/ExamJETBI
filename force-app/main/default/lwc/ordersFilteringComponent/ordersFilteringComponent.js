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
    @track records = [];
    isLoaded = false;
    title = title;

    @wire(getOrders, {selectedAccount: '$selectedAccount', selectedMonth: '$selectedMonth'}) waredOrders(result, error){
        if (result && result?.data){
            this.records = JSON.parse(JSON.stringify(result.data));
            this.records.forEach(item => item['Order Name'] = '/' + item['Id']);
            this.isLoaded = false;
        } else if (error) {
            this.showToast(labelError + '! ', error, 'error');
            this.records = [];
        }
    }

    getAccountFilter(event){
        this.isLoaded = true;
        this.selectedAccount = event.detail;
    }

    getMonthFilter(event){
        this.isLoaded = true;
        this.selectedMonth = event.detail;
    }

    showToast(title, message, variant){
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}