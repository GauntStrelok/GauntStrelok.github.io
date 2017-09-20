function addPrependToWords(prependText, text) {
  var caos = text.replace("[a-zA-Z]+", prependText + "$&")
  console.log(caos);
  console.log(text);
  return caos;
  var words = text.split(" ");
  words.map(word => {
    let firstCharcode = word.charCodeAt(0);
    let secondCharcode = word.charCodeAt(1);
    if((firstCharcode >= 65 && firstCharcode <= 90) || (firstCharcode >= 97 && firstCharcode <= 122)){
      return prependText + word;
    } else if((secondCharcode >= 65 && secondCharcode <= 90) || (secondCharcode >= 97 && secondCharcode <= 122)) {
      return word[0] + prependText + word.substring(1);
    } else {
      console.log("error with word, " + word);
      return word;
    }
  });
  return words.join(" ");
}
