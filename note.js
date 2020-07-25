// Theme Stuff
function light_mode() {
  $("body").removeClass("dark-mode hotdog-mode").addClass("light-mode");
  $(".line").css("background-color", "black");
  $("#light-button").attr("checked", "");
}

function hotdog_mode() {
  $("body").removeClass("dark-mode light-mode").addClass("hotdog-mode");
  $(".line").css("background-color", "yellow");
  $("#hotdog-button").attr("checked", "");
}

function dark_mode() {
  $("body").removeClass("light-mode hotdog-mode").addClass("dark-mode");
  $(".line").css("background-color", "white");
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

// Syncs tabs when you have multiple new tabs open
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    if (!vis()) {
      $("#content").html(storageChange.newValue["text"]);
    }
  }
});

// Auto hyperlink links this hasn't been implemented yet
function isLink(link) {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (link.match(regex)) {
    return true;
  } else {
    return false;
  }
}

// Put back all the saved content
window.onload = function () {
  // Sets up document when it first loads
  chrome.storage.local.get("data", function (items) {
    if (!chrome.runtime.error) {
      // Make sure data is available if not set to default text
      if (items["data"]) {
        $("#content").html(items["data"]["text"]);
        // Theme logic
        var theme = items["data"]["theme"];
        if (theme == "light-mode") {
          light_mode();
        } else if (theme == "dark-mode") {
          dark_mode();
        } else if (theme == "hotdog-mode") {
          hotdog_mode();
        }
        // Shouldn't ever run but just in case
        else {
          light_mode();
        }
      } else {
        $("#content").html(
          "CTRL + B to <b>Bold</b><br>CTRL + I to <i>Italicize</i><br>You can add emojis &#128526<br>CTRL + E to <code>write some code</code><br>And everything saves and syncs between tabs!"
        );
        light_mode();
      }
    }
  });

  // Save text every 500 milliseconds
  setInterval(function () {
    saveData();
  }, 500);
};

// Logic to save your data
function saveData() {
  var content = $("#content").html();
  var data = {
    data: {
      text: content,
      theme: $("body").attr("class"),
    },
  };
  chrome.storage.local.set(data, function () {});
}
// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  $("#content").on("paste", function (e) {
    e.preventDefault();
    var text = e.originalEvent.clipboardData.getData("text");
    document.execCommand("insertText", false, text);
  });

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
});

document.addEventListener("keydown", event => {
  if (event.ctrlKey && event.which == 69 || event.metaKey && event.which == 69) {
    if (window.getSelection) {
      var selection = window.getSelection().getRangeAt(0);
      var selectedText = selection.extractContents();
      console.log(selection.startContainer.parentElement.outerHTML)
      if(selection.startContainer.parentElement.outerHTML == "<code></code>"){

      }
      var code = document.createElement("code");
      code.appendChild(selectedText);
      selection.insertNode(code);
    }
  } 
 
});
  // Windows for ctrl 


// Edge case where you input something before setInterval saves
window.onbeforeunload = function (event) {
  saveData();
};
