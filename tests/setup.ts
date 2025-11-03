import chrome from "sinon-chrome";

// Setup chrome API mocks globally
(global as any).chrome = chrome;

// Reset chrome stubs before each test
beforeEach(() => {
  chrome.flush();
});

// Clean up after each test
afterEach(() => {
  chrome.reset();
});
