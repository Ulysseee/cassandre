import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Page from "../containers/Page";
import Footer from "../components/Footer";
import Paragraph from "../components/Paragraph";
import Title from "../components/Title";
import SVGReveal from "../components/SVGReveal";

import { useScroll } from "@studiometa/js-toolkit";

gsap.registerPlugin(ScrollTrigger);

const { add, remove, props } = useScroll();

export default class Projects extends Page {
  static config = {
    ...Page.config,
    name: "Projects",
    refs: [...Page.config.refs],
    components: {
      Footer,
      Title,
      SVGReveal,
    },
  };

  scribbleRevealed = false;

  passedHeader = false;

  onScroll({ y }) {
    if (!this.scribbleRevealed) return;

    if (y > this.sizes.height && !this.passedHeader) {
      this.passedHeader = true;

      this.scribble.hideShapes();
    }
    if (y < this.sizes.height && this.passedHeader) {
      this.passedHeader = false;

      this.scribble.drawStrokes({
        ease: "cubic.out",
        delay: 0.2,
      });
    }
  }

  mounted() {
    super.mounted();

    this.header = document.querySelector(".page-projects-header");
    this.sizes = this.header.getBoundingClientRect();

    [this.title] = this.$children.Title;
    [this.scribble] = this.$children.SVGReveal;
    this.title.onAnimateInComplete = this.onTitleAnimateInStart.bind(this);

    this.boot();
  }

  boot() {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.$el,
        // start: "top top", // when the top of the trigger hits the top of the viewport
        start: `${window.innerHeight}`,
        end: `bottom-=50% bottom`, // end after scrolling 500px beyond the start
        scrub: 1,
        // markers: true,
      },
    });
    tl.to(this.$el, { backgroundColor: "#ede9e3" });

    add(`${this.$id}--use-scroll`, this.onScroll.bind(this));
  }

  onTitleAnimateInStart() {
    this.scribble.drawStrokes({
      ease: "cubic.out",
      delay: 0.25,
    });
    this.scribbleRevealed = true;
  }

  destroyed() {
    super.mounted();
  }
}
