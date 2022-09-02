public with sharing class filteringActionsController {
    private static Map<String, String> none = new Map<String, String>{
        'label' => '--None--',
        'value' => '--None--'
    };

    @AuraEnabled(Cacheable=true)
    public static List<Map<String, String>> getAccountOptions() {
        List<Map<String, String>> accountsOptions = new List<Map<String, String>>();

        for (Account acc : [SELECT Id, Name, (SELECT Id, Payment_Due_Date__c FROM Orders__r) FROM Account WHERE Id IN (SELECT Account__c FROM Order__c) ORDER BY Name]) {
            Map<String, String> values = new Map<String, String>();
            values.put('label' , acc.Name);
            values.put('value', acc.Name);
            accountsOptions.add(values);
        }
        accountsOptions.add(0, none);
        return accountsOptions;
    }
    @AuraEnabled(Cacheable=true)
    public static List<Map<String, String>> getMonthOptions(String selectedAccount) {
        List<Map<String, String>> options = new List<Map<String, String>>();
        Set<Map<String, String>> monthOptions = new Set<Map<String, String>>();

            for (Account acc : [SELECT Id, Name, (SELECT Id, Payment_Due_Date__c FROM Orders__r) FROM Account WHERE Id IN (SELECT Account__c FROM Order__c) ORDER BY Name]) {
                if (acc.Name == selectedAccount) {
                    for (Order__c order : acc.Orders__r) {
                        Map<String, String> month = new Map<String, String>();
                        Date ddt = order.Payment_Due_Date__c;
                        String monthName = DateTime.newInstance(ddt.year(), ddt.month(), ddt.day()).format('MMMMM');

                        month.put('label' , monthName);
                        month.put('value', String.valueOf(ddt.month()));
                        monthOptions.add(month);
                    }
                }
            }

        List<Integer> avielebleMonth = new List<Integer>();
        for (Map<String, String> item : monthOptions) {
            avielebleMonth.add(Integer.valueOf(item.get('value')));
        }

        avielebleMonth.sort();
        for (Integer i : avielebleMonth) {
            for (Map<String, String> item : monthOptions) {
                String rr = item.get('value');
                if (rr == String.valueOf(i)) {
                    options.add(item);
                }
            }
        }
        options.add(0, none);
        return options;
    }
}