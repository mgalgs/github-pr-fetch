const MONOSPACEFONTS = "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace";
let selectedTransportIdx = 0;
let selectedCommandTypeIdx = 0;
let parentDiv = null;

function createRadios(configs, prefix, selectedIdx, onChange) {
    prefix = `github-pr-fetch__${prefix}`;
    const radiosDiv = document.createElement("div");
    radiosDiv.style.display = "inline-flex";
    radiosDiv.style.justifyContent = "space-between";

    configs.forEach(function(config, index) {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = prefix + index;
        radio.name = prefix;
        radio.style.marginRight = "4px";
        radio.value = config.name;
        radio.checked = index === selectedIdx;

        const labelText = document.createTextNode(config.name);
        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.style.marginRight = "10px";
        label.style.fontFamily = MONOSPACEFONTS;
        label.style.fontSize = "12px";
        label.appendChild(radio);
        label.appendChild(labelText);
        radiosDiv.appendChild(label);
    });

    radiosDiv.addEventListener("change", function() {
        const selectedName = document.querySelector(`input[name="${prefix}"]:checked`).value;
        const selectedIdx = configs.findIndex(function(config) {
            return config.name === selectedName;
        });
        const selectedConfig = configs[selectedIdx];
        onChange(selectedConfig, selectedIdx);
    });

    return radiosDiv;
}

// just to keep this crap out of our way
const domBuilders = {
    radiosLabel: () => {
        const div = document.createElement("div");
        div.style.fontFamily = MONOSPACEFONTS;
        div.style.display = "inline-block";
        div.style.fontSize = "smaller";
        div.style.marginRight = "5px";
        div.style.width = "100px";
        div.style.textAlign = "right";
        return div;
    },
    fetch: () => {
        const fetchDiv = document.createElement("div");
        fetchDiv.style.display = "inline-flex"; // Make the div only as wide as its content.
        fetchDiv.style.alignItems = "flex-start";
        fetchDiv.style.background = "#24292e"; // Dark grey
        fetchDiv.style.color = "#ffffff"; // White
        fetchDiv.style.padding = "10px";
        fetchDiv.style.border = "1px solid #e1e4e8";
        fetchDiv.style.borderRadius = "6px";
        fetchDiv.style.fontFamily = MONOSPACEFONTS;
        fetchDiv.style.fontSize = "12px";
        fetchDiv.style.cursor = "pointer";
        fetchDiv.title = "Click to copy";
        return fetchDiv;
    },
    copied: () => {
        const copiedText = document.createElement("span");
        copiedText.style.visibility = "hidden";
        copiedText.style.fontFamily = MONOSPACEFONTS;
        copiedText.style.fontSize = "12px";
        copiedText.style.marginLeft = "7px";
        copiedText.style.color = "green";
        copiedText.textContent = "Copied!";
        return copiedText;
    },
};

function insertGitFetchCommand(user, repo, prNum) {
    const preElement = document.createElement("pre");

    if (parentDiv)
        parentDiv.remove();

    // Create the parent div that contains the radio buttons and the fetch
    // command.
    parentDiv = document.createElement("div");
    parentDiv.style.marginBottom = "10px";

    const networkTransports = [
        { name: "ssh", label: "git@github.com:" },
        { name: "https", label: "https://github.com/" },
    ];

    const selectedTransport = networkTransports[selectedTransportIdx];
    const transportPrefix = selectedTransport.label;

    const commandTypes = [
        { name: "fetch", label: `git fetch ${transportPrefix}${user}/${repo}.git +refs/pull/${prNum}/head` },
        { name: "fetch+checkout", label: `git fetch ${transportPrefix}${user}/${repo}.git +refs/pull/${prNum}/head && git checkout FETCH_HEAD` },
        { name: "fetch+merge", label: `git fetch ${transportPrefix}${user}/${repo}.git +refs/pull/${prNum}/head && git merge FETCH_HEAD` },
        { name: "fetch+cherry-pick", label: `git fetch ${transportPrefix}${user}/${repo}.git +refs/pull/${prNum}/head && git cherry-pick FETCH_HEAD` },
    ];

    const commandTypesRadiosDiv = createRadios(
        commandTypes,
        "commandType",
        selectedCommandTypeIdx,
        (config, idx) => {
            selectedCommandTypeIdx = idx;
            insertGitFetchCommand(user, repo, prNum);
        }
    );

    const networkTransportsRadiosDiv = createRadios(
        networkTransports,
        "networkTransports",
        selectedTransportIdx,
        (config, idx) => {
            selectedTransportIdx = idx;
            insertGitFetchCommand(user, repo, prNum);
        }
    );

    const radiosRow1 = document.createElement("div");
    const radiosRow1Label = domBuilders.radiosLabel();
    radiosRow1Label.textContent = "command:";
    radiosRow1.appendChild(radiosRow1Label);
    radiosRow1.appendChild(commandTypesRadiosDiv);

    const radiosRow2 = document.createElement("div");
    const radiosRow2Label = domBuilders.radiosLabel();
    radiosRow2Label.textContent = "transport:";
    radiosRow2.appendChild(radiosRow2Label);
    radiosRow2.appendChild(networkTransportsRadiosDiv);

    const radiosRows = document.createElement("div");
    radiosRows.appendChild(radiosRow1);
    radiosRows.appendChild(radiosRow2);
    radiosRows.style.marginTop = "5px";

    const fetchDiv = domBuilders.fetch();

    preElement.textContent = commandTypes[selectedCommandTypeIdx].label;
    fetchDiv.appendChild(preElement);

    const copiedText = domBuilders.copied();
    fetchDiv.appendChild(copiedText);

    const fetchRow = document.createElement("div");
    fetchRow.appendChild(fetchDiv);

    parentDiv.appendChild(fetchRow);
    parentDiv.appendChild(radiosRows);

    fetchDiv.addEventListener("click", function() {
        const commandToCopy = preElement.textContent;
        navigator.clipboard.writeText(commandToCopy);
        copiedText.style.visibility = "visible";
        setTimeout(function() {
            copiedText.style.visibility = "hidden";
        }, 2000); // hide "Copied!" after 2 seconds
    });

    // Add the div to the page.
    const header = document.getElementById("partial-discussion-header");
    header.parentNode.insertBefore(parentDiv, header.nextSibling ? header.nextSibling.nextSibling : null);
}

function handleOnLoad() {
    // Parse the URL to get the user, repo, and PR number.
    const urlParts = window.location.pathname.split('/');
    const user = urlParts[1];
    const repo = urlParts[2];
    const prNum = urlParts[4];

    insertGitFetchCommand(user, repo, prNum);
}

if (document.readyState === "complete") {
    handleOnLoad();
} else {
    window.onload = handleOnLoad;
}
