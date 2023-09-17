import AppEvents from '../containers/AppEvents';
import { withResponsiveOptions, withScrolledInView } from '@studiometa/js-toolkit';
import gsap from 'gsap';

export default class HorizontalTextImage extends withResponsiveOptions(withScrolledInView(AppEvents, {
    rootMargin: '100%',
})) {
    static config = {
        ...AppEvents.config,
        name: 'HorizontalTextImage',
        refs: [...AppEvents.config.refs, 'text', 'image'],
        options: {
            parallaxAmount: {
                type: Number,
                default: 100,
                responsive: true,
            },
            label: {
                type: String,
                responsive: true,
            },
        }
    }

    scrolledInView({ progress }) {
        gsap.set(this.$refs.image, {
            y: -this.$options.parallaxAmount * (progress.y - 1),
        });
    }
}
