import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendEmail from '@salesforce/apex/EmailHandler.sendEmail';
import labelError from '@salesforce/label/c.Error';
import SuccessSendOrder from '@salesforce/label/c.SuccessSendOrder';


export default class SendOrder extends LightningElement {
    @track email = '';
    @api recordId;
    @api invoke() {
        sendEmail({recordId: this.recordId})
            .then(result => {
                this.month = result;
                this.showToast(SuccessSendOrder + ' ' + result, '', 'success');
            })
            .catch(error => {
                this.showToast(labelError, error, 'error');
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