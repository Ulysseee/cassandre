import { withScrolledInView } from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';
import gsap from 'gsap';
import { easeInExpo, getOffsetSizes } from '@studiometa/js-toolkit/utils';

export default class ProjectHeader extends withScrolledInView(AppEvents, {
    rootMargin: '100%',
}) {
    static config = {
        ...AppEvents.config,
        name: 'ProjectHeader',
        refs: [...AppEvents.config.refs, 'year', 'title'],
        options: {
            parallaxAmount: {
                type: Number,
                default: 100,
            },
        }
    }

    scrolledInView({ current, start, end, }) {
        const elBox = getOffsetSizes(this.$el);
        const titleBox = getOffsetSizes(this.$refs.title);
        const titleStart = start.y + Math.abs(titleBox.top - elBox.top);
        const titleEnd = end.y - Math.abs(elBox.bottom - titleBox.bottom);
        const progress = (current.y - titleStart) / (titleEnd - titleStart);
        const progressExpoIn = easeInExpo(progress);

        gsap.set(this.$refs.year, {
            opacity: 1 - progressExpoIn,
            y: -100 * progressExpoIn,
        });

        gsap.set(this.$refs.title, {
            y: -300 * progressExpoIn,
        });
    }
}
