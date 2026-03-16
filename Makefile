WEB_EXT ?= $(HOME)/.nvm/versions/node/v18.15.0/bin/web-ext

build:
	cd extension && $(WEB_EXT) build --overwrite-dest
