function injectTheScript() {

  if (button.innerText == "Auto bet") {

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   // query the active tab, which will be only one tab
    //   //and inject the script in it
    //   chrome.tabs.executeScript(tabs[0].id, { code: 'location.href = updateQueryStringParameter(location.href, "price", localStorage.getItem("price"));' });

    // });
    console.log('ok')
    setTimeout(() => {
      console.log('no');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        chrome.tabs.executeScript(tabs[0].id, { code: 'console.log("ok"); window.dispatchEvent(new Event("autoBid"));' });

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
let betTitle = localStorage.getItem('betTitle');
if (!betTitle) betTitle = "Auto bet"
var button = document.getElementById("clickactivity");
button.innerText = betTitle;
button.addEventListener('click', injectTheScript);
