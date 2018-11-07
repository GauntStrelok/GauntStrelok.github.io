function addPrependToWords(prependText, text) {
  var r = text.replace(/(pego)?[a-zA-ZñÑá-úÁ-Ú]+/g, function($0,$1){ return $1?$0:prependText+$0});
  return r;
}

function runTransformation() {
  $("#transformar").val(addPrependToWords("pego", $("#transformar").val()))
}
