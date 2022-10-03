import AppEvents from '../containers/AppEvents';
import { withScrolledInView } from '@studiometa/js-toolkit';
import gsap from 'gsap';

export default class HorizontalTextImage extends withScrolledInView(AppEvents, {
    rootMargin: '100%',
}) {
    static config = {
        ...AppEvents.config,
        name: 'HorizontalTextImage',
        refs: [...AppEvents.config.refs, 'image', 'text'],
        options: {
            parallaxAmount: {
                type: Number,
                default: 100,
            },
        }
    }

    scrolledInView({ progress }) {
        gsap.set(this.$refs.text, {
            y: this.$options.parallaxAmount * (progress.y - 0.5),
        });
    }
}
