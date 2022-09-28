import AppEvents from '../containers/AppEvents';
import gsap from 'gsap';
import { withIntersectionObserver } from '@studiometa/js-toolkit';
import { removeClass } from '@studiometa/js-toolkit/utils';

export default class WorkCard extends withIntersectionObserver(AppEvents, {
    rootMargin: '0px',
    threshold: [0, 0.3],
}) {
    static config = {
        ...AppEvents.config,
        name: 'WorkCard',
        refs: [...AppEvents.config.refs, 'name'],
        options: {
            transitionDelay: {
                type: Number,
                default: 0,
            },
        },
    };

    isVisible = false;
    nameTween = null;

    onMouseenter() {
        if (this.nameTween) this.nameTween.kill();
        this.nameTween = gsap.to(this.$refs.name, {
            translateY: -6,
            duration: 0.6,
            ease: 'power4.out',
        });
    }

    onMouseleave() {
        if (this.nameTween) this.nameTween.kill();
        this.nameTween = gsap.to(this.$refs.name, {
            translateY: 0,
            duration: 0.4,
            ease: 'power4.out',
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
