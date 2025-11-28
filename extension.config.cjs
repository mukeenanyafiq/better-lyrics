/**
 * @type Configuration
 */
module.exports = {
  config: {
    devtool: "hidden-source-map",
  },
  dev: {
    browser: "chrome",
  },
  browser: {
    chrome: {
      preferences: { theme: "dark" },
      excludeBrowserFlags: [
        '--hide-scrollbars', // Allow scrollbars to be visible
        '--mute-audio', // Allow audio to play
      ],
      browserFlags: [
        "https://music.youtube.com/watch?v=D_3nlLlPMxA&list=RDAMVMEmq17wn71jA",
      ],
      profile: false
    },
    firefox: {
      preferences: { theme: "dark" },
      excludeBrowserFlags: [
        '--hide-scrollbars', // Allow scrollbars to be visible
        '--disable-component-extensions-with-background-pages' // Allow component extensions to load
      ],
      browserFlags: [
        "https://music.youtube.com/watch?v=Emq17wn71jA&list=RDAMVMxe9j9hPn6Bc",
      ],
      profile: false
    },
  },
  output: {
    publicPath: "chrome-extension://effdbpeggelllpfkjppbokhmmiinhlmg",
  },
};
