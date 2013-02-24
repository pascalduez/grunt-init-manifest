
"use strict";

// Nodejs libs.
var path = require("path");

// Basic template description.
exports.description = "Create a set of basic WebApp manifest files.";

// Template-specific notes to be displayed before question prompts.
exports.notes = "";

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = ["manifest.webapp", "package.webapp", "manifest.appcache"];

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    {
      name: "app_root",
      message: "WebApp package and root directory.",
      default: function(value, data, done) {
        var name = path.basename(process.cwd());
        name = name.replace(/[^\w\-\.]/g, "");
        done(null, name);
      },
      validator: /^[\w\-\.]+$/,
      warning: "Must be only letters, numbers, dashes, dots or underscores.",
      sanitize: function(value, data, done) {
        done("/" + value);
      }
    },
    {
      name: "app_name",
      message: "WebApp name.",
      default: function(value, data, done) {
        var title = data.app_root || "";
        title = title.replace(/[\W_]+/g, " ");
        title = title.replace(/\w+/g, function(word) {
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        data.title = title;
        data.title_default = "A human-readable name for the app: " + title;
        done(null, data.title_default);
      },
      validator: /^.{1,128}$/,
      warning: "Maximum length is 128 characters.",
      sanitize: function(value, data, done) {
        done( value === data.title_default ? data.title : value );
      }
    },
    {
      name: "description",
      message: "WebApp description.",
      default: "A human-readable description of the app.",
      validator: /^.{1,1024}$/,
      warning: "Maximum length is 1024 characters."
    },
    init.prompt("version", "0.1.0"),
    init.prompt("repository"),
    init.prompt("homepage"),
    init.prompt("author_name"),
    init.prompt("author_url")
  ],
  function(err, props) {
    // Files to copy (and process).
    var files = init.filesToCopy(props);
    // Actually copy (and process) files.
    init.copyAndProcess(files, props);
    // All done!
    done();
  });

};
