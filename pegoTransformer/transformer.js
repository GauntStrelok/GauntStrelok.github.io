function addPrependToWords(prependText, text) {
  var r = text.replace(/(pego)?[a-zA-Z]+/g, function($0,$1){ return $1?$0:prependText+$0});
  return r;
}

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
