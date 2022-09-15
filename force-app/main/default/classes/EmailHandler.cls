public with sharing class EmailHandler {
    @AuraEnabled
    public static String sendEmail(Id recordId){
        if (recordId == null){
            throw new IllegalArgumentException(Label.NoMatchIdOfRecord);
        }
        try {
            Messaging.SingleEmailMessage email = createEmail(recordId);
            email.setSaveAsActivity(false);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
            return UserInfo.getUserEmail();
        } catch (Exception ex){
            throw new IllegalArgumentException(ex.getMessage());
        }
    }

    private static Messaging.SingleEmailMessage createEmail(Id recordId){
        EmailTemplate emailTemplate = [SELECT Id,
                                          Name
                                      FROM EmailTemplate
                                      WHERE Name = :getEmailTemplateName()
                                      LIMIT 1];
        if (emailTemplate == null){
            throw new IllegalArgumentException(Label.EmailTemplateIsNotFind);
        }
        try {
            return Messaging.renderStoredEmailTemplate(emailTemplate.Id, UserInfo.getUserId(), recordId);
        } catch (Exception ex){
            throw new IllegalArgumentException(Label.Error + ': ' + ex.getMessage());
        }
    }

    private static String getEmailTemplateName(){
        try {
            return Settings__mdt.getInstance('Order_Email_Template').Name__c;
        } catch (Exception ex){
            throw new IllegalArgumentException(Label.Error + ': ' + ex.getMessage());
        }
    }
}