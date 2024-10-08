import { Base, withIntersectionObserver } from "@studiometa/js-toolkit";
import SplitType from "split-type";
import gsap from "gsap";

import { ANIMATIONS } from "../constants/animations";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default class AboutTitle extends withIntersectionObserver(Base, {
  ...ANIMATIONS.intersectionObserver,
}) {
  static config = {
    name: "AboutTitle",
    refs: ["loop", "loopWord", "loopInner", "loopCarret"],
    options: {
      auto: {
        type: Boolean,
        default: true,
      },
      repeat: {
        type: Boolean,
        default: false,
      },
    },
  };

  loopingWords = null;

  splitText = null;
  animateInTriggered = false;
  onAnimateInStart = null;
  onAnimateInComplete = null;
  loopIndex = 0;

  DURATION = 0.5; // seconds

  stopLoop = false;

  mounted() {
    if (this.animateInTriggered && !this.$options.repeat) return;

    try {
      this.loopingWords = this.$el.getAttribute("data-loop").split(",");
    } catch (e) {
      console.error("Error parsing looping words", e);
      this.loopingWords = ["design"];
    }

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

  $editLoopingWords({ word: word = "design" } = {}) {
    this.$refs.loopInner.innerHTML = word;
  }

  split() {
    this.$el.style.fontKerning = "none";
    this.splitText = new SplitType(this.$el, {
      types: "words, chars",
      tagName: "span",
    });
  }

  animateIn() {
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
          if (this.onAnimateInComplete) this.onAnimateInComplete();

          this.$setupLoop();
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

  async $setupLoop() {
    await this.$onLoop();
  }

  async $onComplete() {
    if (this.stopLoop) return;
    this.loopIndex = (this.loopIndex + 1) % this.loopingWords.length;
    await this.$onLoop();
  }

  async $onLoop() {
    return gsap
      .timeline({
        onComplete: () => {
          this.$onComplete();
        },
      })
      .to(this.$refs.loopInner, {
        duration: this.DURATION,
        ease: `step(${this.loopingWords[this.loopIndex].length})`,
        onUpdate: function (nameTarget, nameString) {
          nameTarget.innerText = nameString.slice(
            0,
            Math.round(this.progress() * nameString.length)
          );
        },
        onUpdateParams: [
          this.$refs.loopInner,
          this.loopingWords[this.loopIndex],
        ],
      })
      .to(
        this.$refs.loopInner,
        {
          duration: this.DURATION,
          ease: `step(${this.loopingWords[this.loopIndex].length})`,
          onUpdate: function (nameTarget, nameString) {
            nameTarget.innerText = nameString.slice(
              0,
              Math.round((1 - this.progress()) * nameString.length)
            );
          },
          onUpdateParams: [
            this.$refs.loopInner,
            this.loopingWords[this.loopIndex],
          ],
        },
        ">+=0.5"
      );
  }

  destroyed() {
    this.revertSplit();
    this.stopLoop = true;
  }
}
