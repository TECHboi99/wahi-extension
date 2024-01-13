function getMainWebsite(url) {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
  }



document.addEventListener('DOMContentLoaded', function() {
    // Function to update the popup content with the current page URL
    function updatePopupContent() {
      chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
        const currentUrl = tabs[0].url;

        let { passwords } = await chrome.storage.sync.get("passwords"); 

        let list = document.querySelector(".passwords")
        list.innerHTML = ""

        

        passwords.forEach(element => {
            let main = getMainWebsite(element.url)
            let red = element.url
            let date = element.date.replace(",", " |").replace("|", ", ")
            let pw = element.pw

            let elem = `<div class="pw">
            <h4>${main}</h4>
            <p>Last Used ${date}</p>
            <button onclick="navigator.clipboard.writetext('${pw}')">
                <i class="uil uil-copy"></i>
            </button>
            <button onclick="window.open('${red}')">
                <i class="uil uil-external-link-alt"></i>                    </button>
                <button onclick="removeEntry('${pw}')">
                    <i class="uil uil-trash"></i>                </button>
        </div>`

            list.innerHTML += elem
        });

        if (currentUrl.includes("login") || currentUrl.includes("signin")) {
            document.querySelector(".active").innerHTML = `             
              Actions for <span class="activepage">${getMainWebsite(currentUrl)}</span>. 

              <br><br><button class="fp">Fill Password</button>
            `




        } else {
            document.querySelector(".active").innerHTML = `                No actions available for <span class="activepage">${getMainWebsite(currentUrl)}</span>. <br>Please open a login page on a website to get started.
            `
        }
      });
    }
  
    // Initial update when the popup is loaded
    updatePopupContent();
  
    // Set up a listener to update the popup content when the active tab changes
    chrome.tabs.onActivated.addListener(updatePopupContent);
  });