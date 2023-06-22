import AppEvents from '../containers/AppEvents';
import gsap from 'gsap';
import { getInstanceFromElement } from '@studiometa/js-toolkit';
import Title from './Title';

export default class ContactMe extends AppEvents {
    static config = {
        ...AppEvents.config,
        name: 'ContactMe',
        refs: [...AppEvents.config.refs, 'content', 'button', 'mail', 'socialLinks[]', 'closeButton', 'closeButtonBars[]'],
        options: {
            isOpen: {
                type: Boolean,
                default: false,
            },
        },
    };

    targetClipPath = null;
    title = null;
    isFirstOpen = true;

    mounted () {
        super.mounted();
        this.title = getInstanceFromElement(this.$refs.mail, Title);
        this.calculateTargetClipPath();
        gsap.set(this.$refs.content, {
            clipPath: this.targetClipPath,
        });
    }

    onSocialLinksMouseenter(_, index) {
        const target = this.$refs.socialLinks[index];
        const targetBar = target.querySelector('.component-contactMe-socialLinkBar');
        gsap.to(targetBar, {
            scaleX: 1,
            ease: 'expo.out',
            onStart: () => {
                gsap.set(targetBar, { transformOrigin: 'left' });
            },
        });
    }

    onSocialLinksMouseleave(_, index) {
        const target = this.$refs.socialLinks[index];
        const targetBar = target.querySelector('.component-contactMe-socialLinkBar');
        gsap.to(targetBar, {
            scaleX: 0,
            ease: 'expo.out',
            onStart: () => {
                gsap.set(targetBar, { transformOrigin: 'right' });
            },
        });
    }

    onContentClick () {
        this.toggleOpen();
    }

    onButtonClick () {
        this.toggleOpen();
    }

    toggleOpen () {
        this.$options.isOpen = !this.$options.isOpen;
        this.calculateTargetClipPath(this.isFirstOpen);
        if (this.$options.isOpen) this.open();
        else this.close();
        this.isFirstOpen = false;
    }

    calculateTargetClipPath (setDefault = false) {
        const buttonBox = this.$refs.button.getBoundingClientRect();
        const clipPathPosition = {
            x: buttonBox.left + buttonBox.width / 2,
            y: buttonBox.top + buttonBox.height / 2,
        };
        const clipPathRadius = Math.hypot(clipPathPosition.x, clipPathPosition.y);
        this.targetClipPath = this.$options.isOpen ? `circle(${ clipPathRadius }px at ${ clipPathPosition.x }px ${ clipPathPosition.y }px)` : `circle(0px at ${ clipPathPosition.x }px ${ clipPathPosition.y }px)`;
        if (setDefault) {
            gsap.set(this.$refs.content, {
                clipPath: `circle(0px at ${ clipPathPosition.x }px ${ clipPathPosition.y }px)`,
            })
        }
    }

    open () {
        gsap.killTweensOf([this.$refs.content, this.$refs.button, this.$refs.socialLinks]);
        gsap.timeline()
            .to(this.$refs.content, {
                clipPath: this.targetClipPath,
                duration: 1,
                ease: 'expo.out',
            }, 0)
            .fromTo(this.$refs.button, {
                opacity: 1,
            }, {
                opacity: 0,
                scale: 0,
                duration: 0.1,
            }, 0.05)
            .add(() => this.title.animateIn(false), 0)
            .fromTo(this.$refs.socialLinks, {
                yPercent: 100,
            },{
                yPercent: 0,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.07,
            }, 0.3)
            .from(this.$refs.closeButton, {
                opacity: 0,
                duration: 0.2,
            }, 0.3)
            .from(this.$refs.closeButtonBars, {
                scaleX: 0,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.14,
            }, 0.4)
        ;
    }

    close () {
        gsap.killTweensOf([this.$refs.content, this.$refs.button, this.$refs.socialLinks]);
        gsap.timeline()
            .to(this.$refs.content, {
                clipPath: this.targetClipPath,
                duration: 0.8,
                ease: 'power4.out',
            }, 0)
            .fromTo(this.$refs.button, {
                scale: 3,
            }, {
                opacity: 1,
                scale: 1,
                ease: 'elastic.out(1, 0.4)',
                duration: 1.1,
            }, '=-0.52')
            .add(() => this.title.animateOut(), 0)
            .to(this.$refs.socialLinks, {
                yPercent: -100,
                duration: 0.6,
                ease: 'expo.out',
            }, '0')
        ;
    }
}
