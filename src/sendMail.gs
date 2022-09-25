/**
 * エラー内容をメール(Gmail)で送信する関数
 * @param {String} message 本文（エラー内容）
 * @todo optionsは必要であれば追加してください。
 */
function sendMail(message) {
  const recipient = emailAddress;
  const subject = '【GAS】エラー通知メール';

  const body = 'エラー通知メール\n'
             + 'プロジェクト名: ' + projectName + '\n'
             + 'エラー内容:\n\n'
             + message;

  GmailApp.sendEmail(recipient, subject, body);
}

function test(){
  sendMail('test');
}