function sendMail(message) {
  const recipient = emailAddress;
  const subject = '【GAS】エラー通知メール';

  const body = 'エラー通知メール\n'
             + 'プロジェクト名: ' + projectName + '\n'
             + 'エラー内容:\n\n'
             + message;
             
  const options = {
    from: emailAddress ,
    name: 'sendGmailFromSSエラー通知'
  };

  GmailApp.sendEmail(recipient, subject, body, options);
}

function test(){
  sendMail('test');
}