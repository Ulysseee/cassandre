import Page from "../containers/Page";
import SVGReveal from "../components/SVGReveal";
import AboutTitle from "../components/AboutTitle";
import Parallax from "../components/Parallax";
import Footer from "../components/Footer";

export default class About extends Page {
  static config = {
    ...Page.config,
    name: "About",
    refs: [...Page.config.refs],
    components: {
      SVGReveal,
      AboutTitle,
      Parallax,
      Footer,
    },
  };

  title = null;
  scribble = null;

  mounted() {
    super.mounted();

    [this.title] = this.$children.AboutTitle;
    [this.scribble] = this.$children.SVGReveal;
    this.title.onAnimateInStart = this.onTitleAnimateInStart.bind(this);
  }

  onTitleAnimateInStart() {
    this.scribble.drawStrokes({
      ease: "cubic.out",
      delay: 1,
    });
  }

  destroyed() {
    super.mounted();
  }
}
