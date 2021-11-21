function injectTheScript() {

  if (button.innerText == "Auto bet") {
    let str;
    if (document.getElementById('cond1').checked) {
      str = 'localStorage.setItem("check", true);'
    } else {
      str = 'localStorage.setItem("check", false);'
    }
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   // query the active tab, which will be only one tab
    //   //and inject the script in it
    //   chrome.tabs.executeScript(tabs[0].id, { code: 'location.href = updateQueryStringParameter(location.href, "price", localStorage.getItem("price"));' });

    // });
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        chrome.tabs.executeScript(tabs[0].id, { code: 'window.dispatchEvent(new Event("autoBid"));' + str });

      });
      button.innerText = "Stop bet";
    }, 10);

    localStorage.setItem('betTitle', "Stop bet");
    // stop = false;
  }
  else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // query the active tab, which will be only one tab
      //and inject the script in it
      //chrome.tabs.executeScript(tabs[0].id, { code: 'localStorage.setItem("stop", JSON.stringify(true));' });
      chrome.tabs.executeScript(tabs[0].id, { code: 'localStorage.setItem("stop", true);' });
    });
    localStorage.setItem('betTitle', "Auto bet");
    button.innerText = "Auto bet";
    // stop = true;
  }
}

// var stop = true;
let check = localStorage.getItem('check');

let betTitle = localStorage.getItem('betTitle');
if (!betTitle) betTitle = "Auto bet"
var button = document.getElementById("clickactivity");
button.innerText = betTitle;
var checkbox = document.getElementById('cond1');
checkbox.addEventListener('click', () => {
  localStorage.setItem("check", checkbox.checked);
});
var label = document.getElementById('label');
label.addEventListener('click', () => {
  checkbox.click();
});
if (check) {
  if (JSON.parse(check)) checkbox.click();
} else localStorage.setItem("check", checkbox.checked);
button.addEventListener('click', injectTheScript);