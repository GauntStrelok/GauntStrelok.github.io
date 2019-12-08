class SelectForm {
  constructor(parameter) {
    this.parameter = parameter;
  }

  generateHtml() {
    let div = document.createElement("div");
    let label = document.createElement("Label");
    label.innerHTML = this.parameter.getName() + ":";
    div.appendChild(label);
    let select = document.createElement("Select");
    this.select = select;
    let options = this.parameter.getOther();

    let nullOption = document.createElement("option");
    nullOption.setAttribute("value", "");
    nullOption.innerHTML = "";
    select.appendChild(nullOption);

    options.forEach(option => {
      let optionTag = document.createElement("option");
      optionTag.setAttribute("value", option);
      optionTag.innerHTML = option;
      select.appendChild(optionTag);
    });
    div.appendChild(select);
    let description = document.createElement("span");
    description.innerHTML = this.parameter.getDescription();
    description.classList.add("description")
    div.appendChild(description);
    return div;
  }

  getValue() {
    if(!this.select) return "";
    if(!this.select.options) return "";
    if(this.select.selectedIndex === null) return "";
    if(!this.select.options) return "";
    return this.select.options[this.select.selectedIndex].value;
  }
}

class TextForm {
  constructor(parameter) {
    this.parameter = parameter;
  }

  generateHtml() {
    let div = document.createElement("div");
    let label = document.createElement("Label");
    label.innerHTML = this.parameter.getName() + ":";
    div.appendChild(label);
    let input = document.createElement("Input");
    this.input = input;
    div.appendChild(input);
    let description = document.createElement("span");
    description.innerHTML = this.parameter.getDescription();
    description.classList.add("description")
    div.appendChild(description);
    return div;
  }

  getValue() {
    return this.input ? this.input.value : "";
  }
}

class NumberForm {
  constructor(parameter) {
    this.parameter = parameter;
  }

  generateHtml() {
    let div = document.createElement("div");
    let label = document.createElement("Label");
    label.innerHTML = this.parameter.getName() + ":";
    div.appendChild(label);
    let input = document.createElement("Input");
    this.input = input;
    input.setAttribute("type", "number");
    div.appendChild(input);
    let description = document.createElement("span");
    description.innerHTML = this.parameter.getDescription();
    description.classList.add("description")
    div.appendChild(description);
    return div;
  }

  getValue() {
    return this.input ? this.input.value : "";
  }
}

class BooleanForm {
  constructor(parameter) {
    this.parameter = parameter;
  }

  generateHtml() {
    let div = document.createElement("div");
    let label = document.createElement("Label");
    label.innerHTML = this.parameter.getName() + ":";
    div.appendChild(label);
    let select = document.createElement("Select");
    this.select = select;

    let nullOption = document.createElement("option");
    nullOption.setAttribute("value", "");
    nullOption.innerHTML = "";
    select.appendChild(nullOption);

    let options = this.parameter.getOther();
    let optionTrue = document.createElement("option");
    optionTrue.setAttribute("value", "true");
    optionTrue.innerHTML = "Yes";
    select.appendChild(optionTrue);
    let optionFalse = document.createElement("option");
    optionFalse.setAttribute("value", "false");
    optionFalse.innerHTML = "No";
    select.appendChild(optionFalse);
    div.appendChild(select);
    let description = document.createElement("span");
    description.innerHTML = this.parameter.getDescription();
    description.classList.add("description")
    div.appendChild(description);
    return div;
  }

  getValue() {
    if(!this.select) return "";
    if(!this.select.options) return "";
    if(this.select.selectedIndex === null) return "";
    if(!this.select.options) return "";
    return this.select.options[this.select.selectedIndex].value;
  }
}

const type = {
  select: SelectForm,
  text: TextForm,
  number: NumberForm,
  boolean: BooleanForm
}

class Parameter {
  constructor(name, Type, description, other) {
    this.name = name;
    this.type = new Type(this);
    this.description = description;
    this.other = other;
  }

  generateHtml() {
    return this.type.generateHtml();
  }

  getInputValue() {
    return this.type.getValue();
  }

  getOther() {
    return this.other;
  }

  getDescription() {
    return this.description;
  }

  getType() {
    return this.type;
  }

  getName() {
    return this.name;
  }
}

const treeURL = "https://treee.github.io/emote-widget-simple"

const params = [
  // new Parameter("testSelect", type.select, "Determines if Twitch emotes are added to the random pool of visible emotes.",
  // ["volve", "a", "tu", "casa"]),
  new Parameter("showTwitch", type.boolean, "Determines if Twitch emotes are added to the random pool of visible emotes."),
  new Parameter("showBttv", type.boolean, "Determines if Bttv emotes are added to the random pool of visible emotes."),
  new Parameter("totalEmotes", type.number, "Determines the total emotes to create in one iteration."),
  new Parameter("secondsToRain", type.number, "Determines for how long emotes will be created."),
  new Parameter("secondsToWaitForRain", type.number, "How long to wait to start raining emotes again after they are stopped."),
  new Parameter("channel", type.text, "The channel whose emtoes to display"),
  new Parameter("numTimesToRepeat", type.number, "The number of times to repeat. Use -1 for continuous raining emotes!!"),
  new Parameter("single", type.text, "This will override emotes and only display a single emote base on its emote chatcode. Kappa")
]

function generateURLParameters() {
  let text = "?"
  text += params.reduce((finalText, param) => {
    let value = param.getInputValue();
    if(!value) return finalText;
    return finalText + param.getName() + "=" + value + "&";
  }, "");
  text = text.slice(0, -1);
  let link = document.getElementById("result");
  link.innerHTML = treeURL + text;
  link.setAttribute("href", treeURL + text);
  //document.getElementById("result").innerHTML = treeURL + text;
}


window.onload = () => {
  params.forEach(param => {
    document.getElementById('queryParametersForm').appendChild(param.generateHtml());
  });
};
