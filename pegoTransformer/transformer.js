function addPrependToWords(prependText, text) {
  var r = text.replace(/(pego)?[a-zA-Z]+/g, function($0,$1){ return $1?$0:prependText+$0});
  return r;
}

$("#transformar").val(addPrependToWords("pego", $("#transformar").val()))
