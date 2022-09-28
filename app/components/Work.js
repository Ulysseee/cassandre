import { withIntersectionObserver, withScrolledInView } from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';
import SVGReveal from './SVGReveal';
import { addClass } from '@studiometa/js-toolkit/utils';
import Title from './Title';
import Paragraph from './Paragraph';

export default class Work extends withScrolledInView(withIntersectionObserver(AppEvents, {
    rootMargin: '0px 0px -25% 0px',
})) {
    static config = {
        ...AppEvents.config,
        name: 'Work',
        refs: [...AppEvents.config.refs, 'cover', 'scribble'],
        components: {
            Title,
            Paragraph,
            SVGReveal,
        },
    };

    isVisible = false;

    intersected ([{ isIntersecting }]) {
        if (isIntersecting) {
            if (this.isVisible) return;
            this.isVisible = true;
            addClass(this.$el, 'is-visible');
            for (const SVGReveal of this.$children.SVGReveal) {
                SVGReveal.drawStrokes();
            }
            for (const Title of this.$children.Title) {
                Title.animateIn();
            }
            for (const Paragraph of this.$children.Paragraph) {
                Paragraph.animateIn();
            }
        }
    }

    scrolledInView ({ progress }) {
        this.$refs.cover.style.transform = `translateY(${ (progress.y - 0.5) * -100 }px) rotate(${ (progress.y - 0.5) * 5 }deg)`;
        this.$refs.scribble.style.transform = `translateY(${ (progress.y - 0.5) * -100 }px)`;
    }
}
