/**
* スプレッドシートID用変数
* @param {String} spreadSheetID
* @todo ユーザーはスプレッドシートID用を設定すること
*/
const spreadSheetID = '[要ユーザー設定]スプレッドシートID';

/**
 * シート管理用配列
 * @param {String} sheetList
 * @todo ユーザーは追加したいシート名を右から順に定義すること
 */
const sheetList = ['control','stock','like','view','sum'];

/**
 * Qiita v2 API 設定用変数
 * @param {String} personalAccessToken 個人用アクセストークン
 * @todo ユーザーが個人用アクセストークンを作成し、設定してください
 * @see https://qiita.com/api/v2/docs#認証認可
 *
 * @param {String} authorizeInfo Authorizationリクエストヘッダ指定情報
 * @see https://qiita.com/api/v2/docs#アクセストークン
 *
 * @param {String} username
 */
const personalAccessToken = '[要ユーザー設定]個人用アクセストークン';
const authorizeInfo = 'Bearer ' + personalAccessToken;

/**
* Mail設定用変数
* @param {String} emailAddress
* @todo ユーザーはメールアドレスを指定すること（※本スクリプトでは送信元と宛先のメールアドレスは共用とします。変更する場合はユーザー自身で変更してください。）
*/
const emailAddress = '[要ユーザー設定]メールアドレス';

/**
* プロジェクト名用変数
* @param {String} projectName
* @todo ユーザーは作成したスクリプトのプロジェクト名を設定すること
*/
const projectName = '[要ユーザー設定]プロジェクト名';
