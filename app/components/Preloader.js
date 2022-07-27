import { Base } from '@studiometa/js-toolkit';
import { addClass } from '@studiometa/js-toolkit/utils';
import { timeline } from 'motion';

export default class Preloader extends Base {
    static config = {
        name: 'Preloader',
    };

    async handleAppLoaded() {
        await this.animateOut();
        addClass(this.$el, 'is-hidden');
        return Promise.resolve();
    }

    animateOut() {
        return timeline([
            [this.$el, { scaleX: [1, 0] }, { duration: 1.3, easing: 'ease-in-out' }],
        ]).finished;
    }
}
