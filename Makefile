UUID=worldclock@emilio2hd
DESKLET_DEST=$(HOME)/.local/share/cinnamon/desklets/$(UUID)

all: generate-pot install-po

generate-pot:
	echo "Generating POT file with translatable strings"
	rm -rf node_modules
	cinnamon-xlet-makepot ./ -o "po/$(UUID).pot"

install-po:
	echo "Compiles and installs translations files"
	cinnamon-xlet-makepot . --install

inspect:
	echo "Inspecting code for convention issues"
	npm run lint
	npm run prettier:check

dev-prepare:
	@echo "Installing dependencies and creating symbolic link to desklets folder at $(DESKLET_DEST)"
	npm install
	@if [ ! -e $(DESKLET_DEST) ]; then ln -s "$(CURDIR)" "$(DESKLET_DEST)"; fi;

uninstall:
	@echo "Removing desklets symbolic link $(DESKLET_DEST)"
	@if [ -e $(DESKLET_DEST) ]; then rm "$(DESKLET_DEST)"; fi;
