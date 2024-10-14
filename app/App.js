import AppEvents from "./containers/AppEvents";
import gsap from "gsap";
import { getInstanceFromElement } from "@studiometa/js-toolkit";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Ui from "./pages/Ui";
import ScribbleLink from "./components/ScribbleLink";
import OverlayTransition from "./components/OverlayTransition";
import Parallax from "./components/Parallax";
import Title from "./components/Title";
import Project from "./pages/Project";
import Paragraph from "./components/Paragraph";
import Image from "./components/Image";
import { isTouchDevice } from "./utils/detector";
import CustomEase from "gsap/CustomEase";
import Divider from "./components/Divider";
import Navigation from "./components/Navigation";
import { Core } from "@unseenco/taxi";
import DefaultRenderer from "./renderers/DefaultRenderer";
import DefaultTransition from "./transitions/DefaultTransition";
import HomeTransition from "./transitions/HomeTransition";
import HomeRenderer from "./renderers/HomeRenderer";

gsap.registerPlugin(CustomEase);

class App extends AppEvents {
  static config = {
    name: "App",
    components: {
      // Shared Components
      Cursor: () => import("./components/Cursor"),

      // Global Components
      Navigation,
      Title,
      Paragraph,
      Image,
      Parallax,
      Divider,
      ...(!isTouchDevice() && { ScribbleLink }),

      // Pages
      Home,
      Projects,
      Project,
      About,
      Ui,
    },
    refs: [...AppEvents.config.refs],
  };

  navigationInstance = null;
  currentPageInstance = null;

  mounted() {
    super.mounted();

    this.setupTaxi();

    this.removeAppOverlay();

    this.setNavigationInstance();
    this.setCurrentPageInstance();

    this.setupListeners();

    this.onResize();
  }

  setupTaxi() {
    this.taxi = new Core({
      bypassCache: true,
      renderers: {
        default: DefaultRenderer,
        home: HomeRenderer,
      },
      transitions: {
        default: DefaultTransition,
        toHome: HomeTransition,
      },
    });
    this.taxi.addRoute(".*", "/", "toHome");
  }

  setupListeners() {
    window.addEventListener("resize", () => this.onResize());
    this.taxi.on("NAVIGATE_OUT", this.onTaxiNavigateOut.bind(this));
    this.taxi.on("NAVIGATE_IN", this.onTaxiNavigateIn.bind(this));
    this.taxi.on("NAVIGATE_END", this.onTaxiNavigateEnd.bind(this));
  }

  onResize() {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
    document.documentElement.style.setProperty(
      "--vw",
      `${window.innerWidth * 0.01}px`
    );
  }

  onTaxiNavigateOut() {
    if (this.cursor) this.cursor.removeStates();
  }

  onTaxiNavigateIn() {
    window.lenis.stop();
    this.updateAll();
  }

  onTaxiNavigateEnd() {
    window.lenis.start();
  }

  ticked({ time }) {
    window.lenis.raf(time);
  }

  updateAll() {
    this.$update();
    this.setCurrentPageInstance();
    this.setAppColor();
  }

  removeAppOverlay() {
    const appOverlay = document.getElementById("appOverlay");
    if (appOverlay) appOverlay.remove();
  }

  setNavigationInstance() {
    [this.navigationInstance] = this.$children.Navigation;
  }

  setCurrentPageInstance() {
    const pageElement = document.getElementById("page");
    const pageClass = pageElement.getAttribute("data-component");
    this.currentPageInstance = getInstanceFromElement(
      pageElement,
      App.config.components[pageClass]
    );
  }

  setAppColor() {
    const isDarkPage =
      this.currentPageInstance.$el.classList.contains("is-dark");
    const app = document.getElementById("app");
    const page = document.getElementById("page");
    const isAboutPage = page.classList.contains("page-about");
    app.classList.remove("is-dark", "is-light", "is-dark-beige");
    if (isAboutPage) app.classList.add("is-dark-beige");
    else app.classList.add(isDarkPage ? "is-dark" : "is-light");
  }
}

const [overlayTransition] = OverlayTransition.$factory("Preloader");
const [app] = App.$factory("App");

const bootApp = async () => {
  await overlayTransition.animateOut();
};

const appLoaded = new Promise((resolve) => {
  window.addEventListener("load", resolve);
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
});

Promise.all([appLoaded, overlayTransition.animateIn()]).then(bootApp);
Promise.all([appLoaded]).then(bootApp);
