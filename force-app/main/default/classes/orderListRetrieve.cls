public with sharing class orderListRetrieve {

    @AuraEnabled(cacheable=true)
    public static List<Order__c> retrieveOrderData() {

        List<Order__c> orderList = [Select Id, Name, Account__c, Payment_Due_Date__c, Total_Amount__c From Order__c];
        return orderList;
    }
}