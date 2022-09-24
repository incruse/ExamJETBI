@IsTest
private class RandomDataCreatorTest {
    @TestSetup
    static void setup() {
        TestDataFactory.createAccounts(5);
        TestDataFactory.createOrder(8);
    }

    @IsTest
    static void createAccountsTest() {
        RandomDataCreator.createAccounts();
        List<Account> result = [SELECT Id,
                                    Name
                                FROM Account
                                WHERE Name LIKE 'Test Account%'];
        System.assertEquals(result.size(), 10, '5 Account was created in testSetup method and 5 was be created from testing method');
    }

    @IsTest
    static void createOrdersTest() {
        RandomDataCreator.createOrders();
        List<Order__c> result = [SELECT Id,
                                    Name,
                                    Account__c,
                                    Total_Amount__c,
                                    Payment_Due_Date__c
                                FROM Order__c
                                WHERE Name LIKE 'Test Order%'];
        System.assertEquals(result.size(), 80, '40 Orders was created in testSetup and 40 was created in used testing method.');
    }
}