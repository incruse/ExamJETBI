import { LightningElement, api, track } from 'lwc';
import nameLabel from '@salesforce/label/c.Name';
import accountLabel from '@salesforce/label/c.Account';
import totalAmountLabel from '@salesforce/label/c.TotalAmount';
import paymentDueDateLabel from '@salesforce/label/c.PaymentDueDate';

const columns = [
    { label: nameLabel, fieldName: 'Order Name', sortable: "true" , type: 'url' ,typeAttributes: {label: { fieldName: 'Name' }}},
    { label: accountLabel, fieldName: 'AccountURL', sortable: "true", type: 'url' ,typeAttributes: {label: { fieldName: 'Account Name' }}},
    { label: totalAmountLabel, fieldName: 'Total_Amount__c', type: 'number', sortable: "true"},
    { label: paymentDueDateLabel, fieldName: 'Payment_Due_Date__c', type: 'Date', sortable: "true" }
];

export default class DataTableSortingLWC extends LightningElement {
    @api title;
    @track _records;
    @track columns = columns;
    @track sortBy;
    @track sortDirection;

    @api
    get records(){
        return this._records;
    }
    set records(value){
        if (!value){
            return;
        }
        this._records = JSON.parse(JSON.stringify(value));
    }

    doSorting(event){
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldName, direction){
        let parseData = JSON.parse(JSON.stringify(this._records));
        let keyValue = (a) => {
            return a[fieldName];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this._records = parseData;
    }
}