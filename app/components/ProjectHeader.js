import { withScrolledInView } from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';
import gsap from 'gsap';

export default class ProjectHeader extends withScrolledInView(AppEvents, {
    rootMargin: '100%',
}) {
    static config = {
        ...AppEvents.config,
        name: 'ProjectHeader',
        refs: [...AppEvents.config.refs, 'year', 'title', 'cover'],
        options: {
            parallaxAmount: {
                type: Number,
                default: 100,
            },
        }
    }

    scrolledInView({ current, start, end, }) {
    }
}
