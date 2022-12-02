import { Transition } from '@unseenco/taxi'
import { getInstanceFromElement } from '@studiometa/js-toolkit';
import OverlayTransition from '../components/OverlayTransition';
import Navigation from '../components/Navigation';

export default class DefaultTransition extends Transition {

    preloader = getInstanceFromElement(document.querySelector('#preloader'), OverlayTransition);
    navigation = getInstanceFromElement(document.querySelector('[data-component="Navigation"]'), Navigation);

    /**
     * Handle the transition leaving the previous page.
     * @param { { from: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
     */
    onLeave({ from, trigger, done }) {
        this.preloader.animatePageTransitionIn({ onComplete: () => {
            this.navigation.setAnim();
            done();
        } });
    }

    /**
     * Handle the transition entering the next page.
     * @param { { to: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
     */
    onEnter({ to, trigger, done }) {
        this.preloader.animatePageTransitionOut({ onComplete: () => {
            this.navigation.animateIn();
            window.lenis.scrollTo(1);
            done();
        } });
    }
}
