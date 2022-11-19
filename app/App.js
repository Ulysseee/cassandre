import AppEvents from './containers/AppEvents';
import gsap from 'gsap';
import { getInstanceFromElement } from '@studiometa/js-toolkit';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Ui from './pages/Ui';
import ScribbleLink from './components/ScribbleLink';
import { getInternalLinks, preloadImages } from './utils/dom';
import Preloader from './components/Preloader';
import Parallax from './components/Parallax';
import Lenis from '@studio-freight/lenis';
import Title from './components/Title';
import Project from './pages/Project';
import Paragraph from './components/Paragraph';
import Image from './components/Image';

class App extends AppEvents {
    static config = {
        name: 'App',
        components: {
            // Shared Components
            Cursor,

            // Global Components
            Title,
            Paragraph,
            Image,
            Parallax,
            ScribbleLink,

            // Pages
            Home,
            Projects,
            Project,
            About,
            Ui,
        },
        refs: [...AppEvents.config.refs, 'pageContainer'],
    };

    currentPageInstance = null;
    DOMParser = new DOMParser();
    internalLinks = [];
    appColor = null;

    mounted () {
        super.mounted();

        this.removeAppOverlay();

        this.updateCurrentPageInstance();

        this.setupListeners();
        this.setupInternalLinks();

        this.createLenis().stop();

        this.onResize();
    }

    removeAppOverlay () {
        const appOverlay = document.getElementById('appOverlay');
        if (appOverlay) appOverlay.remove();
    }

    ticked ({ time }) {
        window.lenis.raf(time);
    }

    showCurrentPage () {
        window.lenis.start();
        this.currentPageInstance.animateIn();
    }

    setupListeners () {
        window.addEventListener('popstate', () => this.onUrlChange({
            url: window.location.pathname,
            push: false,
        }));
        window.addEventListener('resize', () => this.onResize());
    }

    setupInternalLinks () {
        this.internalLinks = getInternalLinks();
        this.addInternalLinkListeners();
    }

    onResize () {
        document.documentElement.style.setProperty('--vh', `${ window.innerHeight * 0.01 }px`);
        document.documentElement.style.setProperty('--vw', `${ window.innerWidth * 0.01 }px`);
    }

    async onUrlChange ({ url, push = true, from = undefined, to = undefined }) {
        const isProjectTransition = from === 'project' && to === 'project';

        if (!isProjectTransition) {
            await preloader.animatePageTransitionIn();
            window.lenis.destroy();
        }

        if (this.cursor) this.cursor.disable();

        const request = await window.fetch(url);

        if (request.status !== 200) {
            console.error('Handle request error.');
            return;
        }

        if (push) window.history.pushState({}, '', url);

        let pageDocument = await request.text();
        pageDocument = this.DOMParser.parseFromString(pageDocument, 'text/html');

        this.currentPageInstance.$destroy();
        this.replacePage(pageDocument, {
            hideFirst: isProjectTransition,
            noIntersect: true,
        });
        this.$update();
        this.updateCurrentPageInstance();

        this.updateAppColor();
        this.setupInternalLinks();

        this.createLenis();

        await Promise.all([
            new Promise(resolve => {
                setTimeout(resolve, 200);
            }),
            ...preloadImages(),
        ]);

        if (isProjectTransition) {
            this.showCurrentPage();
        } else {
            preloader.animatePageTransitionOut();
            this.showCurrentPage();
        }
    }

    replacePage (pageDocument, { hideFirst = false, noIntersect = false }) {
        const pageElement = pageDocument.getElementById('page');
        if (hideFirst) gsap.set(pageElement, { autoAlpha: 0 });
        if (noIntersect) gsap.set(pageElement, { display: 'none' });
        this.$refs.pageContainer.replaceChildren(pageElement);
    }

    addInternalLinkListeners () {
        for (const internalLink of this.internalLinks) {
            internalLink.onclick = e => {
                e.preventDefault();
                if (internalLink.href === window.location.href) return;
                this.onUrlChange({
                    url: internalLink.href,
                    from: internalLink.getAttribute('data-from'),
                    to: internalLink.getAttribute('data-to'),
                });
            };
        }
    }

    createLenis () {
        window.scrollTo(0, 0);
        if (window.lenis) {
            window.lenis.scrollTo(0);
            window.lenis.destroy();
        }
        return window.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });
    }

    updateCurrentPageInstance () {
        const pageElement = document.getElementById('page');
        const pageClass = pageElement.getAttribute('data-component');
        this.currentPageInstance = getInstanceFromElement(pageElement, App.config.components[pageClass]);
    }

    updateAppColor () {
        const isDarkPage = this.currentPageInstance.$el.classList.contains('is-dark');
        const app = document.getElementById('app');
        app.classList.remove('is-dark', 'is-light');
        app.classList.add(isDarkPage ? 'is-dark' : 'is-light');
    }
}

const pageElement = document.getElementById('page-container');
gsap.set(pageElement, { display: 'none' });

const [preloader] = Preloader.$factory('Preloader');
const [app] = App.$factory('App');

const bootApp = async () => {
    await preloader.animateOut();
    app.showCurrentPage();
};

const appLoaded = new Promise((resolve) => {
    window.addEventListener('load', resolve);
});

Promise.all([appLoaded, preloader.animateIn(), ...preloadImages()]).then(bootApp);
