const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  env:{

  },
  responseTimeout: 60000,
  pageLoadTimeout: 90000,
  defaultCommandTimeout: 15000,
  reporter: "mocha-junit-reporter",
  videoUploadOnPasses: false,
  chromeWebSecurity: true,
  retries: 1,
  reporterOptions: {
    mochaFile: "target/test-reports/cypress/cypress-report-[hash].xml",
    toConsole: true
  },
  e2e: {
    baseUrl: "https://www.ayahealthcare.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
