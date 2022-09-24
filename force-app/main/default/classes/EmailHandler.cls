public with sharing class EmailHandler {
    @AuraEnabled
    public static String sendEmail(Id recordId) {
        if (recordId == null) {
            throw new IllegalArgumentException(Label.NoMatchIdOfRecord);
        }
        try {
            Messaging.SingleEmailMessage email = createEmail(recordId);
            email.setSaveAsActivity(false);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
            return UserInfo.getUserEmail();
        } catch (Exception ex) {
            throw new IllegalArgumentException(ex.getMessage());
        }
    }

    private static Messaging.SingleEmailMessage createEmail(Id recordId) {
        try {
            return Messaging.renderStoredEmailTemplate(getEmailTemplate().Id, UserInfo.getUserId(), recordId);
        } catch (Exception ex) {
            throw new IllegalArgumentException(Label.Error + ': ' + ex.getMessage());
        }
    }

    private static EmailTemplate getEmailTemplate() {
        try {
            return [SELECT Id,
                        Name
                    FROM EmailTemplate
                    WHERE Name = :Settings__mdt.getInstance('Order_Email_Template').Name__c
                    LIMIT 1];
        } catch (Exception ex) {
            throw new IllegalArgumentException(Label.EmailTemplateIsNotFind);
        }
    }
}