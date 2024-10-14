import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Page from "../containers/Page";
import Footer from "../components/Footer";
import Paragraph from "../components/Paragraph";
import Title from "../components/Title";
import SVGReveal from "../components/SVGReveal";

gsap.registerPlugin(ScrollTrigger);

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

  mounted() {
    super.mounted();

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
  }

  onTitleAnimateInStart() {
    this.scribble.drawStrokes({
      ease: "cubic.out",
      delay: 0.5,
    });
  }

  destroyed() {
    super.mounted();
  }
}
