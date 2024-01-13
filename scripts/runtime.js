function addTestElement() {
    const testElement = document.createElement('div');
    testElement.textContent = 'This is a test element added by the extension!';
    testElement.style.backgroundColor = 'yellow';
    testElement.style.padding = '10px';
    testElement.style.position = 'fixed';
    testElement.style.top = '10px';
    testElement.style.left = '10px';
    document.body.appendChild(testElement);
  }
  
  // Add the test element when the page is loaded
  addTestElement();


console.log("Hello")