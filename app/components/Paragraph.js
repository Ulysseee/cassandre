import { Base, withIntersectionObserver } from "@studiometa/js-toolkit";
import gsap from "gsap";
import SplitType from "split-type";
import { ANIMATIONS } from "../constants/animations";
import { isTouchDevice } from "../utils/detector";

export default class Paragraph extends withIntersectionObserver(Base, {
  ...ANIMATIONS.intersectionObserver,
}) {
  static config = {
    name: "Paragraph",
    options: {
      auto: {
        type: Boolean,
        default: true,
      },
      delay: Number,
      opacity: Boolean,
      staggerLines: Boolean,
      column: Boolean,
    },
  };

  BREAKPOINT = 1024;

  splitText = null;
  wordsPerLine = null;
  animateInTriggered = false;

  mounted() {
    if (this.animateInTriggered) return;
    this.animateIn = this.animateIn.bind(this);
    this.setup();
  }

  setup() {
    if (
      this.$options.column &&
      !isTouchDevice() &&
      window.innerWidth > this.BREAKPOINT
    ) {
      this.splitColumn();
    } else {
      this.split();
    }
    gsap.set(this.splitText.words, {
      yPercent: 100,
      opacity: this.$options.opacity ? 0 : 1,
    });
  }

  intersected([{ isIntersecting }]) {
    if (isIntersecting && this.$options.auto && !this.animateInTriggered) {
      this.animateIn();
    }
  }

  splitColumn() {
    this.$el.style.fontKerning = "none";
    const split = new SplitType(this.$el, {
      types: "lines",
      tagName: "span",
    });
    this.$el.innerHTML = "";

    const firstColumn = document.createElement("div");
    firstColumn.classList.add("column");
    const secondColumn = document.createElement("div");
    secondColumn.classList.add("column");

    let firstRaw = "";
    let secondRaw = "";
    const linesTotal = split.lines.length;
    const mid = Math.round(split.lines.length / 2);

    for (let i = 0; i < linesTotal; i++) {
      const el = split.lines[i];

      if (i < mid) {
        firstRaw = firstRaw + el.innerHTML;
      } else {
        secondRaw = secondRaw + el.innerHTML;
      }
    }

    firstColumn.innerHTML = firstRaw;
    secondColumn.innerHTML = secondRaw;

    this.$el.appendChild(firstColumn);
    this.$el.appendChild(secondColumn);

    this.$el.style.display = "flex";

    const firtColumnSplit = new SplitType(firstColumn, {
      types: "lines, words",
      tagName: "span",
    });
    const secondColumnSplit = new SplitType(secondColumn, {
      types: "lines, words",
      tagName: "span",
    });

    this.splitText = {};
    this.splitText.words = Array.from(this.$el.querySelectorAll(".word"));
    this.wordsPerLine = [];
    for (let i = 0; i < firtColumnSplit.lines.length; i++) {
      const $ = firtColumnSplit.lines[i];
      this.wordsPerLine.push($.querySelectorAll(".word"));
    }
    for (let i = 0; i < secondColumnSplit.lines.length; i++) {
      const $ = secondColumnSplit.lines[i];
      this.wordsPerLine.push($.querySelectorAll(".word"));
    }
  }

  split() {
    this.$el.style.fontKerning = "none";
    this.splitText = new SplitType(this.$el, {
      types: "lines, words",
      tagName: "span",
    });
    this.wordsPerLine = this.splitText.lines.map((line) => [
      line.querySelectorAll(".word"),
    ]);
  }

  revertSplit() {
    this.$el.style.fontKerning = "";
    this.splitText.revert();
  }

  animateIn() {
    this.animateInTriggered = true;
    this.wordsPerLine.forEach((wordsLine, index) => {
      gsap.to(wordsLine, {
        yPercent: 0,
        opacity: 1,
        duration: 1.3,
        ease: "power3.out",
        delay:
          this.$options.delay + (this.$options.staggerLines ? index * 0.12 : 0),
      });
    });
  }

  animateOut() {
    this.wordsPerLine.forEach((wordsLine) => {
      gsap.to(wordsLine, {
        yPercent: -100,
        duration: 0.3,
      });
    });
  }
}
