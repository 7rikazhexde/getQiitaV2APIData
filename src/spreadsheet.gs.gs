/**
 * ファイルを開いたときのイベントハンドラ
 */
function onOpen() {
  // Open時はアクティブなスプレッドシートを開いている状態のためgetActiveSpreadsheet()をコールする
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetList[0]);
  sheet.getRange("A1").setValue('FALSE');
}
  
/**
 * シート生成用関数
 * @see sheetList
 * @desc シートが存在するかをチェックして存在しなければ追加処理する
 */
function createUniqueSheet(){
  for(var i=0; i < sheetList.length; i++){
  checkAddSheet(sheetList[i]);
  }
}
  
/**
 * スプレッドシート削除用関数
 * @param {string} sheetName シート名
 * @desc sheetNameで指定したシート名を削除する
 */
function deleteUniqueSheet(sheetName){
  var spreadsheet = SpreadsheetApp.openById(spreadSheetID);
  var sheet = spreadsheet.getSheetByName(sheetName);
  spreadsheet.deleteSheet(sheet);
}
  
/**
 * シート初期化
 * @desc 初期値設定
 */
function initUniqueSheet(){
  var spreadsheet = SpreadsheetApp.openById(spreadSheetID);
  
  //sumシート
  var sheet = spreadsheet.getSheetByName(sheetList[4]);
  sheet.getRange('A1').setValue('日付');
  sheet.getRange('B1').setValue('list.length');
  sheet.getRange('C1').setValue('sum_page_views');
  sheet.getRange('D1').setValue('sum_likes');
  sheet.getRange('E1').setValue('sum_stocks');
  sheet.getRange('F1').setValue('par_likes');
  sheet.getRange('G1').setValue('par_stocks');

  //controlシート
  var sheet = spreadsheet.getSheetByName(sheetList[0]);
  if (sheet.getRange('A1').isBlank()){
  sheet.getRange('A1').insertCheckboxes();
  }			
}
  
/**
 * controlシート更新用関数
 * @desc controlシートのA1セルをFALSEに変更する
 */
function updateControlSheet(){
  var spreadsheet = SpreadsheetApp.openById(spreadSheetID)
  var sheet = spreadsheet.getSheetByName(sheetList[0]);
  sheet.getRange("A1").setValue('FALSE');
}
  
/**
 * シートチェック関数
 * @desc スプレッドシートにあるシートを検索して指定したシート名が存在するか可否判断する関数
 * @param {string} sheetName - シート名
 * @returns {boolean} 指定したシート名が存在する(true) or 存在しない(false)
 */
function isExistingSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.openById(spreadSheetID);
  var mySheets = spreadsheet.getSheets();
  //スプレッドシートにあるシート数だけforループを実行
  var flag = false;
  for(var i = 0; i< mySheets.length; i++){
  //引数のシート名と一致するシート名が存在した場合
  if(sheetName == mySheets[i].getSheetName()){
    //フラグをtrueにし、ループ処理を終了
    flag = true;
    break;
    }
  }
  //flag変数の結果を戻り値とする
  return flag;
}
  
  /**
   * シート作成用関数
   * @param {string} sheetName - シート名
   * @desc スプレッドシートに新しいシートを追加挿入する
   */
  function checkAddSheet(sheetName) {
    var spreadsheet = SpreadsheetApp.openById(spreadSheetID)
    if(!isExistingSheet(sheetName)){
      var newSheet = spreadsheet.insertSheet();
      newSheet.setName(sheetName);
    }
  }
  
/**
 * スプレッドシート初期登録用関数
 * @desc 初回起動時は'シート1'が作成されるため削除する
 * @todo ユーザーはスクリプト初回起動時に本関数を手動実行すること(2回目以降は不要)
 */
function initSheet(){
  createUniqueSheet();
  initUniqueSheet();
  if(isExistingSheet('シート1')){
    deleteUniqueSheet('シート1');
  }
}
  
/**
 * スプレッドシートのセルを編集したときのイベントハンドラを登録する関数
 * @todo 登録時1回のみ手動実行する(メニューバーの下にある「実行する関数を選択」からcreateEditTriggerを選び、左の実行をクリックする)
 * @see https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getactive
 * @todo エラーになる場合は以下のスコープをappsscript.jsonに設定し、承認をすること
 *       https://www.googleapis.com/auth/spreadsheets
 * @see https://developers.google.com/apps-script/reference/script/script-app#newTrigger(String)
 * @todo エラーになる場合は以下のスコープをappsscript.jsonに設定し、承認をすること
 *       https://www.googleapis.com/auth/script.scriptapp
 */
function createEditTrigger() { 
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onEditCell') // 新規トリガーとして登録する関数名を指定
          .forSpreadsheet(sheet)
          .onEdit() // 変更時のトリガーに設定
          .create();
}
  
/**
 * スプレッドシートのセルを編集したときのイベントハンドラ
 * @todo createEditTrigger()を実行して、実行後にonEdit(e)を削除もしくはコメンアウトしてonEditCell(e)のコメントアウトを外してください。
 * @param {Event} e The onEdit event.
 * @see https://developers.google.com/apps-script/guides/triggers#onedite
 * @see https://qiita.com/neras_1215/items/5dea01aecda9f93935bd
 */

function onEditCell(e) {
  if ( e.source.getSheetName() == 'control'){ 
    if (e.value === 'TRUE') {
      myFunction();
    }
  }
  // チェックボックスがTRUEでなければ終了する
  return;
}

  
/**
 * スプレッドシートのセルを編集したときのイベントハンドラ
 * @todo createEditTrigger()を実行して、実行後にonEdit(e)を削除もしくはコメンアウトしてonEditCell(e)のコメントアウトを外してください。
 * @param {Event} e The onEdit event.
 * @see https://developers.google.com/apps-script/guides/triggers#onedite
 */
/*
function onEdit(e) {
  if ( e.source.getSheetName() == 'control'){ 
    if (e.value === 'TRUE') {
      myFunction()
    }
  }
  // チェックボックスがTRUEでなければ終了する
  return
}
*/

/**
 * deleteRowDuplicateDate関数をシート単位で実行する関数
 * @param {String} spreadsheet スプレッドシートの一意の識別子。
 */
function checkSheetDateAndDeleteRowDuplicateDate(spreadsheet){
  // 日付データ作成
  var date = new Date();
  var now = date.getFullYear() + '/'  + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
  // 日付データが複数ある場合は一番新しいデータ以外を行指定で削除する
  for(var i = 0; i < sheetList.length; i++){
    var sheet = spreadsheet.getSheetByName(sheetList[i])
    console.log('シート名:',sheetList[i])
    deleteRowDuplicateDate(sheet,now)
  }
  // 正常終了
  return;
}
  
/**
 * 日付データが複数ある場合に一番新しいデータ以外を行指定で削除する関数
 * @param {String} sheet 取得するシートの名前
 * @param {String} val 検索する文字列(YYYY/DD/MM)
 */
function deleteRowDuplicateDate(sheet,val){
  var lastRow=sheet.getLastRow();
  const data = sheet.getRange(1, 1, lastRow).getValues();

  // 重複日付データ用配列に行数を詰める
  var duplicateDateList = [];
  for(var i = 1; i < data.length; i++){
    if(data[i] == val)
      duplicateDateList.push(i + 1);
  }
  console.log('重複リスト(行番号):',duplicateDateList)

  // 重複日付データは要素数1以下の場合は以降処理しないで終了する
  if(duplicateDateList.length <= 1){
    return;
  }

  // 2行以上の重複がある場合は一番後ろのデータは残すためにduplicateDateList.length-2から削除する
  for(var i = duplicateDateList.length-2; i >= 0; i--){
    console.log('削除行:',duplicateDateList[i])
    sheet.deleteRow(duplicateDateList[i]);
  }

  // 正常終了
  return;
}