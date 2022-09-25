/**
 * HTTP Request関数(GETメソッド)
 * @desc qiita_v2_apiでHTTP Request(GETメソッド)を送信して、page,view,stockを取得し、合計(=sum)をシートに書き出す関数
 * @throws {Exception} HTTPResponse
 * @see https://qiita.com/yoshi_yast/items/a0dacc4dd33106e66752
 * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
 * @see https://unity-yuji.xyz/spreadsheetapp-openbyid-create-not-permission-auth/
 * @todo エラーになる場合は以下のスコープをappsscript.jsonに設定し、承認をすること
 *       https://www.googleapis.com/auth/external_request
 */
function myFunction() {
  console.log('call myFunction()');

  // シート情報取得
  var spreadsheet = SpreadsheetApp.openById(spreadSheetID);
  
  // 変数設定
  var sumLikes = 0;
  var sumPageViews = 0;
  var sumStocks = 0;

  // 取得日付設定
  var date = new Date();
  // YYYY/MM/DD形式で作成
  var now = "'" + date.getFullYear() + '/'  + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
  var recordTitle = ['日付'];
  var recordPageViews = [now];
  var recordLikes = [now];
  var recordStocks = [now];

  // Qiita API による自身の投稿を取得
  var url = 'https://qiita.com/api/v2/authenticated_user/items';
  var option = {
    headers : {
      'Authorization' : authorizeInfo
    },
    method : 'get'
  }
  
  // リソースを取得して、インターネット経由で他のホストと通信する
  try {
    var res = UrlFetchApp.fetch(url, option);
  } catch (e) {
    var errorMessage = printError(e);
    // エラーログ出力
    console.error(errorMessage);
    // エラー内容送信
    sendMail(errorMessage);
    // controlシートのチェックボックスをFALSEにする
    updateControlSheet();
    return
  }
  var list = JSON.parse(res.getContentText());
  // 降順から昇順に変更
  list = list.reverse();

  // 取得したアイテムをループして、view, like, stockを取得
  for(var i = 0; i < list.length; i++) {

    var item = list[i];

    // likes数を取得
    var itemID = item['id'];
    var title = item['title'];
    var likesCount = item['likes_count'];
    sumLikes += likesCount;

    // page viewを取得
    url = 'https://qiita.com/api/v2/items/' + itemID;
    try {
      res = UrlFetchApp.fetch(url, option)
    } catch (e) {
      var errorMessage = printError(e);
      // エラーログ出力
      console.error(errorMessage);
      // エラー内容送信
      sendMail(errorMessage);
      // controlシートのチェックボックスをFALSEにする
      updateControlSheet();
      return
    }
    var json = JSON.parse(res.getContentText());
    var pageViewsCount = json['page_views_count'];
    sumPageViews += pageViewsCount;

    // stock数を取得
    var cnt = 1;
    var stockCount = 0;
    while(cnt < 10) {
      var urlStock = url + '/stockers?page=' + cnt + '&per_page=100';
      try {
        var resStock = UrlFetchApp.fetch(urlStock, option);
      } catch(e) {
        var errorMessage = printError(e);
        // エラーログ出力
        console.error(errorMessage);
        // エラー内容送信
        sendMail(errorMessage);
        // controlシートのチェックボックスをFALSEにする
        updateControlSheet();
        return
      }
      var jsonStock = JSON.parse(resStock.getContentText());
      var stockNum = jsonStock.length;

      if (stockNum != 100) {
        stockCount = (cnt * 100) - 100 + stockNum;
        sumStocks += stockCount;
        break
      } else {
        cnt += 1;
      }
    }

    // シート書き出しのためにデータをセット
    recordTitle.push(title);
    recordPageViews.push(pageViewsCount);
    recordLikes.push(likesCount);
    recordStocks.push(stockCount);
  }

  // 率を計算  
  var parLikes = sumLikes / sumPageViews;
  var parStocks = sumStocks / sumPageViews;

  // シート：sum
  var sheet = spreadsheet.getSheetByName(sheetList[4]);
  sheet.appendRow([now, list.length, sumPageViews, sumLikes, sumStocks, parLikes, parStocks]);
  // シート：view
  var sheet = spreadsheet.getSheetByName(sheetList[3]);
  sheet.getRange('1:1').clear();
  sheet.getRange(1,1,1,recordTitle.length).setValues([recordTitle]);
  sheet.appendRow(recordPageViews);
  // シート：like
  var sheet = spreadsheet.getSheetByName(sheetList[2]);
  sheet.getRange('1:1').clear();
  sheet.getRange(1,1,1,recordTitle.length).setValues([recordTitle]);
  sheet.appendRow(recordLikes);
  // シート：stock
  var sheet = spreadsheet.getSheetByName(sheetList[1]);
  sheet.getRange('1:1').clear();
  sheet.getRange(1,1,1,recordTitle.length).setValues([recordTitle]);
  sheet.appendRow(recordStocks);
  // シート：manage
  // 手動更新用のチェックボックスをFALSEに変更する
  var sheet = spreadsheet.getSheetByName(sheetList[0]);
  sheet.getRange("A1").setValue('FALSE');

  // シート毎に日付データの重複をチェックして重複があれば削除する
  checkSheetDateAndDeleteRowDuplicateDate(spreadsheet);

  // 正常終了
  return;
}