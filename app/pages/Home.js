import Page from "../containers/Page";
import Work from "../components/Work";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader";

export default class Home extends Page {
  static config = {
    ...Page.config,
    name: "Home",
    refs: [...Page.config.refs],
    components: {
      HomeHeader,
      Work,
      Footer,
    },
  };

  mounted() {
    super.mounted();
  }

  destroyed() {
    super.mounted();
  }
}
