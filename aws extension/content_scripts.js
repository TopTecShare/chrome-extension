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

function addCss(cssCode) {
  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName("head")[0].appendChild(styleElement);
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

// window.addEventListener("autoBid", autoBid);

// window.dispatchEvent(new Event('autoBid'))
window.readyHandlers = [];
window.ready = function ready(handler) {
  window.readyHandlers.push(handler);
  handleState();
};

window.handleState = function handleState() {
  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
    while (window.readyHandlers.length > 0) {
      (window.readyHandlers.shift())();
    }
  }
};

document.onreadystatechange = window.handleState;

ready(function () {

  // bootstrap

  var element = document.createElement("link");
  element.setAttribute("rel", "stylesheet");
  element.setAttribute("type", "text/css");
  element.setAttribute(
    "href",
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
  );
  document.getElementsByTagName("head")[0].appendChild(element);

  const scriptOne = document.createElement("script");
  scriptOne.src = "https://code.jquery.com/jquery-3.2.1.slim.min.js";
  scriptOne.async = true;
  document.head.appendChild(scriptOne);

  const scriptTwo = document.createElement("script");
  scriptTwo.src =
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js";
  scriptTwo.async = true;
  document.head.appendChild(scriptTwo);

  const scriptThree = document.createElement("script");
  scriptThree.src =
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js";
  scriptThree.async = true;
  document.head.appendChild(scriptThree);

  addCss('a:active{text-decoration:none;}');
  addCss('a:hover{text-decoration:none;}');
  // -- here

  let elem = document.createElement('div');

  // -- URL fetch
  let asin = location.href.split('dp/')[location.href.split('dp/').length - 1];
  let URL = 'http://remora.cloud/api/plugin/book-temp?asin=' + asin.split('/')[0];
  let json;
  try {
    fetch(URL).then(e => e.json()).then(e => {
      json = e;
      let html = '<div class="container-fluid tool"> <div class="row"> <section class="col-sm-12 bg-primary text-white"> <table style="border-collapse: separate; border-spacing: 1em;"> <tbody> <tr class="book-data">';
      Object.keys(json).forEach(e => {
        html += '<td><span style="color:white; font-weight:bold;">' + e + '</span> <span style="color:white;"> : </span><span style="color:gold">' + json[e] + '</span><td>';
      });
      html += '</tr> </tbody> </table> </section> </div> </div>';
      elem.innerHTML = html;
      document.body.prepend(elem);
    });
  } finally {

  }

  getElementByXpath('//a').forEach(e => e.addEventListener('click', () => {
    setTimeout(async () => {
      let idx = 0;
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * ms) + ms));
      };
      while (!getElementByXpath('//*[@id="aod-container"]') && idx < 100) await sleep(100);
      if (idx == 100) return;
      const myfuc = async () => {
        await sleep(1000);
        let elems;

        let idx = 0;
        while (!(elems = getElementByXpath('//*[@id="aod-offer-soldBy"]/div/div/div[2]/a')) && idx++ < 20) { await sleep(500); }

        elems.forEach((elem) => {
          // console.log(elem.innerText);
          elem.addEventListener('mouseenter', () => {
            if (JSON.parse(localStorage.enter)) return;
            localStorage.setItem('enter', true);
            // console.log(elem.lastElementChild);
            if (!elem.lastElementChild) {
              let element = document.createElement('div');
              // -- URL fetch

              let URL = 'http://remora.cloud/api/plugin/sellers-temp?seller=' + elem.innerHTML.split('<div>')[0];
              let json;
              try {
                fetch(URL).then(e => e.json()).then(e => {
                  json = e;
                  let html = '<div style="background-color: white;width: 70%;color:black;border-radius: 6px;padding: 8px 0;position: relative;left: 0%;top: -744%;z-index: 99999;border:2px solid orange;box-shadow:0 0 0 1px;"><div class="container-fluid" style="z-index:999;"> <div class="row"> <section class="col-sm-12"> <table style="border-collapse: separate; border-spacing: 4px;"> <tbody> ';
                  Object.keys(json).forEach(e => {
                    html += '<tr class="seller-data" style="text-decoration-color: white !important;"><td style="font-weight:bold;">' + e + '</td> <td> : </td><td>' + json[e] + '</td><td></tr>';
                  });
                  html += '</tbody> </table> </section> </div> </div><span style="transform: rotate(-45deg);border:2px solid orange;border-left:none;border-bottom:none;z-index:1;width:1em;height:1em;position:absolute;top:-2%;left:30%;background:white;"></span><div>';
                  element.innerHTML = html;
                  getElementByXpath('//*[@id="aod-offer-soldBy"]/div/div/div[2]/a').forEach(elem => {
                    while (elem.lastElementChild) elem.removeChild(elem.lastElementChild);
                  });
                  elem.appendChild(element);
                  // elem.removeClass('hover');
                });
              } finally {

              }
            }
            else elem.lastElementChild.lastElementChild.style.display = '';
          });
          elem.addEventListener('mouseleave', async () => {
            localStorage.setItem('enter', false);
            // console.log(JSON.parse(localStorage.enter));
            // console.log(elem.lastElementChild);
            let idx = 0
            while (!JSON.parse(localStorage.enter) && idx++ < 10) {
              if (!!elem.lastElementChild) elem.lastElementChild.lastElementChild.style.display = 'none';
              await sleep(200);
            }
          });

        });
        await sleep(4000);
      }
      const myfunc = async () => {
        let k = 0;
        while (k++ < 10) {
          await myfuc();
          await sleep(500);
        }
      }
      myfuc();
      let id = 0;
      while (!getElementByXpath('//*[@id="aod-filter"]') && id++ < 20) { await sleep(500); }
      getElementByXpath('//*[@id="aod-filter"]')[0].addEventListener('click', myfunc);

      await sleep(4000);
      myfuc();


    }, 500)
  }, false))


});

