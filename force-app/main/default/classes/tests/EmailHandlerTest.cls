@IsTest
	public class EmailHandlerTest {
	@IsTest
    static void sendEmailPositive() {
        TestDataFactory.createAccounts(1);
        Order__c ord = TestDataFactory.createOrder(1).get(0);
        System.assertEquals(0, Limits.getEmailInvocations(), 'No emails should be sent');
        EmailHandler.sendEmail(ord.Id);
        System.assertEquals(1, Limits.getEmailInvocations(), 'Emails should be sent');
    }

    @IsTest
    static void sendEmailWithoutRecordIdNegative() {
        try {
            String result = EmailHandler.sendEmail(null);
            System.assertEquals(0, Limits.getEmailInvocations(), 'No emails should be sent');
            System.assertEquals(true, String.isBlank(result), 'Record Id is blank!');
        } catch (Exception ex) {
            System.assertEquals('No match Id of record!', ex.getMessage(), 'When sendEmail method don`t has argument');
        }
    }

    @IsTest(SeeAllData = false)
    static void sendEmailWithInvalidEmailTemplateNameNegative() {
        TestDataFactory.createAccounts(1);
        Order__c ord = TestDataFactory.createOrder(1).get(0);

        User user = [SELECT Id
                     FROM User
                     WHERE Id = :UserInfo.getUserId()];
        System.runAs(user) {
            delete [SELECT Id,
                        Name
                    FROM EmailTemplate
                    WHERE Name = 'Order Details'];
        }
        try {
            EmailHandler.sendEmail(ord.Id);
            System.assertEquals(0, Limits.getEmailInvocations(), 'No emails should be sent');
        } catch (Exception ex) {
            System.assertEquals('Error: Email template is not find!', ex.getMessage(), 'When no email template');
        }
    }
}





























