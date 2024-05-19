const { GLib, St, CinnamonDesktop } = imports.gi;

const { Desklet } = imports.ui.desklet;
const { DeskletSettings } = imports.ui.settings;
const { bindtextdomain } = imports.gettext;

const { UUID, DESKLET_ROOT } = require('./helper');
const { TimezoneClock } = require('./components/index');

// settings-schema.json components keys
const TIMEZONE_LIST_UI_ID = 'timezone-list';
const TIME_FORMAT_UI_ID = 'time-format';

const DESKTOP_CLOCK_NOTIFY_EVENT = 'notify::clock';
const UPDATE_CLOCKS_EVENT = 'wordclock:notify::clock';

const TZ_WIKIPEDIA_LINK = 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List';
const CLOCK_NOTIFY_DEFAULT_ID = 0;

class WorldClockDesklet extends Desklet {
  constructor(metadata, deskletId) {
    if (!DESKLET_ROOT.startsWith('/usr/share/')) {
      bindtextdomain(UUID, `${GLib.get_home_dir()}/.local/share/locale`);
    }

    super(metadata, deskletId);

    this.setHeader('World Clock');

    this._initSettings(deskletId);
    this._initUI();
  }

  _initSettings(deskletId) {
    this.settings = new DeskletSettings(this, this.metadata['uuid'], deskletId);
    if (!this.settings.getValue(TIMEZONE_LIST_UI_ID)?.length) {
      this.settings.setValue(TIMEZONE_LIST_UI_ID, [{ name: GLib.TimeZone.new_local().get_identifier() }]);
    }

    this.settings.bind(TIME_FORMAT_UI_ID, 'timeFormat', () => this._rebuildClocks());
    this.settings.connect(`changed::${TIMEZONE_LIST_UI_ID}`, (_setting_prov, _key, oldValue, newValue) =>
      this._onTimezoneSettingsChanged(oldValue, newValue),
    );
  }

  _initUI() {
    this.mainContainer = new St.BoxLayout({
      style_class: 'world-clock-container',
      vertical: true,
      x_expand: true,
      y_expand: true,
    });

    this.clock = new CinnamonDesktop.WallClock();
    this.clock_notify_id = 0;

    this._rebuildClocks();
    this.setContent(this.mainContainer);
  }

  _rebuildClocks() {
    this.mainContainer.destroy_all_children();
    this._getTzIdentifiers().forEach((tzIdentifier) => this._buildTimezoneClock(tzIdentifier));
  }

  /**
   * Build a clock widget for each time zone and connects it to the desktop clock event
   * @param {string} tzIdentifier - time zone identifier
   */
  _buildTimezoneClock(tzIdentifier) {
    const timezoneClock = new TimezoneClock({
      tzIdentifier,
      timeFormat: this.settings.getValue(TIME_FORMAT_UI_ID),
    });

    // Update the widget when the desktop clock is updated
    this.connect(UPDATE_CLOCKS_EVENT, () => timezoneClock.update());

    this.mainContainer.add(timezoneClock);
  }

  /**
   * Rebuild the clocks whenever the list of time zone idenfier changes
   * @param {object} oldValue
   * @param {object} newValue
   */
  _onTimezoneSettingsChanged(oldValue, newValue) {
    const oldTimezones = oldValue.map(({ name }) => name);
    const newTimezones = newValue.map(({ name }) => name);

    // For some reason the list component always send multiples events, despite the number of added itens
    if (JSON.stringify(oldTimezones) === JSON.stringify(newTimezones)) {
      return;
    }

    this._rebuildClocks();
  }

  _getTzIdentifiers() {
    return this.settings.getValue(TIMEZONE_LIST_UI_ID).map((value) => value.name);
  }

  on_go_to_wikipedia_button_clicked() {
    GLib.spawn_command_line_async(`xdg-open ${TZ_WIKIPEDIA_LINK}`);
  }

  on_desklet_added_to_desktop() {
    if (this.clock_notify_id === CLOCK_NOTIFY_DEFAULT_ID) {
      this.clock_notify_id = this.clock.connect(DESKTOP_CLOCK_NOTIFY_EVENT, () => this.emit(UPDATE_CLOCKS_EVENT));
    }
  }

  on_desklet_removed() {
    if (this.clock_notify_id > CLOCK_NOTIFY_DEFAULT_ID) {
      this.clock.disconnect(this.clock_notify_id);
      this.clock_notify_id = CLOCK_NOTIFY_DEFAULT_ID;
    }
  }
}

// eslint-disable-next-line no-unused-vars, jsdoc/require-jsdoc
function main(metadata, deskletId) {
  return new WorldClockDesklet(metadata, deskletId);
}
