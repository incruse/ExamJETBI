import { LightningElement } from 'lwc';

export default class ComboboxBasic extends LightningElement {
    selectedAccount = '';
    selectedMonth = '';

    get accountsOptions() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }
    get monthsOptions() {
        return [
            { label: 'New1', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
