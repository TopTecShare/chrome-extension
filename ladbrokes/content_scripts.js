class B extends Error {
  constructor(e, t) {
    super(e), this.name = "CustomError", this.title = t
  }
}
class L extends B {
  constructor(e, t) {
    super(e, t), this.name = "SystemError"
  }
}
class S extends B {
  constructor(e, t) {
    super(e, t), this.name = "ConfigError"
  }
}

localStorage.setItem('price', 0.1);
localStorage.setItem("stop", true);

function getElementByXpath(path) {
  var elements;
  try {
    const result = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (0 !== result.snapshotLength) {
      elements = [];
      let t = 0;
      for (; t < result.snapshotLength;) elements.push(result.snapshotItem(t)), t += 1
    }
  } catch (e) {
    throw new S(`elementFinder: ${e.message.split(":")[1]}`, "Invalid Xpath");
  }
  return elements;
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + ms));
};

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const pasteToElement = element => {
  element.select();
  document.execCommand('paste');
}

const copyText = (str, element) => {
  // console.log(str);
  // console.log(element);
  const el = document.createElement('textarea');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('paste');
  copyToClipboard(str);
  pasteToElement(element);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

const getButtons = element => {
  return element.getElementsByTagName("button");
};

const getSiblings = element => {
  let buttons = [];
  let parent = element;
  let stopInfinte = 0;
  while (buttons.length <= 1 && stopInfinte++ < 20) {
    parent = parent.parentElement;
    buttons = getButtons(parent);
  };
  return buttons;
};

const getGlobalIndex = element => {
  let buttons = getElementByXpath('//button');
  for (let idx in buttons) {
    if (buttons[idx] === element) return idx;
  };
}

const getIndex = element => {
  let sibilings = getSiblings(element);
  for (let idx in sibilings) {
    if (sibilings[idx] === element) return idx;
  };
};

const IsSelect = button => {
  return button.parentElement.classList[3] === 'selected';
}

const getSelecteddButtons = () => {
  let buttons = getElementByXpath('//button');
  let selected = [];
  buttons.forEach(e => { if (IsSelect(e)) selected.push(e); });
  return selected;
};

const initialize = () => {
  localStorage.setItem('store', '[]');
  if (!localStorage.initial) localStorage.setItem('initial', '[]');
  localStorage.setItem("stop", false);
  addInitial();
}

const addStore = item => {
  let items = JSON.parse(localStorage.store);
  items.push(item);
  localStorage.setItem('store', JSON.stringify(items));
}

const IsStored = item => {
  let items = JSON.parse(localStorage.store);
  return items.includes(item);
}

const addCurrent = (str) => {
  // if (str == "") {
  //   getSelecteddButtons().forEach(button => {
  //     str += getIndex(button);
  //   })
  // }
  addStore(str);
}

const addInitial = () => {
  let str = "";
  let buttons = getElementByXpath('//button');
  let initial = JSON.parse(localStorage.initial);
  initial.forEach(e => {
    str += getIndex(buttons[e]);
  })
  addStore(str);
}

const getPrevSelecteddButtons = () => {
  let buttons = getElementByXpath('//button');
  let initial = JSON.parse(localStorage.initial);
  let selected = [];
  initial.forEach(e => {
    selected.push(buttons[e]);
  })
  return selected;
}

const getTrading = () => {
  let stopInfinte = 0;
  let str = "";
  getPrevSelecteddButtons().forEach(e => str += getSiblings(e).length);
  while (stopInfinte++ < 3486784401) {
    let result = "";
    let random = Math.floor(Math.random() * 3486784401);
    [...str].forEach(e => {
      result += random % e;
      random = (random - random % e) / e;
    });
    if (!IsStored(result)) return result;
  }
  return 'No found';
}

const clickButton = async button => {
  if (JSON.parse(localStorage.getItem('stop'))) return;
  if (!button) return;
  button.scrollIntoView();
  window.scrollBy(0, -300);
  await sleep(500);
  button.click();
  await sleep(500);
  if (getElementByXpath('//*[@id="quickbet"]/div[3]/div[3]/div[3]/button[1]')) getElementByXpath('//*[@id="quickbet"]/div[3]/div[3]/div[3]/button[1]')[0].click();
}

const trading = async () => {
  let result = getTrading();
  if (result === 'No found') return;
  addCurrent(result);
  let buttons = getPrevSelecteddButtons();
  for (let idx in result) {
    // if (getIndex(buttons[idPrevx]) == result[idx]) continue;
    // await clickButton(buttons[idx]);
    await clickButton(getSiblings(buttons[idx])[result[idx]]);
  };
}

const wait = async (element) => {
  let stopInfinite = 0;
  while (!element && stopInfinite < 30) {
    await sleep(300);
  }
  return stopInfinite < 30
}

async function autoBid() {
  initialize();
  let stopInfinte = 0;
  while (!JSON.parse(localStorage.getItem('stop')) && stopInfinte++ < 100000000000) {
    if (getElementByXpath('//*[@id="betslip-container"]/div/div[2]/div/div[2]/button'))
      getElementByXpath('//*[@id="betslip-container"]/div/div[2]/div/div[2]/button')[0].click();
    await trading();
    await sleep(1000);
    if (!await wait(getElementByXpath('//*[@id="betslip-container"]/div/div[1]/div[2]/div[2]/div/div/div[1]/div/input'))) continue;
    getElementByXpath('//*[@id="betslip-container"]/div/div[1]/div[2]/div[2]/div/div/div[1]/div/input')[0].scrollIntoView();
    window.scrollBy(0, -300);
    await sleep(500);
    copyText(localStorage.price, getElementByXpath('//*[@id="betslip-container"]/div/div[1]/div[2]/div[2]/div/div/div[1]/div/input')[0]);
    await clickButton(getElementByXpath('//*[@id="betslip-container"]/div/div[2]/div/div[2]/button[2]')[0]);
    await sleep(500);
    if (!JSON.parse(localStorage.getItem('stop')))
      await clickButton(getElementByXpath('//*[@id="betslip-container"]/div/div[2]/div/div[2]/button[2]')[0]);
    await sleep(2000);
    while (!getElementByXpath('//*[@id="betslip-container"]/div/div[2]/div/div[2]/button[2]')) await sleep(500);
    await clickButton(getElementByXpath('//*[@id="betslip-container"]/div/div[2]/div/div[2]/button[2]')[0]);
    await sleep(2000);
  }
}

async function preprocessing() {
  if (!JSON.parse(localStorage.getItem('stop'))) return;
  let buttons = getSelecteddButtons();
  if (buttons.length > 0) {
    let items = [];
    buttons.forEach(e => { items.push(getGlobalIndex(e)) });
    localStorage.setItem('initial', JSON.stringify(items));
  }
  let element = getElementByXpath('//*[@id="betslip-container"]/div/div[1]/div[2]/div[2]/div/div/div[1]/div/input');
  if (element) {
    if (Number(element[0].value > 0)) localStorage.setItem('price', Number(element[0].value));
  }
}

document.addEventListener('click', preprocessing);
window.addEventListener("autoBid", autoBid);

