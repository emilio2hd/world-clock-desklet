const { GLib, St, GObject } = imports.gi;

const { _ } = require('./helper');

const ClockHead = require('./components/clock-head');
const ClockCore = require('./components/clock-core');
const ClockFooter = require('./components/clock-footer');

module.exports = GObject.registerClass(
  class TimezoneClock extends St.BoxLayout {
    /**
     * @param {object} params
     * @param {string} params.tzIdentifier
     * @param {string} params.timeFormat
     */
    _init(params = {}) {
      const { tzIdentifier, timeFormat } = params;

      this._timezone = GLib.TimeZone.new(tzIdentifier);
      this._timeFormat = timeFormat;
      this._updatableComponents = [];

      super._init({ vertical: true, style_class: 'time-zone-clock' });

      // Current GLib version doesn't have new_identifier() method.
      // The only way to check if a timezone is valid is comparing with get_identifier() returned value
      // @TODO: Rework this condition, after updating to a newer GLib version.
      if (this._timezone.get_identifier() === tzIdentifier) {
        this.build();
      } else {
        this.buildError(tzIdentifier);
      }
    }

    buildError(tzIdentifier) {
      this.set_style_class_name('time-zone-clock-error');
      this.add(new St.Label({ text: _('Invalid Timezone'), style_class: 'error-label' }));
      this.add(new St.Label({ text: `"${tzIdentifier}"`, style_class: 'error-label' }));
    }

    build() {
      this.add(new ClockHead({ timezone: this._timezone }));

      this.addUpdatable(new ClockCore({ timezone: this._timezone, timeFormat: this._timeFormat }), {
        x_fill: false,
        x_align: St.Align.START,
      });

      this.addUpdatable(new ClockFooter({ timezone: this._timezone }));
    }

    addUpdatable(component, params = {}) {
      this._updatableComponents.push(component);
      this.add(component, params);
    }

    update() {
      this._updatableComponents.forEach((component) => component.update());
    }
  },
);
