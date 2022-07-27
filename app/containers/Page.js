import AppEvents from './AppEvents';
import { timeline } from 'motion';
import { removeClass } from '@studiometa/js-toolkit/utils';

export default class Page extends AppEvents {

    static config = {
        ...AppEvents.config,
        refs: [...AppEvents.config.refs],
    };

    async mounted() {
        super.mounted();
        if (this.animateIn) {
            this.cursor.isListening = true;
            await this.animateIn();
            this.cursor.enable();
        }
    }

    destroyed() {
        this.$log('Destroyed');
    }

    animateIn() {
        return timeline([
            [this.$el, { pointerEvents: 'none' }, { duration: 0 }],
            [this.$el, { opacity: [0, 1] }, { duration: 0.5, easing: 'ease-out' }],
            [this.$el, { pointerEvents: 'auto' }, { duration: 0 }],
        ]).finished;
    }

    animateOut() {
        return timeline([
            [this.$el, { pointerEvents: 'none' }, { duration: 0 }],
            [this.$el, { opacity: 0 }, { duration: 0.5, easing: 'ease-out' }],
            [this.$el, { pointerEvents: 'auto' }, { duration: 0 }],
        ]).finished;
    }

}
