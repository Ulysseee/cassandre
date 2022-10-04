import { withIntersectionObserver, withScrolledInView } from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';
import SVGReveal from './SVGReveal';
import { addClass } from '@studiometa/js-toolkit/utils';
import Paragraph from './Paragraph';
import { triggerChildrenAnimateIn } from '../utils/triggerChildrenAnimateIn';
import Title from './Title';

export default class Work extends withScrolledInView(withIntersectionObserver(AppEvents, {
    rootMargin: '0px 0px -25% 0px',
}), {
    rootMargin: '100%',
}) {
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
        if (isIntersecting && !this.isVisible) {
            this.isVisible = true;
            addClass(this.$el, 'is-visible');
            for (const SVGReveal of this.$children.SVGReveal) {
                SVGReveal.drawStrokes();
            }
            triggerChildrenAnimateIn(this, 'Work', ['Paragraph', 'Title']);
        }
    }

    scrolledInView ({ progress }) {
        this.$refs.cover.style.transform = `rotate(${ (progress.y - 0.5) * 5 }deg)`;
        this.$refs.scribble.style.transform = `translateY(${ (progress.y - 0.5) * -100 }px)`;
    }
}
