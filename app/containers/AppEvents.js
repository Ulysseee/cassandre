import { Base, getInstanceFromElement } from "@studiometa/js-toolkit";
import Cursor from "../components/Cursor";

export default class AppEvents extends Base {
  static config = {
    refs: ["cursorLink[]", "cursorSlider[]"],
    log: true,
  };

  cursor;

  mounted() {
    // console.log("Mount", this.$id, this.$refs);
    const cursorElement = document.querySelector('[data-component="Cursor"]');
    this.cursor = getInstanceFromElement(cursorElement, Cursor);

    const links = document.querySelectorAll('[data-ref="cursorLink[]"]');
    links.forEach((link) => {
      link.addEventListener(
        "mouseenter",
        this.onCursorLinkMouseenter.bind(this)
      );
    });
    links.forEach((link) => {
      link.addEventListener(
        "mouseleave",
        this.onCursorLinkMouseleave.bind(this)
      );
    });
  }

  destroyed() {
    // console.log("destroyed", this.$id);
  }

  onCursorLinkMouseenter(e) {
    if (this.cursor && this.cursor.$isMounted) this.cursor.onEnterLink(e);
  }

  onCursorLinkMouseleave(e) {
    if (this.cursor && this.cursor.$isMounted) this.cursor.onLeaveLink(e);
  }

  //   onCursorSliderMouseenter(e) {
  //     if (this.cursor && this.cursor.$isMounted) this.cursor.onEnterSlider(e);
  //   }

  //   onCursorSliderMouseleave(e) {
  //     if (this.cursor && this.cursor.$isMounted) this.cursor.onLeaveSlider(e);
  //   }
}
