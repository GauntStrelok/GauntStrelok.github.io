function getLineCells(numbers) {
  let finalHTML = "";
  numbers.forEach(n => {
    let cssClass = "hasNumber"
    if(!n) {
      cssClass = "empty";
    }
    finalHTML += `<td class="${cssClass}" ${n ? "onclick='toggleNumber(event)'" : ""}>
    ${n || ""}
    <span class="marcador">4</span>
    </td>`
  });
  return finalHTML;
}


function showCartones() {
  let cartonNumber = document.getElementById('cartonesToCreate').value;
  let selectedCartones = [];
  if(cartonNumber.includes(",")) {
    let [initialCarton, finalCarton] = cartonNumber.split(",");
    selectedCartones = [...Array(finalCarton - initialCarton + 1)].map((n,i) => i + parseInt(initialCarton));
  } else {
    selectedCartones = [cartonNumber];
  }

  let finalHTML = '';

  selectedCartones.forEach(selectedCartonNumber => {
    let carton = window.cartones[selectedCartonNumber];
    let line1 = carton.slice(0,9);
    let line2 = carton.slice(9,18);
    let line3 = carton.slice(18,27);
    let htmlCarton = `<h1>Numero carton: ${selectedCartonNumber}</h1><table><tbody>
    <tr>${getLineCells(line1)}</tr>
    <tr>${getLineCells(line2)}</tr>
    <tr>${getLineCells(line3)}</tr>
    </tbody>
    </table>`
    htmlCarton = `<div class="cartonContainer">${htmlCarton}</div>`;
    finalHTML += htmlCarton;
  });

  document.getElementById('cartones').innerHTML += finalHTML;

}

function toggleNumber(event) {
  if(event.currentTarget.classList.contains("marked")) {
    event.currentTarget.classList.remove("marked");
  } else {
    event.currentTarget.classList.add("marked");
  }
}
