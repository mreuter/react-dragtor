require('@babel/register');

module.exports = {
  src_folders: ['e2e'],
  output_folder: 'reports',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: '',
  globals_path: '',

  selenium: {
    start_process: true,
    server_path: '/usr/local/Cellar/selenium-server-standalone/3.13.0/libexec/selenium-server-standalone-3.13.0.jar',
    log_path: './logs',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver',
      'webdriver.gecko.driver': './node_modules/.bin/geckodriver',
      'webdriver.safari.driver': '/usr/bin/safaridriver',
    },
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost:7777',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      screenshots: {
        enabled: false,
        path: '',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        marionette: true,
      },
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
      },
    },

    safari: {
      desiredCapabilities: {
        browserName: 'safari',
      },
    },
  },
};
