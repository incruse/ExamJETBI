@IsTest
	private class FilteringActionsControllerTest {
	@IsTest
        static void getAccountOptionsPositive() {
        TestDataFactory.createAccounts(5);
        TestDataFactory.createOrder(8);

        System.assertEquals(6, FilteringActionsController.getAccountOptions().size(), 'Account options is not blank');
        }

    @IsTest
        static void getAccountOptionsWithoutDataNegative() {
        try {
            List<Map<String, String>> accountOptions = FilteringActionsController.getAccountOptions();
            System.assertEquals(0, accountOptions.size(), 'Account options is blank');
        } catch (Exception ex) {
            System.assertEquals('Error: No Accounts with related Orders!', ex.getMessage(), 'Account options without data');
        }
    }

	@IsTest
        static void getMonthOptionsPositive() {
            TestDataFactory.createAccounts(1);
            TestDataFactory.createOrder(8);
            List<Map<String, String>> monthOptions = FilteringActionsController.getMonthOptions([SELECT Id FROM Account LIMIT 1].Id);
            System.assert(monthOptions.size() > 1);
        }

    @IsTest
    static void getMonthOptionsWithoutSelectedAccountNegative() {
        try {
            List<Map<String, String>> monthOptions = FilteringActionsController.getMonthOptions(null);
            System.assertEquals(0, monthOptions.size(), 'Month options is blank');
        } catch (Exception ex) {
            System.assertEquals('Missing select Account Id in getMonthOptions method.', ex.getMessage(), 'When method has null as argument');
        }
    }

    @IsTest
    static void getMonthOptionsWithoutOrdersNegative() {
        try {
            List<Map<String, String>> monthOptions = FilteringActionsController.getMonthOptions(TestDataFactory.createAccounts(1).get(0).Id);
            System.assertEquals(0, monthOptions.size(), 'Month options is blank');
        } catch (Exception ex) {
            System.assertEquals('Error: No orders matches', ex.getMessage(), 'When Account don`t has related Orders');
        }
    }
}