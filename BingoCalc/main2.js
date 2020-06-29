//return true renders, return false does not render
const allNumbers = [...Array(90).keys()].map(n => n + 1);

const randomInt = function(max) {
  return Math.floor((max + 1) * Math.random());
}

class BingoAdmin {
  constructor() {
    this.players = [];
    this.selectedNumbers = [];
    this.availableNumbers = [...allNumbers];
    this.latestNumber = null;
    this.lineCalled = false;
    this.bingoCalled = false;
  }

  removeRandomAvailableNumber() {
    let index = randomInt(this.availableNumbers.length - 1);
    let number = this.availableNumbers[index];
    this.availableNumbers.splice(index, 1);
    this.selectedNumbers.push(number);
    this.latestNumber = number;
    return this.markPlayersCartones(number);
  }

  addPlayer(player) {
    this.players.push(player);
    //add validation by name and return false if player is already created
    return true;
  }

  getPlayerByName(name) {
    return this.players.find(player => player.name === name);
  }

  addCartonPlayerName(carton, playerName) {
    let player = this.getPlayerByName(playerName);
    if (player) {
      player.addCarton(carton);
      return true
    }
    return false;
  }

  markPlayersCartones(number) {
    let marked = false;
    let lines = [];
    let bingos = [];
    this.players.forEach(player => {
      if (player.markCarton(number)) {
        marked = true;
        if (player.hasLine) lines.push(player);
        if (player.hasBingo) bingos.push(player);
      }
    });
    if (!this.lineCalled && lines.length) {
      if (confirm("Estos jugadores tienen linea con el numero " + number + " .\n" +
          lines.map(player => player.name).join(", ") +
          "\n Apriete confirmar para que no vuelva a aparecer este mensaje, o cancelar para seguir viendolo")) {
        this.lineCalled = true;
      }
    }

    if (!this.bingoCalled && bingos.length) {
      if (confirm("Estos jugadores tienen BINGO con el numero " + number + " .\n" +
          bingos.map(player => player.name).join(", ") +
          "\n Apriete confirmar para que no vuelva a aparecer este mensaje, o cancelar para seguir viendolo")) {
        this.bingoCalled = true;
      }
    }

    return marked;
  }

  getHtmlPlayersRender() {
    let htmls = this.players.map(player => {
      return player.getHtmlRender();
    });
    return `<div class="playerContainer">${htmls.join('</div><div class="playerContainer">')}</div>`
  }

  renderPlayers() {
    document.getElementById("players").innerHTML = this.getHtmlPlayersRender();
  }

  getHtmlNumbersRender(fontSize) {

    let rows = [
      [""].concat([...Array(9).keys()].map(n => n + 1)),//first td is empty
      [...Array(10).keys()].map(n => n + 10),
      [...Array(10).keys()].map(n => n + 20),
      [...Array(10).keys()].map(n => n + 30),
      [...Array(10).keys()].map(n => n + 40),
      [...Array(10).keys()].map(n => n + 50),
      [...Array(10).keys()].map(n => n + 60),
      [...Array(10).keys()].map(n => n + 70),
      [...Array(10).keys()].map(n => n + 80),
      [90]
    ];

    let rowsHTML = "";
    rows.forEach(numbers => {
      rowsHTML += "<tr>"
      numbers.forEach(number => {
        let cssClass = "";
        if (this.selectedNumbers.includes(number)) cssClass += " selected"
        rowsHTML += `<td class="${cssClass}" style="font-size:${fontSize}px">${number}</td>`
      });
      rowsHTML += "</tr>";
    });

    let latestNumberHTML = this.latestNumber ?
      `<div class="latestNumberContainer"><h1 class="latestNumber">${this.latestNumber}</h1></div>` :
      "";


    let html = `${latestNumberHTML}<table>
        ${rowsHTML}
      </table>`
    return html;
  }

  renderNumbers(fontSize) {
    document.getElementById("numbers").innerHTML = this.getHtmlNumbersRender(fontSize);
  }

  renderAdminNumbersAmount() {
    document.getElementById("selectedNumbersAmount").innerHTML = "Bolillas sacadas: " + this.selectedNumbers.length;
  }

  resetBingo() {
    this.availableNumbers = [...allNumbers];
    this.selectedNumbers = [];
    this.players.forEach((player) => {
      player.reset();
    })
    this.renderPlayers();
    this.renderNumbers();
    this.renderAdminNumbersAmount();
    this.latestNumber = null;
    this.lineCalled = false;
    this.bingoCalled = false;
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.cartones = [];
    this.hasLine = false;
    this.hasBingo = false;
  }

  addCarton(carton) {
    this.cartones.push(carton);
    return true;
  }

  markCarton(number) {
    let marked = false;
    this.cartones.forEach(carton => {
      if (carton.mark(number)) {
        marked = true;
        if (!this.hasLine) {
          if (carton.checkLine()) this.hasLine = true;
        }
        if (!this.hasBingo) {
          if (carton.checkBingo()) this.hasBingo = true;
        }
      }
    });
    return marked;
  }

  getHtmlRender() {
    let html = `<h3 class="playerName"><span>${this.name}</span></h3>`;
    html = `
      <div class="playerForm">
        ${html}
        <input id="inputCarton${this.name}" onkeydown="window.bingoPage.keyPressAddCarton(event, '${this.name}')" type="text">
        <button onclick="bingoPage.addCartonPlayerNameButton(event, '${this.name}')">Agregar carton</button>
      </div>
      <span class="cartonInputInformation">
      Podes usar una coma para indicar un conjunto de cartones, por ejemplo 1,5 para indicar que agregue los cartones del 1 al 5
      </span>`;
    let cartonesHtml = this.cartones.map(carton => {
      return carton.getHtmlRender()
    });
    html += `<div class="cartonsContainer">
        <div class="cartonContainer">
          ${cartonesHtml.join('</div><div class="cartonContainer">')}
        </div>
      </div>`;
    return html;
  }

  reset() {
    this.hasLine = false;
    this.hasBingo = false;
    this.resetCartones();
  }

  resetCartones() {
    this.cartones.forEach((carton) => {
      carton.reset();
    })
  }
}

class Carton {
  constructor(cartonNumber) {
    this.cartonNumber = cartonNumber;
    let numbers = window.cartones[cartonNumber];
    this.numbers = numbers.map(n => {
      return {
        value: n,
        marked: false
      }
    });
  }

  mark(number) {
    let found = this.numbers.find(n => n.value === number);
    if (found) {
      found.marked = true;
      return true;
    } else {
      return false;
    }
  }

  checkLine() {
    let line1 = this.numbers.slice(0, 9);
    let line2 = this.numbers.slice(9, 18);
    let line3 = this.numbers.slice(18, 27);
    let lines = [line1, line2, line3];
    return lines.some(line => {
      return line.every(number => {
        return !number.value || number.marked
      });
    });
  }

  checkBingo() {
    return this.numbers.every(number => {
      return !number.value || number.marked
    });
  }

  getHtmlRender() {
    function getLineCells(numbers) {
      let html = "";
      numbers.forEach(numberObject => {
        let n = numberObject.value;
        let cssClass = "hasNumber"
        if (!n) {
          cssClass = "empty";
        }
        if (numberObject.marked) cssClass += " marked";
        html += `<td class="${cssClass}">${n || ""}</td>`
      });
      return html;
    }

    let line1 = this.numbers.slice(0, 9);
    let line2 = this.numbers.slice(9, 18);
    let line3 = this.numbers.slice(18, 27);

    let htmlCarton = `<h4 class="cartonNumber">${this.cartonNumber}:</h4><table><tbody>
    <tr>${getLineCells(line1)}</tr>
    <tr>${getLineCells(line2)}</tr>
    <tr>${getLineCells(line3)}</tr>
    </tbody>
    </table>`

    return htmlCarton;
  }

  reset() {
    this.numbers.forEach((number) => {
      number.marked = false;
    })
  }
}

class BingoPage {
  //this needs a bingoAdmin to work
  constructor(bingoAdmin) {
    this.bingoAdmin = bingoAdmin;
    this.numbersTableSize = 20;
  }

  keyPressAddPlayer(evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault(); // Ensure it is only this code that rusn
      this.addPlayer();
    }
  }

  addPlayer() {
    let name = document.getElementById("addPlayerInput").value;
    let player = new Player(name);
    if (this.bingoAdmin.addPlayer(player)) {
      this.bingoAdmin.renderPlayers();
      document.getElementById("addPlayerInput").value = ""
    } else {
      //some error?
    }
    return player;
  }

  //TODO remove testing function
  getPlayerByName(name) {
    return this.bingoAdmin.getPlayerByName(name);
  }

  //TODO remove testing function
  markCarton(number) {
    this.bingoAdmin.markPlayersCartones(number);
    this.bingoAdmin.renderPlayers();
    this.bingoAdmin.selectedNumbers.push(number);
    this.bingoAdmin.renderNumbers();
  }

  getRandomNumber() {
    if (this.bingoAdmin.removeRandomAvailableNumber()) this.bingoAdmin.renderPlayers();
    this.bingoAdmin.renderNumbers(this.numbersTableSize);
    this.bingoAdmin.renderAdminNumbersAmount();
  }

  keyPressAddCarton(evt, playerName) {
    if (evt.keyCode === 13) {
      evt.preventDefault(); // Ensure it is only this code that rusn
      let id = evt.target.id;
      if (this.addCartonPlayerName(evt.target.value, playerName)) {
        document.getElementById(id).focus()
      } else {
        //error?
      }
    }
  }

  addCartonPlayerNameButton(evt, playerName) {
    this.addCartonPlayerName(evt.target.parentElement.children[1].value, playerName);
  }

  addCartonPlayerName(cartonNumber, playerName) {
    if(cartonNumber.includes(",")) {
      let [initialCarton, finalCarton] = cartonNumber.split(",");
      let addedAtLeast1Carton = false;
      for(let i = initialCarton; i <= finalCarton; i++) {
        let carton = new Carton(i);
        if(this.bingoAdmin.addCartonPlayerName(carton, playerName)) {
          addedAtLeast1Carton = true;
        }
      }
      if(addedAtLeast1Carton) {
        this.bingoAdmin.renderPlayers();
        return true;
      } else {
        //error?
        return false;
      }

    } else {
      let carton = new Carton(cartonNumber);
      if (this.bingoAdmin.addCartonPlayerName(carton, playerName)) {
        this.bingoAdmin.renderPlayers();
        return true;
      } else {
        //error?
        return false;
      }
    }
  }

  zoomInNumbersTable() {
    this.numbersTableSize += 5;
    document.querySelectorAll("#numbers td").forEach(element => {
      //element.style.width = this.numbersTableSize + "px";
      //element.style.height = this.numbersTableSize + "px";
      element.style["font-size"] = this.numbersTableSize + "px";
    });
  }

  zoomOutNumbersTable() {
    if (this.numbersTableSize === 15) {
      return false;
    } else {
      this.numbersTableSize -= 5;
      document.querySelectorAll("#numbers td").forEach(element => {
        //element.style.width = this.numbersTableSize + "px";
        //element.style.height = this.numbersTableSize + "px";
        element.style["font-size"] = this.numbersTableSize + "px";
      });
    }
  }

  resetBingo() {
    this.bingoAdmin.resetBingo();
  }


}

window.bingoPage = new BingoPage(new BingoAdmin());
