# getQiitaV2APIData
Qiitaのデータ(view, like, stock)を取得するGoogle Apps Script(GAS)

## 前提条件
* Qiita 個人用アクセストークンを発行済みであること。
Qiita「設定」→「アプリケーション」→「個人用アクセストークン」 （読み取り専用：read_qiita）
* Googleアカウント取得済みであること。

## 仕様
* Qiita API v2を使用してHTTP GETリクエストを送信し、```view```,```like```,```stock```を取得します。
取得処理は以下記事のソースコードを参考にさせていだきました。
[【Qiita API】いろんな方法で Views、Likes、Stocksを取得（JavaScript、Google Script、Python, Vue.js）](https://qiita.com/yoshi_yast/items/a0dacc4dd33106e66752)
* スプレッドシートにはAPIリクエスト時の日付データ(YYYY/MM/DD)と取得したデータをセットにして、```view```,```like```,```stock```シートに追加します。
* APIリクエストはGASの関数実行(手動、定期、チェックボックス操作)で送信します。
* チェックボックス操作はPC、スマートフォンに対応し、```control```シートのチェックボックスを有効(TRUE)にするとスマホからAPIリクエストを送信し、正常終了、異常終了時に無効(```FALSE```)に変更します。
* 複数回データ取得を行う場合は日付データを基準に重複する日付を特定して、行単位で最新データのみ残します。

## 設定と使い方
* qiitaアクセストークンを設定する
* ```initSheet()```を実行して書込み先シートを作成する
  * ```initSheet()```では関連シート(```sum```,```view```,```like```,```stock```,```control```)を追加して初期値を設定します。
* ```myFunction()```を実行してスクリプトからGoogleアカウントへのアクセスを許可する **(※初回実行時※2022/09/21現在)**
  * Googleスプレッドシー卜の参照、編集、作成、削除
  * 外部サービスへの接続
  * 自分がいないときにこのアプリケーションを実行できるようにする
* スプレッドシート更新用イベントトリガーの設定 **(※スマートフォンから関数実行を有効にしたい場合)**
  * ```createEditTrigger()```を実行して、実行後に```onEdit(e)```を削除もしくはコメンアウトして```onEditCell(e)```のコメントアウトを外してください。
* プロジェクトを定期実行設定 **(※定期実行を有効にする場合)**
  * 「編集」→「現在のプロジェクトのトリガー」から設定。1日1回の取得を設定）
  * Googleアカウントへのアクセスを許可する(※初回実行時※2022/09/21現在)
    * このアプリケーションがインストールされているスプレッドシートの表示と管理
    * 外部サービスへの接続
    * 自分がいないときにこのアプリケーションを実行できるようにする
* スコープ設定(```appsscript.json```) 
**※ユーザー環境により異なります必要に応じて設定してください。**
関数の```@todo```を参照し、以下のスコープを設定してください。
```json
  "oauthScopes": [
   "https://www.googleapis.com/auth/script.external_request",
   "https://www.googleapis.com/auth/spreadsheets",
   "https://www.googleapis.com/auth/script.scriptapp"
  ],
```

### reference
* fetch(url, params)
https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
* getActive()
https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#getactive
* newTrigger(functionName)
https://developers.google.com/apps-script/reference/script/script-app#newTrigger(String)


