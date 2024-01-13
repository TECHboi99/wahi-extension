let activeTabId, lastUrl, lastTitle;

function getTabInfo(tabId) {
  chrome.tabs.get(tabId, function(tab) {
    if(lastUrl != tab.url || lastTitle != tab.title)
      console.log(lastUrl = tab.url, lastTitle = tab.title);
        // window.sessionStorage.setItem("activepage", "lastUrl")
  });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
  getTabInfo(activeTabId = activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(activeTabId == tabId) {
    getTabInfo(tabId);
  }
});

function getMainWebsite(url) {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
  }

chrome.webNavigation.onCompleted.addListener(({ tabId, frameId }) => {
  if (frameId !== 0) return;

  chrome.scripting.executeScript({
      target: { tabId },
      function: newPageLoad,
  })
})



chrome.runtime.onInstalled.addListener(async () => {
    let { passwords } = await chrome.storage.sync.get("passwords")

    if (!passwords) {

        chrome.storage.sync.set({ passwords: [] });
    }

})


const newPageLoad = async () => {
    console.log("Adding to page", document)

    let pwfields = document.querySelectorAll("input")

    console.log(pwfields)

    function getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
        return {
          x: rect.left + scrollLeft,
          y: rect.top + scrollTop
        };
      }
    
      function getMainWebsite(url) {
        try {
          const parsedUrl = new URL(url);
          return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
        } catch (error) {
          console.error('Invalid URL:', error.message);
          return null;
        }
      }

      function getDate() {
        const options = {
          hour: 'numeric',
          minute: 'numeric',
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        };
      
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const dateTimeString = formatter.format(new Date());
      
        return dateTimeString.replace(',', '|');
      }
    

    

    pwfields.forEach(async field => {

        if (field.type == "password") {

            console.log("Field up", field.value)
                    
            field.classList.add("pwm-act-pw-field")

            field.addEventListener("focus", async ()=>{


                let haspw = false

                let { passwords } = await chrome.storage.sync.get("passwords")

                passwords.forEach(p => {
                    if (getMainWebsite(p.url) == getMainWebsite(window.location.href)) {
                        haspw = true
                    }
                });

                let cords = getElementOffset(field)

                let elem

                if (haspw) {
                    elem = `<div class="ygdygs" style="width: 220px; height: auto; padding: 8px; box-sizing: border-box; position: fixed; left: ${cords.x+80}px; top: ${cords.y+50}px; border-radius: 5px; background-color: #212121; z-index:9999999999999">
    
                    <button class="pwme-fill" style="width: 100%; height: 37px; border-radius: 4px; margin-bottom: 4px; cursor: pointer; background-color: #302f2f;appearance: none; color: white; border-style: none;">Fill Password</button>
                    <button class="pwme-update" style="width: 100%; height: 37px; border-radius: 4px; margin-bottom: 4px; cursor: pointer; background-color: #302f2f;appearance: none; color: white; border-style: none;">Update Password</button>
                    <button onclick="this.parentNode.remove()" style="width: 100%; height: 37px; border-radius: 4px; margin-bottom: 2px; cursor: pointer; background-color: #e63232;appearance: none; color: white; border-style: none;">Close</button>
                </div>`
                } else {
                    elem = `<div class="ygdygs" style="width: 220px; height: auto; padding: 8px; box-sizing: border-box; position: fixed; left: ${cords.x+80}px; top: ${cords.y+50}px; border-radius: 5px; background-color: #212121;">
    
                    <button class="pwme-save" style="width: 100%; height: 37px; border-radius: 4px; margin-bottom: 4px; cursor: pointer; background-color: #302f2f;appearance: none; color: white; border-style: none;">Save this password</button>
                    <button onclick="this.parentNode.remove()" style="width: 100%; height: 37px; border-radius: 4px; margin-bottom: 2px; cursor: pointer; background-color: #e63232;appearance: none; color: white; border-style: none;">Close</button>
                </div>`
                }


                
                

                field.parentNode.innerHTML += elem


                setTimeout(() => {
                    
                    let SaveButton = document.querySelector(".pwme-save")

                    if (SaveButton) {
                        SaveButton.addEventListener("click",async ()=>{

                            SaveButton.parentNode.remove()
    
                            
                            console.log(passwords)
    
                            let url = window.location.href
                            let date = getDate()
                            let pw = document.querySelector(".pwm-act-pw-field").value 
    
                            let entry = {
                                "url": url,
                                "date": date,
                                "pw": pw
                            }
    
                            passwords.push(entry)
    
    
    
                            chrome.storage.sync.set({ passwords });
    
                            
    
                        })
                    } 


                    let FillButton = document.querySelector(".pwme-fill")

                    if (FillButton) {
                        FillButton.addEventListener("click",async ()=>{

                            FillButton.parentNode.remove()
    
                            let { passwords } = await chrome.storage.sync.get("passwords")

                            let i = 0
                            passwords.forEach(p => {
                                if (getMainWebsite(p.url) == getMainWebsite(window.location.href)) {
                                    document.querySelector(".pwm-act-pw-field").value = p.pw

                                    let entry = p
                                    p.date = getDate()
                                    passwords[i] = entry

                                    chrome.storage.sync.set({ passwords });

                                }
                                i++

                            });
                            
    
                            
    
                        })
                    }


                    let UpdateButton = document.querySelector(".pwme-update")

                    if (UpdateButton) {
                        UpdateButton.addEventListener("click",async ()=>{

                            UpdateButton.parentNode.remove()
    
                            let { passwords } = await chrome.storage.sync.get("passwords")

                            let i = 0
                            passwords.forEach(p => {
                                if (getMainWebsite(p.url) == getMainWebsite(window.location.href)) {
                                    

                                    let entry = p
                                    p.date = getDate()
                                    p.pw = document.querySelector(".pwm-act-pw-field").value
                                    passwords[i] = entry


                                    chrome.storage.sync.set({ passwords });

                                }
                                i++

                            });
                            
    
                            
    
                        })
                    }

                }, 500);
            })

            

        }
    });
    

  
}