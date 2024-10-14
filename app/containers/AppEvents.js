import { Base, getInstanceFromElement } from "@studiometa/js-toolkit";
import Cursor from "../components/Cursor";

export default class AppEvents extends Base {
  static config = {
    refs: ["cursorLink[]", "cursorSlider[]"],
    log: true,
  };

  cursor;

  mounted() {}

  onCursorLinkMouseenter(e) {
    const cursorElement = document.querySelector('[data-component="Cursor"]');
    this.cursor = getInstanceFromElement(cursorElement, Cursor);
    if (this.cursor && this.cursor.$isMounted) this.cursor.onEnterLink(e);
  }

  onCursorLinkMouseleave(e) {
    if (this.cursor && this.cursor.$isMounted) this.cursor.onLeaveLink(e);
  }

  onCursorSliderMouseenter(e) {
    const cursorElement = document.querySelector('[data-component="Cursor"]');
    this.cursor = getInstanceFromElement(cursorElement, Cursor);
    if (this.cursor && this.cursor.$isMounted) this.cursor.onEnterSlider(e);
  }

  onCursorSliderMouseleave(e) {
    if (this.cursor && this.cursor.$isMounted) this.cursor.onLeaveSlider(e);
  }
}
