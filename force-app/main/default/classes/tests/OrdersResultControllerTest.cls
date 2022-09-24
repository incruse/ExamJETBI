@IsTest
	private class OrdersResultControllerTest {
    @TestSetup
    static void setup() {
        TestDataFactory.createAccounts(5);
        TestDataFactory.createOrder(8);
    }

    @IsTest
    static void getOrdersWithoutArgumentsPositive() {
        List<Order__c> testResult = [SELECT Id
                                     FROM Order__c];
        System.assertEquals(testResult.size(), OrdersResultController.getOrders(null , null).size(), 'Must be 40 records from Order.');
    }

    @IsTest
    static void getOrdersWithAccountParamPositive() {
        Id acc = [SELECT Id
                  FROM Account
                  LIMIT 1].Id;
        List<Order__c> testResult = [SELECT Id,
                                        Account__c
                                     FROM Order__c
                                     WHERE Account__c = :acc];
        System.assertEquals(testResult.size(), OrdersResultController.getOrders( acc, null).size(), 'Must be 8 records from Order.');
    }

    @IsTest
    static void getOrdersPositiveTest() {
        Id acc = [SELECT Id
                  FROM Account
                  LIMIT 1].Id;
        Integer month = [SELECT Id,
                            Payment_Due_Date__c
                         FROM Order__c
                         LIMIT 1].Payment_Due_Date__c.month();

        List<Order__c> orders = [SELECT Id,
                                        Account__c,
                                        Payment_Due_Date__c
                                     FROM Order__c
                                     WHERE Account__c = :acc
                                     AND CALENDAR_MONTH(Payment_Due_Date__c) = :month];
        System.assertEquals(orders.size(), OrdersResultController.getOrders( acc, String.valueOf(month)).size(), 'Must be equals records from Order.');
    }
}