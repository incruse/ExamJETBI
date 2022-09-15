@IsTest
	public class EmailHandlerTest {
	@IsTest
        static void sendEmailPositive(){
            TestDataFactory.createAccounts(1);
            Order__c ord = TestDataFactory.createOrder(1).get(0);
            System.assertEquals(0, Limits.getEmailInvocations(), 'No emails should be sent');
            EmailHandler.sendEmail(ord.Id);
            System.assertEquals(1, Limits.getEmailInvocations(), 'Emails should be sent');
        }

    @IsTest
    static void sendEmailWithoutRecordIdNegative(){
        try {
            String result = EmailHandler.sendEmail(null);
            System.assertEquals(0, Limits.getEmailInvocations(), 'No emails should be sent');
            System.assertEquals(true, String.isBlank(result), 'Record Id is blank!');
        } catch (Exception ex){
            System.assertEquals('No match Id of record!', ex.getMessage(), 'When sendEmail method don`t has argument');
        }
    }

    @IsTest
    static void sendEmailWithInvalidEmailTemplateNameNegative(){

        TestDataFactory.createAccounts(1);
        Order__c ord = TestDataFactory.createOrder(1).get(0);

        try {
            Settings__mdt Order_Email_Template = Settings__mdt.getInstance('Order_Email_Template');
            Order_Email_Template.Name__c = 'Invalid Email Template Name';

            EmailHandler.sendEmail(ord.Id);
            System.assertEquals(0, Limits.getEmailInvocations(), 'No emails should be sent');
        } catch (Exception ex){
            System.assertEquals('Error: ' + ex, ex.getMessage() );
        }
    }
}