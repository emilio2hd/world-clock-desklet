const { GLib, St, Clutter, GObject, Gio } = imports.gi;
const Tooltips = imports.ui.tooltips;

const { DESKLET_ROOT, _ } = require('./helper');

const ICON_SIZE = 20; // 20px
// cinnamon-xlet-makepot fails when using `${DESKLET_ROOT}/daylight-saving-time.png`
const DST_ICON_PATH = DESKLET_ROOT + '/daylight-saving-time.png';

module.exports = GObject.registerClass(
  class ClockHead extends St.BoxLayout {
    /**
     * @param {object} params
     * @param {imports.gi.GLib.TimeZone} params.timezone
     */
    _init(params = {}) {
      super._init({ vertical: false, style_class: 'clock-head' });

      this._timezone = params.timezone;

      this.update();
    }

    update() {
      this.destroy_all_children();

      if (GLib.DateTime.new_now(this._timezone).is_daylight_savings()) {
        this._addDstIcon();
      }

      this.add(new St.Label({ text: this._timezone.get_identifier(), style_class: 'header' }));
    }

    _addDstIcon() {
      this._iconContainer = new Clutter.Actor({
        name: 'dst-icon-container',
        reactive: true,
        width: ICON_SIZE,
        height: ICON_SIZE,
      });

      this._tooltip = new Tooltips.Tooltip(this._iconContainer, _('Daylight Saving Time'));
      this._iconContainer.connect('enter-event', () => this._tooltip.show());
      this._iconContainer.connect('leave-event', () => this._tooltip.hide());

      const imgActor = new St.Icon({
        gicon: Gio.icon_new_for_string(DST_ICON_PATH),
        icon_size: ICON_SIZE,
        icon_type: St.IconType.SYMBOLIC,
      });

      this._iconContainer.add_child(imgActor);
      this.add(this._iconContainer);
    }
  },
);
