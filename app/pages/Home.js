import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Page from "../containers/Page";
import Work from "../components/Work";
import Footer from "../components/Footer";
import HomeHeader from "../components/HomeHeader";

gsap.registerPlugin(ScrollTrigger);

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

    this.boot();
  }

  boot() {
    // let tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: this.$el,
    //     // start: "top top", // when the top of the trigger hits the top of the viewport
    //     start: `${window.innerHeight}`,
    //     end: `bottom-=30% bottom`, // end after scrolling 500px beyond the start
    //     scrub: 1,
    //     // markers: true,
    //     // onEnter: () => {
    //     //   console.log("Enter");
    //     // },
    //     // onLeave: () => {
    //     //   console.log("Leave");
    //     // },
    //     // onEnterBack: () => {
    //     //   console.log("EnterBack");
    //     // },
    //   },
    // });
    // tl.to(this.$el, { backgroundColor: "#ede9e3" });
  }

  destroyed() {
    super.mounted();
  }
}
