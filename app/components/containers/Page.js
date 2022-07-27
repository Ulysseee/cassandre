import AppEvents from './AppEvents';
import { getInstanceFromElement } from '@studiometa/js-toolkit';
import Cursor from '../Cursor';
import { animate } from 'motion';

export default class Page extends AppEvents {

    static config = {
        ...AppEvents.config,
        refs: [...AppEvents.config.refs],
    };

    mounted() {
        super.mounted();
        if (this.animateIn) return this.animateIn();
    }

    destroyed() {
        this.$log('Destroyed');
    }

    animateIn() {
        return animate(this.$el,{
            opacity: [0, 1],
        },{
            duration: 0.6,
            easing: 'ease-out',
        }).finished;
    }

    animateOut() {
        return animate(this.$el,{
            opacity: 0,
        },{
            duration: 0.6,
            easing: 'ease-out',
        }).finished;
    }

}
