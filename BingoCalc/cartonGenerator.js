function randomInt(max) {
  return Math.floor((max + 1) * Math.random());
}

function getLineCells(numbers) {
  let finalHTML = "";
  numbers.forEach(n => {
    let cssClass = "hasNumber"
    if(!n) {
      cssClass = "empty";
    }
    finalHTML += `<td class="${cssClass}">${n || ""}</td>`
  });
  return finalHTML;
}


function showRandomCartones() {
  let amount = document.getElementById('amountCartones').value;
  let isContiguous = document.getElementById('contiguousCartones').checked;
  let totalCartones = cartones.length;
  let cartonNumber = 0;
  if(isContiguous) {
    cartonNumber = randomInt((totalCartones/6) - 1) * 6;
  } else {
    cartonNumber = randomInt(totalCartones - 1);
  }

  let selectedCartones = [];

  for(let i = 0; i < amount; i++) {
    selectedCartones.push({
        carton: window.cartones[(i+cartonNumber) % totalCartones],
        index: (i+cartonNumber) % totalCartones
      });
  }

  let finalHTML = '';

  selectedCartones.forEach(selectedCarton => {
    let carton = selectedCarton.carton;
    let line1 = carton.slice(0,9);
    let line2 = carton.slice(9,18);
    let line3 = carton.slice(18,27);
    let htmlCarton = `<h1>Numero carton: ${selectedCarton.index}</h1><table><tbody>
    <tr>${getLineCells(line1)}</tr>
    <tr>${getLineCells(line2)}</tr>
    <tr>${getLineCells(line3)}</tr>
    </tbody>
    </table>`
    finalHTML += htmlCarton;
  });

  document.getElementById('cartones').innerHTML = finalHTML;

}
