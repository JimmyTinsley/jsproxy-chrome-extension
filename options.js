function saveOptions(e) {
  chrome.storage.sync.set({
    jsproxy_sandbox_url: document.querySelector("#jsproxy_sandbox_url").value
  });
  var label = document.createElement("label");
  label.innerHTML = "You have set your jsproxy sandbox url!";
  document.body.appendChild(label);
  e.preventDefault();
}

function restoreOptions() {
  chrome.storage.sync.get(['jsproxy_sandbox_url'], function(item){
    if (item.jsproxy_sandbox_url !== "") {
      document.querySelector("#jsproxy_sandbox_url").value = item.jsproxy_sandbox_url;
    } else {
      document.querySelector("#jsproxy_sandbox_url").value = "https://jsproxy-demo.tk/";
      chrome.storage.sync.set({
        jsproxy_sandbox_url: document.querySelector("#jsproxy_sandbox_url").value
      });
    }
  }
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);