public with sharing class OrdersResultController {
    @AuraEnabled(Cacheable=true)
    public static List<Order__c> getOrders(String selectedAccount, String selectedMonth){
        List<Order__c> result = new List<Order__c>();
        try {
            result = fetchOrders(selectedAccount, selectedMonth);
        } catch (Exception ex){
            throw new IllegalArgumentException(Label.Error + ': ' + ex.getMessage());
        }
        return result;
    }

    private static List<Order__c> fetchOrders (String selectedAccount, String selectedMonth){
        String query = 'SELECT Id, Name, Payment_Due_Date__c, Account__c, Account__r.Name, Total_Amount__c FROM Order__c';
        if (String.isNotBlank(selectedAccount)){
            query += ' WHERE Account__c = :selectedAccount';
        }
        if (String.isNotBlank(selectedMonth) && String.isNotBlank(selectedAccount)){
            query += ' AND CALENDAR_MONTH(Payment_Due_Date__c) = ' + selectedMonth;
        }
        query += ' ORDER BY Name ASC';
        query += ' LIMIT 49999';
        return Database.query(query);
    }
}