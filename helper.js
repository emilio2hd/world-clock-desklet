const { dgettext } = imports.gettext;
const { deskletManager } = imports.ui;

const UUID = 'worldclock@emilio2hd';

exports.UUID = UUID;
exports.DESKLET_ROOT = deskletManager.deskletMeta[UUID].path;

/**
 * Function to be used for translating.
 * It's important to use this function for translating because cinnamon-xlet-makepot will look
 * for this particular keyword.
 * @param {string} str - str is the msgid in the pot file
 * @returns {string}
 */
exports._ = (str) => dgettext(UUID, str);
