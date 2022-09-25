/**
 * エラーログ出力用関数
 * @param {Error} error Errorインスタンス
 * @return {string} エラー名とスタックトレース
 */
function printError(error){
  return "[Error     ] "  + error.name + "\n" + 
         "[StackTrace]\n" + error.stack;
}