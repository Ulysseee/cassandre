import Page from "../containers/Page";
import Footer from "../components/Footer";
import Paragraph from "../components/Paragraph";
import Title from "../components/Title";
import SVGReveal from "../components/SVGReveal";

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
    [this.title] = this.$children.Title;
    [this.scribble] = this.$children.SVGReveal;
    this.title.onAnimateInComplete = this.onTitleAnimateInStart.bind(this);
  }

  onTitleAnimateInStart() {
    this.scribble.drawStrokes({
      ease: "cubic.out",
      delay: 0.5,
    });
  }
}
