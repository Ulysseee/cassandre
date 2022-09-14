import { withIntersectionObserver } from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';
import { addClass } from '@studiometa/js-toolkit/utils';

export default class Work extends withIntersectionObserver(AppEvents, {
    rootMargin: '0px 0px -25% 0px',
}) {
    static config = {
        ...AppEvents.config,
        name: 'Work',
        refs: [...AppEvents.config.refs],
    };

    intersected([{ isIntersecting }]) {
        if (isIntersecting) {
            addClass(this.$el, 'is-visible');
        }
    }
}
