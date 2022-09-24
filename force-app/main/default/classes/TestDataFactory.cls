@isTest
public class TestDataFactory {
    public static List<Account> createAccounts(Integer numAccts) {
        List<Account> accts = new List<Account>();
        for(Integer i = 1 ; i <= numAccts ; i++) {
            Account a = new Account(Name = 'Test Account ' + i);
            accts.add(a);
        }
        insert accts;
        return accts;
    }

    public static List<Order__c> createOrder(Integer numOrders) {
        List<Order__c> orders = new List<Order__c>();
        Integer num = 1;
        for (Account acc : [SELECT Id,
                                Name
                            FROM Account
                            WHERE Name LIKE 'Test Account %'
                            LIMIT 49999]) {
			for (Integer i = 1; i <= numOrders; i++) {
                Order__c order = new Order__c(
                    Name = 'Test Order Number: ' + num,
                    Total_Amount__c = Integer.valueOf(1000 * Math.random() + 1) * 10,
                    Payment_Due_Date__c = Date.today().addDays(Integer.valueOf(Math.random() * 25)).addMonths(Integer.valueOf(Math.random() * 12)),
                    Account__c = acc.Id
                );
                orders.add(order);
                num++;
            }
        }
        insert orders;
        return orders;
    }
}