import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendEmail from '@salesforce/apex/EmailHandler.sendEmail';

export default class SendOrder extends LightningElement {
    @track email = '';
    @api recordId;
    @api invoke () {
        sendEmail({ recordId: this.recordId})
            .then(result => {
                 this.month = result;
                 this.showToast('Success!', 'The record ' + this.recordName + ' to ' + result + ' successfully sent!', 'success');
            })
                .catch(error => {
                 this.showToast('Error!', error, 'error');
            });
    }

    showToast(tittle, message, variant) {
        const event = new ShowToastEvent({
            title: tittle,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

}