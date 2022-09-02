public with sharing class ordersResultController {
    @AuraEnabled(Cacheable=true)
    public static List<Order__c> getOrders(String selectedAccount, String selectedMonth) {
        List<Order__c> result = new List<Order__c>();
        if (String.isEmpty(selectedAccount) && String.isEmpty(selectedMonth)) {
            result = [SELECT Id, Name, Account__c, Payment_Due_Date__c, Total_Amount__c From Order__c LIMIT 49999];

        } else if (!String.isEmpty(selectedAccount) && String.isEmpty(selectedMonth)) {
            result = [SELECT Id, Name, Account__c, Payment_Due_Date__c, Total_Amount__c
            FROM Order__c
            WHERE Account__c IN (SELECT Id FROM Account WHERE Name LIKE :selectedAccount)
            LIMIT 49999 ];

        } else if (!String.isEmpty(selectedAccount) && !String.isEmpty(selectedMonth)) {
            for (Order__c item : [SELECT Id, Name, Account__c, Payment_Due_Date__c, Total_Amount__c
            FROM Order__c
            WHERE Account__c IN (SELECT Id FROM Account WHERE Name LIKE :selectedAccount)
            LIMIT 49999 ]) {
                String numOfMonth = String.valueOf(item.Payment_Due_Date__c.month());
                if (numOfMonth == selectedMonth) {
                    result.add(item);
                }
            }
        }
        return result;
    }
}