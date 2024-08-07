document.addEventListener('DOMContentLoaded', function() {
    fetchSettings();
    document.getElementById('url').addEventListener('change', function() {
        const val = this.value;
        chrome.storage.local.set({'url': val}, function() {
            console.log('url value saved:', val);
        });
    });
    document.getElementById('port').addEventListener('change', function() {
        const portValue = this.value;
        chrome.storage.local.set({'port': portValue}, function() {
            console.log('Port value saved:', portValue);
        });
    });
    document.getElementById('api-key').addEventListener('change', function() {
        const apiKeyValue = this.value;
        chrome.storage.local.set({'api_key': apiKeyValue}, function() {
            console.log('API Key value saved:', apiKeyValue);
        });
    });

    document.getElementById('toggle').addEventListener('click', showCheckmark);
    document.getElementById('checkmark').addEventListener('click', toggleCheckmark);
});

function fetchSettings() {
    chrome.storage.local.get(['port', 'api_key', 'url'], function(result) {
        const url = result.url || 'http://localhost';
        document.getElementById('url').value = url;

        const port = result.port || '8080';
        document.getElementById('port').value = port;

        const apiKey = result.api_key || '';
        document.getElementById('api-key').value = apiKey;

    });
}

function setToggleState(is_on) {
    const toggle = document.getElementById('toggle');
    toggle.checked = is_on;
}

let timeoutId;

function submitSettings() {
    const url = document.getElementById('url').value || 'http://localhost';
    const port = document.getElementById('port').value || '8080';
    const rules = Array.from(document.querySelectorAll('.rule')).map(input => input.value);
    const is_on = document.getElementById('toggle').checked;
    const api_key = document.getElementById('api-key').value;

}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function toggleCheckmark(e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    var checkmark = document.getElementById("checkmark");
    var toggle = document.getElementById("toggle");
    if (toggle.checked) {
        checkmark.style.display = "none";
        toggle.checked = false;
    } else {
        checkmark.style.display = "inline";
        toggle.checked = true;
    }
}

function showCheckmark() {

    var checkmark = document.getElementById("checkmark");
    var toggle = document.getElementById("toggle");
    if (toggle.checked) {
        checkmark.style.display = "inline";
    } else {
        checkmark.style.display = "none";
    }
}
