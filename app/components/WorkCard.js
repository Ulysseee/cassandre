import AppEvents from '../containers/AppEvents';
import { withIntersectionObserver } from '@studiometa/js-toolkit';
import { removeClass } from '@studiometa/js-toolkit/utils';
import { animate } from 'motion';

export default class WorkCard extends withIntersectionObserver(AppEvents, {
    rootMargin: '0px',
    threshold: [0, 0.3],
}) {
    static config = {
        ...AppEvents.config,
        name: 'WorkCard',
        refs: [...AppEvents.config.refs, 'nameInners[]'],
        options: {
            transitionDelay: {
                type: Number,
                default: 0,
            },
        },
    };

    isVisible = false;

    onMouseenter() {
        [...this.$refs.nameInners].forEach(nameInner => {
            animate(nameInner,
                { transform: 'translate3d(0, -100%, 0)' },
                { duration: 1.4, easing: [.12, .82, 0, .99] },
            );
        });
    }

    onMouseleave() {
        [...this.$refs.nameInners].forEach(nameInner => {
            animate(nameInner,
                { transform: 'translate3d(0, 0, 0)' },
                { duration: 0.8, easing: [.12, .82, 0, .99] },
            );
        });
    }

    intersected(entries) {
        const target = entries[0];

        if (!this.isVisible && target.intersectionRatio >= 0.3) {
            this.isVisible = true;
            const removeHiddenClassTimeout = setTimeout(() => {
                removeClass(this.$el, 'is-hidden');
                clearTimeout(removeHiddenClassTimeout);
            }, this.$options.transitionDelay * 1000);
        }
    }
}
