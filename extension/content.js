function insertGitFetchCommand(user, repo, prNum) {
    let monospaceFonts = "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace";

    // Create the parent div that contains the radio buttons and the fetch command.
    const parentDiv = document.createElement("div");
    parentDiv.style.marginBottom = "10px";

    const commandTypes = [
        { name: "fetch", command: `git fetch https://github.com/${user}/${repo}.git +refs/pull/${prNum}/head` },
        { name: "fetch+checkout", command: `git fetch https://github.com/${user}/${repo}.git +refs/pull/${prNum}/head && git checkout FETCH_HEAD` },
        { name: "fetch+merge", command: `git fetch https://github.com/${user}/${repo}.git +refs/pull/${prNum}/head && git merge FETCH_HEAD` },
        { name: "fetch+cherry-pick", command: `git fetch https://github.com/${user}/${repo}.git +refs/pull/${prNum}/head && git cherry-pick FETCH_HEAD` },
    ];

    const radiosDiv = document.createElement("div");
    radiosDiv.style.display = "inline-flex";
    radiosDiv.style.justifyContent = "space-between";
    radiosDiv.style.marginBottom = "10px";

    commandTypes.forEach(function(type, index) {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = "commandType" + index;
        radio.name = "commandType";
        radio.style.marginRight = "4px";
        radio.value = type.name;
        radio.checked = index === 0; // Select the first radio button by default.

        const labelText = document.createTextNode(type.name);
        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.style.marginRight = "10px";
        label.style.fontFamily = monospaceFonts;
        label.style.fontSize = "12px";
        label.appendChild(radio);
        label.appendChild(labelText);
        radiosDiv.appendChild(label);
    });

    const radiosRow = document.createElement("div");
    radiosRow.appendChild(radiosDiv);
    radiosRow.style.marginTop = "5px";

    const fetchDiv = document.createElement("div");
    fetchDiv.style.display = "inline-flex"; // Make the div only as wide as its content.
    fetchDiv.style.alignItems = "flex-start";
    fetchDiv.style.background = "#24292e"; // Dark grey
    fetchDiv.style.color = "#ffffff"; // White
    fetchDiv.style.padding = "10px";
    fetchDiv.style.border = "1px solid #e1e4e8";
    fetchDiv.style.borderRadius = "6px";
    fetchDiv.style.fontFamily = monospaceFonts;
    fetchDiv.style.fontSize = "12px";
    fetchDiv.style.cursor = "pointer";
    fetchDiv.title = "Click to copy";

    const preElement = document.createElement("pre");
    preElement.textContent = commandTypes[0].command;
    fetchDiv.appendChild(preElement);

    const copiedText = document.createElement("span");
    copiedText.style.visibility = "hidden";
    copiedText.style.fontFamily = monospaceFonts;
    copiedText.style.fontSize = "12px";
    copiedText.style.marginLeft = "7px";
    copiedText.style.color = "green";
    copiedText.textContent = "Copied!";
    fetchDiv.appendChild(copiedText);

    const fetchRow = document.createElement("div");
    fetchRow.appendChild(fetchDiv);

    parentDiv.appendChild(fetchRow);
    parentDiv.appendChild(radiosRow);

    radiosDiv.addEventListener("change", function() {
        const selectedType = document.querySelector('input[name="commandType"]:checked').value;
        const selectedCommand = commandTypes.find(function(type) {
            return type.name === selectedType;
        }).command;
        preElement.textContent = selectedCommand;
    });

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
