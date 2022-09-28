import AppEvents from '../containers/AppEvents';
import { withScrolledInView } from '@studiometa/js-toolkit';

export default class Footer extends withScrolledInView(AppEvents) {
    static config = {
        ...AppEvents.config,
        name: 'Component',
        refs: [...AppEvents.config.refs, 'overlay', 'gradient', 'wrapper'],
    };

    scrolledInView({ current, start }) {
        const max = start.y + this.$el.offsetHeight;
        const reverseProgress = 1 - (current.y - start.y) / (max- start.y);

        const height = reverseProgress * 100;
        const translateY = reverseProgress * -100;

        this.$refs.overlay.style.height = `${height}px`;
        this.$refs.gradient.style.opacity = `${reverseProgress}`;
        this.$refs.wrapper.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }
}
