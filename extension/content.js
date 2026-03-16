const MONOSPACEFONTS = "ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace";
let selectedTransportIdx = 0;
let selectedCommandTypeIdx = 0;
let parentDiv = null;

function createSelect(configs, selectedIdx, onChange) {
    const select = document.createElement("select");
    select.style.fontFamily = MONOSPACEFONTS;
    select.style.fontSize = "11px";
    select.style.padding = "2px 4px";
    select.style.borderRadius = "4px";
    select.style.border = "1px solid #444";
    select.style.background = "#2d333b";
    select.style.color = "#ccc";
    select.style.cursor = "pointer";

    configs.forEach(function(config, index) {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = config.name;
        option.selected = index === selectedIdx;
        select.appendChild(option);
    });

    select.addEventListener("change", function() {
        onChange(parseInt(select.value));
    });

    return select;
}

// Find the PR header element to insert our widget before.
// We try several strategies to be resilient to GitHub DOM changes.
function findPrHeader() {
    // Legacy selector (worked until ~2025)
    const legacy = document.getElementById("partial-discussion-header");
    if (legacy) return legacy;

    // New React-based GitHub UI: insert before the HeaderContent container.
    const headerContent = document.querySelector('[class*="PageLayout-HeaderContent"]');
    if (headerContent) return headerContent;

    // Last resort: find an h1 containing "#NNNN"
    const allH1s = document.querySelectorAll("h1");
    for (const h1 of allH1s) {
        if (h1.textContent.match(/#\d+/)) {
            return h1;
        }
    }

    return null;
}

function insertGitFetchCommand(user, repo, prNum) {
    if (parentDiv)
        parentDiv.remove();

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

    // Single-row container
    parentDiv = document.createElement("div");
    parentDiv.style.display = "flex";
    parentDiv.style.alignItems = "center";
    parentDiv.style.gap = "8px";
    parentDiv.style.padding = "6px 10px";
    parentDiv.style.margin = "4px 0";
    parentDiv.style.background = "#24292e";
    parentDiv.style.border = "1px solid #e1e4e8";
    parentDiv.style.borderRadius = "6px";
    parentDiv.style.fontFamily = MONOSPACEFONTS;
    parentDiv.style.fontSize = "12px";
    parentDiv.style.color = "#ffffff";
    parentDiv.style.width = "fit-content";

    // Command text (clickable to copy)
    const commandSpan = document.createElement("span");
    commandSpan.textContent = commandTypes[selectedCommandTypeIdx].label;
    commandSpan.style.cursor = "pointer";
    commandSpan.style.whiteSpace = "nowrap";
    commandSpan.title = "Click to copy";

    // "Copied!" indicator
    const copiedText = document.createElement("span");
    copiedText.style.visibility = "hidden";
    copiedText.style.fontSize = "11px";
    copiedText.style.color = "green";
    copiedText.textContent = "Copied!";

    // Command type select
    const cmdSelect = createSelect(commandTypes, selectedCommandTypeIdx, (idx) => {
        selectedCommandTypeIdx = idx;
        insertGitFetchCommand(user, repo, prNum);
    });

    // Transport select
    const transportSelect = createSelect(networkTransports, selectedTransportIdx, (idx) => {
        selectedTransportIdx = idx;
        insertGitFetchCommand(user, repo, prNum);
    });

    parentDiv.appendChild(commandSpan);
    parentDiv.appendChild(copiedText);
    parentDiv.appendChild(cmdSelect);
    parentDiv.appendChild(transportSelect);

    commandSpan.addEventListener("click", function() {
        navigator.clipboard.writeText(commandSpan.textContent);
        copiedText.style.visibility = "visible";
        setTimeout(function() {
            copiedText.style.visibility = "hidden";
        }, 2000);
    });

    // Add the div to the page.
    const anchor = findPrHeader();
    if (!anchor) {
        console.warn("github-pr-fetch: could not find PR header element");
        return;
    }
    anchor.before(parentDiv);
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
