public with sharing class FilteringActionsController {
    private static Map<String, String> noneOptions = new Map<String, String>{
            'label' => Label.None,
            'value' => Label.None
    };

    @AuraEnabled(Cacheable=true)
    public static List<Map<String, String>> getAccountOptions() {
        try {
            return fetchAccounts();
        } catch (Exception ex) {
            throw new IllegalArgumentException(Label.Error + ': ' + ex.getMessage());
        }
    }

    @AuraEnabled(Cacheable=true)
    public static List<Map<String, String>> getMonthOptions(String selectedAccount) {
        if (String.isBlank(selectedAccount)) {
            throw new IllegalArgumentException(Label.MissingSelectAccountIdInGetMonthOptionsMethod);
        }
        try {
            return fetchMonth(selectedAccount);
        } catch (Exception ex) {
            throw new IllegalArgumentException(Label.Error + ': ' + ex.getMessage());
        }
    }

    private static List<Map<String, String>> fetchAccounts() {
        List<Map<String, String>> result = new List<Map<String, String>>();
        List<Account> accounts = [SELECT Id,
                                      Name,
                                      (SELECT Id, Payment_Due_Date__c FROM Orders__r)
                                  FROM Account
                                  WHERE Id IN (SELECT Account__c FROM Order__c)
                                  ORDER BY Name ASC
                                  LIMIT 49999];
        if(accounts.isEmpty()) {
             throw new IllegalArgumentException(Label.NoAccountsWithRelatedOrders);
        }
        for (Account acc : accounts) {
            Map<String, String> values = new Map<String, String>();
            values.put('label' , acc.Name);
            values.put('value', String.valueOf(acc.Id));
            result.add(values);
        }
        result.add(0, noneOptions);
        return result;
    }

    private static List<Map<String, String>> fetchMonth(String selectedAccount) {
        List<Map<String, String>> result = new List<Map<String, String>>();
        Set<Map<String, String>> monthOptions = new Set<Map<String, String>>();
        String query = 'SELECT Id, Name, Payment_Due_Date__c, Account__c';
        query += ' FROM Order__c';
        if (String.isNotBlank(selectedAccount)) {
            query += ' WHERE Account__c = :selectedAccount';
        }
        query += ' GROUP BY Id, Name, Payment_Due_Date__c, Account__c';
        query += ' ORDER BY CALENDAR_MONTH(Payment_Due_Date__c) ASC';
        AggregateResult[] queryResult = Database.query(query);
        if (queryResult.isEmpty()) {
            throw new IllegalArgumentException(Label.NoOrdersMatches);
        }
        for (AggregateResult arg : queryResult) {
            Map<String, String> month = new Map<String, String>();
            Date ddt = Date.valueOf(arg.get('Payment_Due_Date__c'));
            String monthName = Datetime.newInstance(ddt.year(), ddt.month(), ddt.day()).format('MMMMM');
            month.put('label' , monthName);
            month.put('value', String.valueOf(ddt.month()));
            monthOptions.add(month);
        }
        result.addAll(monthOptions);
        result.add(0, noneOptions);
        return result;
    }
}