var quill = ""
// Theme Stuff
function light_mode() {
  $("body").attr("class", "light-mode")
  $("#light-button").attr("checked", "");
}

function hotdog_mode() {
  $("body").attr("class", "hotdog-mode")
  $("#hotdog-button").attr("checked", "");
}

function darkdog_mode() {
  $("body").attr("class", "darkdog-mode");
  $("#darkdog-button").attr("checked", "");
}

function dark_mode() {
  $("body").attr("class", "dark-mode")
  $("#dark-button").attr("checked", "");
}

// Settings Animation
function toggleMenu() {
  $(".settings").toggleClass("change");
  $(".mode-options").slideToggle("fast");
}

// Checks to see if you're on the tab
var vis = (function () {
  var stateKey,
    eventKey,
    keys = {
      hidden: "visibilitychange",
      webkitHidden: "webkitvisibilitychange",
      mozHidden: "mozvisibilitychange",
      msHidden: "msvisibilitychange",
    };
  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey];
      break;
    }
  }
  return function (c) {
    if (c) document.addEventListener(eventKey, c);
    return !document[stateKey];
  };
})();

// Quilljs stuff 
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', { 'header': 1 }, { 'list': 'bullet' }],        // toggled buttons
];

var options = {
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: 'Start writing...',
  theme: 'bubble'
};

// Put back all the saved content
window.onload = function () {
  // Sets up document when it first loads
  quill = new Quill('#editor', options);
  setData();

  // Save text every 500 milliseconds and allows for multiple tabs to be synced up
  setInterval(function () {
    if (!vis()) {
      console.log("not")
      setData();
    }
    else {
      saveData();
    }
  }, 500);
};

function setData() {
  chrome.storage.local.get(['data'], function (result) {
    if (!chrome.runtime.error) {
      if (result.data) {
        quill.setContents(result.data.content);
        // Theme logic
        var theme = result.data.theme;
        if (theme == "light-mode") {
          light_mode();
        } else if (theme == "dark-mode") {
          dark_mode();
        } else if (theme == "hotdog-mode") {
          hotdog_mode();
        } else if (theme == "darkdog-mode") {
          darkdog_mode();
        } else {
          light_mode();
        }
      }
    }
  });
}

// Logic to save your data
function saveData() {
  var content = quill.getContents();
  var theme = $("body").attr("class");
  var data = {
    theme: theme,
    content: content
  }
  chrome.storage.local.set({ data: data }, function () { });
}
// Add event listeners
document.addEventListener("DOMContentLoaded", function () {

  $(".settings-icon").click(function () {
    toggleMenu();
  });

  $("#light-button").click(function () {
    light_mode();
  });

  $("#dark-button").click(function () {
    dark_mode();
  });

  $("#hotdog-button").click(function () {
    hotdog_mode();
  });

  $("#darkdog-button").click(function () {
    darkdog_mode();
  });
});

// Edge case where you input something before setInterval saves
window.onbeforeunload = function (event) {
  saveData();
};
