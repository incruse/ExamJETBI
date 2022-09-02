public without sharing class EmailHandler {
    @AuraEnabled
    public static String sendEmail(Id recordId) {
        Order__c recordToSend = [SELECT Id, Name, Total_Amount__c, Payment_Due_Date__c, Account__c FROM Order__c WHERE Id = :recordId LIMIT 1].get(0);
        Messaging.SingleEmailMessage email = Messaging.renderStoredEmailTemplate(
            [SELECT Id, Name FROM EmailTemplate WHERE Id = '00X7Q000000y8jdUAA'].Id,
            UserInfo.getUserId(),
            recordToSend.Id);

        String subject = email.getSubject();
        String body = email.getHtmlBody();
        email.setTargetObjectId(UserInfo.getUserId());
        email.setSubject(subject);
        email.setHtmlBody(body);
        email.saveAsActivity = false;

        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
        return UserInfo.getUserEmail();
    }
}