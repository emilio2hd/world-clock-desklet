const { GLib, St, GObject } = imports.gi;

// https://docs.gtk.org/glib/method.DateTime.format.html
const TIME_FORMAT_24_HOURS = '%H:%M';
const TIME_FORMAT_12_HOURS = '%I:%M';
const AM_PM_FORMAT = '%p';

// from settings-schema.json->time-format
const TIME_FORMAT_OPT_12_HOURS = '12_hours';

module.exports = GObject.registerClass(
  class ClockCore extends St.BoxLayout {
    /**
     * @param {object} params
     * @param {string} params.timeFormat
     * @param {imports.gi.GLib.TimeZone} params.timezone
     */
    _init(params = {}) {
      this._timezone = params.timezone;
      this._timeFormat = params.timeFormat;
      this._updateClockFn = undefined;

      super._init({ vertical: false, style_class: 'clock-label' });

      if (this._timeFormat === TIME_FORMAT_OPT_12_HOURS) {
        this._build12HClock();
      } else {
        this._build24HClock();
      }

      this.update();
    }

    _build24HClock() {
      const clockLabel = new St.Label();

      this.add(clockLabel);

      this._updateClockFn = () => {
        const displayDate = GLib.DateTime.new_now(this._timezone);
        clockLabel.set_text(displayDate.format(TIME_FORMAT_24_HOURS));
      };
    }

    _build12HClock() {
      const clockLabel = new St.Label();
      const clockAmPm = new St.Label({ style_class: 'am-pm' });

      this.add(clockLabel);
      this.add(clockAmPm, { y_align: St.Align.START });

      this._updateClockFn = () => {
        const displayDate = GLib.DateTime.new_now(this._timezone);
        clockLabel.set_text(displayDate.format(TIME_FORMAT_12_HOURS));
        clockAmPm.set_text(displayDate.format(AM_PM_FORMAT));
      };
    }

    update() {
      this._updateClockFn();
    }
  },
);
