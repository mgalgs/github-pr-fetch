# Github PR Fetch

This is a simple Firefox extension that adds a `git fetch` command to
GitHub pull request pages, making it easy to fetch and check out pull
requests locally without some nonsense `gh` utility, just plain ol' git.

# Installation

Get it on the Mozilla addons store:

https://addons.mozilla.org/en-US/firefox/addon/github-pr-fetch/

# Screencast

https://github.com/mgalgs/github-pr-fetch/assets/152014/8977b97d-ba03-491d-b264-32ee17ced7ef

# Development

If you'd like to hack on the extension, you can install it temporarily in
your current Firefox session from source as follows:

1. Clone this repository: `git clone https://github.com/mgalgs/github-pr-fetch.git`

2. Open Firefox, and enter `about:debugging` in the URL bar.

3. Click "This Firefox" (in newer versions of Firefox) or "Load Temporary Add-on" (in older versions).

4. Open the `github-pr-fetch/extension` directory and select any file inside the directory.

The extension should now be temporarily installed, and you'll see it listed
in your add-ons. Make any changes you'd like and then click Reload.
