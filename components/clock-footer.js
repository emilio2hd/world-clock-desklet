const { GLib, St, GObject } = imports.gi;

const { _ } = require('./helper');

const FULL_WEEKDAY_FORMAT = '%A';
const TIME_ZONE_OFFSET_FORMAT = '%:::z';

module.exports = GObject.registerClass(
  class ClockFooter extends St.BoxLayout {
    /**
     * @param {object} params
     * @param {imports.gi.GLib.TimeZone} params.timezone
     */
    _init(params = {}) {
      super._init({ vertical: false, style_class: 'clock-footer' });

      this._timezone = params.timezone;
      this._footerLabel = new St.Label();
      this.add(this._footerLabel);

      this.update();
    }

    update() {
      const currentDayLocal = GLib.DateTime.new_now_local();
      const currentDayTz = GLib.DateTime.new_now(this._timezone);
      const timezoneOffset = currentDayTz.format(TIME_ZONE_OFFSET_FORMAT);

      const tzWeekday = currentDayTz.format(FULL_WEEKDAY_FORMAT);
      const localWeekday = currentDayLocal.format(FULL_WEEKDAY_FORMAT);

      const currentDay = [];
      if (tzWeekday === localWeekday) {
        currentDay.push(_('Today'));
      } else if (currentDayTz > currentDayLocal) {
        currentDay.push(_('Tomorrow'));
      }

      currentDay.push(`${timezoneOffset} ${_('HRS')}`);
      this._footerLabel.set_text(currentDay.join(', '));
    }
  },
);
