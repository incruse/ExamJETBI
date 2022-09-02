import { LightningElement, api, track } from 'lwc';

const columns = [ { label: 'Name', fieldName: 'Order Name', sortable: "true" , type: 'url' ,typeAttributes: {label: { fieldName: 'Name' }}},
                  { label: 'Account', fieldName: 'Account__c', sortable: "true"},
                  { label: 'Total Amount', fieldName: 'Total_Amount__c', type: 'number', sortable: "true"},
                  { label: 'Payment Due Data', fieldName: 'Payment_Due_Date__c', type: 'Date', sortable: "true" },];

export default class DataTableSortingLWC extends LightningElement {
    @api tittle;
    @track _records;
    @track columns = columns;
    @track sortBy;
    @track sortDirection;

    @api
    get records() {
        return this._records;
    }
    set records(value) {
        if (!value) {
            return;
        }
        this._records = JSON.parse(JSON.stringify(value));
        console.log(JSON.parse(JSON.stringify(value)));
    }

    doSorting(event) {
            this.sortBy = event.detail.fieldName;
            this.sortDirection = event.detail.sortDirection;
            this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this._records));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this._records = parseData;
    }
}