# Github PR Fetch

This is a simple Firefox extension that adds a `git fetch` command to
GitHub pull request pages, making it easy to fetch and check out pull
requests locally without some nonsense `gh` utility, just plain ol' git.

This idea was borrowed from the Gerrit Code Review tool. Gerrit users using
Github: rejoice!

# Installation

You can install this extension from the Firefox Browser Add-ons store:

[![Get the Add-on](get-the-addon-129x45px.8041c789.png)](https://addons.mozilla.org/en-US/firefox/addon/github-pr-fetch/)

# Screencast

https://github.com/mgalgs/github-pr-fetch/assets/152014/d76391eb-2c71-4cd6-a166-2b0ebc74d3bb

# Development

If you'd like to hack on the extension, you can install it temporarily in
your current Firefox session from source as follows:

1. Clone this repository: `git clone https://github.com/mgalgs/github-pr-fetch.git`

2. Open Firefox, and enter `about:debugging` in the URL bar.

3. Click "This Firefox" (in newer versions of Firefox) or "Load Temporary Add-on" (in older versions).

4. Open the `github-pr-fetch/extension` directory and select any file inside the directory.

The extension should now be temporarily installed, and you'll see it listed
in your add-ons. Make any changes you'd like and then click Reload.
