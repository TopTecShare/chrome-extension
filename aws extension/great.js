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

localStorage.setItem('trade', false);
localStorage.setItem('start', false);
localStorage.setItem('stop', false);
localStorage.setItem('crash', false);
localStorage.setItem('real', false);
localStorage.setItem('earn', true);
localStorage.setItem('worst', 0);
localStorage.setItem('state', 0);
localStorage.setItem('profit', 0);
// localStorage.setItem('real', true);

const min = '//*[@id="root"]/div[2]/div/div[4]/div/main/div/div/div/div[1]/div/div/div[2]/div/div[1]/div[4]/div/div[3]/div/div[1]/div/div[2]/button[1]';
const max = '//*[@id="root"]/div[2]/div/div[4]/div/main/div/div/div/div[1]/div/div/div[2]/div/div[1]/div[4]/div/div[3]/div/div[1]/div/div[2]/button[4]';
const half = '//*[@id="root"]/div[2]/div/div[4]/div/main/div/div/div/div[1]/div/div/div[2]/div/div[1]/div[4]/div/div[3]/div/div[1]/div/div[2]/button[2]';
const double = '//*[@id="root"]/div[2]/div/div[4]/div/main/div/div/div/div[1]/div/div/div[2]/div/div[1]/div[4]/div/div[3]/div/div[1]/div/div[2]/button[3]';
const bet = '//*[@id="root"]/div[2]/div/div[4]/div/main/div/div/div/div[1]/div/div/div[2]/div/div[1]/div[4]/div/div[1]/button';
const conf = '//*[@id="root"]/div[2]/div/div[4]/div/main/div/div/div/div[1]/div/div/div[2]/div/div[1]/div[4]/div/div[3]/div/div[1]/div/div[2]/div/div[2]/div/button[1]';
const prev = 4;
const next = 3;
const CON = prev + next;

setInterval(() => {
  const crashPath = '//*[@id="crash-payout-text"]';
  if (JSON.parse(localStorage.trade)) {
    if (JSON.parse(localStorage.start)) {
      if (getElementByXpath(crashPath)[0].innerHTML.split(' ')[0] == 'Crashed') {
        localStorage.setItem('crash', true);
        localStorage.setItem('start', false);
        if (Number(getElementByXpath(crashPath)[0].innerHTML.split(' ')[2].split('x')[0]) > 2) {
          localStorage.setItem('earn', true);
          if (localStorage.state >= next) { localStorage.setItem('real', true); localStorage.setItem('profit', 0); }
          if (JSON.parse(localStorage.real)) localStorage.setItem('profit', Number(localStorage.profit) + 1);
          if (Number(localStorage.profit) >= Math.pow(2, next - 1)) localStorage.setItem('real', false);
          localStorage.setItem('state', 0);
        } else {
          localStorage.setItem('earn', false);
          if (localStorage.state >= next) localStorage.setItem('real', false);
          localStorage.state = 1 + Number(localStorage.state);
          if (Number(localStorage.state) > Number(localStorage.worst)) localStorage.setItem('worst', Number(localStorage.state));
        }
        localStorage.setItem('trade', false);
        if (!JSON.parse(localStorage.stop))
          trading();
      }
    } else {
      if (getElementByXpath(crashPath)[0].innerHTML.split(' ')[0] !== 'Starts')
        localStorage.setItem('start', true);
    }
  }

}, 1);

const clickButton = (path) => {
  getElementByXpath(path)[0].click();
}

const setting = () => {
  const flag = false;
  if (JSON.parse(localStorage.earn))
    if (flag) {
      if (JSON.parse(localStorage.real)) clickButton(min);
    } else {
      if (JSON.parse(localStorage.real)) clickButton(max);
      if (JSON.parse(localStorage.real)) clickButton(conf);
      for (let i = 0; i < CON; i++)
        if (JSON.parse(localStorage.real)) clickButton(half);
    } else {
    if (JSON.parse(localStorage.real)) clickButton(double);
  }
}

const betting = () => {
  if (JSON.parse(localStorage.real)) clickButton(bet);
  setTimeout(() => { localStorage.setItem('trade', true) }, 4000);
}

const trading = async () => {
  setting();
  betting();
}

setTimeout(trading, 1000);