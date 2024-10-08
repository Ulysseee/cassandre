import { Base, withIntersectionObserver } from "@studiometa/js-toolkit";
import gsap from "gsap";
import SplitType from "split-type";
import { ANIMATIONS } from "../constants/animations";

export default class Title extends withIntersectionObserver(Base, {
  ...ANIMATIONS.intersectionObserver,
}) {
  static config = {
    name: "Title",
    options: {
      auto: {
        type: Boolean,
        default: true,
      },
      repeat: {
        type: Boolean,
        default: false,
      },
      revertSplit: {
        type: Boolean,
        default: true,
      },
      delay: Number,
    },
  };

  splitText = null;
  animateInTriggered = false;
  onAnimateInStart = null;
  onAnimateInComplete = null;

  mounted() {
    if (this.animateInTriggered && !this.$options.repeat) return;
    this.split();
    gsap.set(this.splitText.chars, {
      yPercent: 103,
    });
  }

  intersected([{ isIntersecting }]) {
    if (
      isIntersecting &&
      this.$options.auto &&
      (!this.animateInTriggered || this.$options.repeat)
    ) {
      this.animateIn();
    }
  }

  split() {
    this.$el.style.fontKerning = "none";
    this.splitText = new SplitType(this.$el, {
      types: "words, chars",
      tagName: "span",
    });
  }

  revertSplit() {
    this.$el.style.fontKerning = "";
    this.splitText.revert();
  }

  animateIn(revertSplit = this.$options.reverseSplit) {
    this.animateInTriggered = true;
    gsap.killTweensOf(this.splitText.chars);
    gsap.fromTo(
      this.splitText.chars,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        duration: (index) =>
          0.6 + (this.splitText.chars.length - index) * 0.018,
        ease: "power2.out",
        delay: this.$options.delay,
        stagger: 0.018,
        onStart: () => {
          if (this.onAnimateInStart) this.onAnimateInStart();
        },
        onComplete: () => {
          if (revertSplit) this.revertSplit();
          if (this.onAnimateInComplete) this.onAnimateInComplete();
        },
      }
    );
  }

  animateOut() {
    this.animateInTriggered = false;
    gsap.killTweensOf(this.splitText.chars);
    gsap.to(this.splitText.chars, {
      yPercent: -100,
      duration: 0.3,
    });
  }
}
