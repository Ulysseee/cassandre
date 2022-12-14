import AppEvents from '../containers/AppEvents';
import gsap from 'gsap';
import { clamp, damp } from '@studiometa/js-toolkit/utils';
import { withDrag, withFreezedOptions, withIntersectionObserver } from '@studiometa/js-toolkit';
import { isTouchDevice } from '../utils/detector';
import { imagesRendererObserver } from '../utils/dom';
var imagesLoaded = require('imagesloaded');

export default class Slider extends withIntersectionObserver(withDrag(withFreezedOptions(AppEvents), {
    target: instance => instance.$refs.wrapper,
})) {

    static config = {
        ...AppEvents.config,
        name: 'Slider',
        refs: [...AppEvents.config.refs, 'wrapper', 'slides[]', 'images[]'],
        options: {
            infinite: {
                type: Boolean,
                default: false,
            },
            centered: {
                type: Boolean,
                default: true,
            },
            speed: {
                type: Number,
                default: 0.08,
            },
            lerp: {
                type: Number,
                default: 0.04,
            },
            scaleOnPress: {
                type: Number,
                default: 0.97,
            },
        },
    };

    state = {
        isEnabled: true,
        isPressed: false,
        forward: null,
        baseTranslateX: null,
        targetTranslateX: 0,
        currentTranslateX: 0,
        minTranslateX: null,
        maxTranslateX: null,
    };

    hasBeenReveal = false;
    lerp = 1.3;
    raf = null;

    mounted () {
        super.mounted();

        this.lerp = isTouchDevice() ? 0.08 : this.$options.lerp;
        this.init = this.init.bind(this);

        imagesLoaded(this.$el, this.init);
    }

    destroyed () {
        cancelAnimationFrame(this.raq);
    }

    handleResize () {
        this.state = {
            isEnabled: true,
            isPressed: false,
            forward: null,
            baseTranslateX: null,
            targetTranslateX: 0,
            currentTranslateX: 0,
            minTranslateX: null,
            maxTranslateX: null,
        };
        this.calculateBounds();
    }

    init () {
        this.calculateBounds();
        if (!this.state.isEnabled) return;
        if (this.$options.infinite) this.cloneSlides();
        this.addEvents();
        this.raq = requestAnimationFrame(this.update.bind(this));
    }

    cloneSlides () {
        const slides = this.$refs.wrapper.childNodes;
        slides.forEach(slide => this.$refs.wrapper.appendChild(slide.cloneNode(true)));
        this.$update();
    }

    calculateBounds () {
        const containerBox = this.$el.getBoundingClientRect();
        const wrapperBox = this.$refs.wrapper.getBoundingClientRect();

        const lengthOverflowX = containerBox.width - wrapperBox.width;

        if (lengthOverflowX >= 0) {
            this.state.isEnabled = false;
            this.setDisableStyle();
            return;
        }

        this.state.minTranslateX = lengthOverflowX;
        if (this.$options.infinite) {
            this.state.minTranslateX -= wrapperBox.width;
            this.state.baseTranslateX = -wrapperBox.width;
        }
        this.state.maxTranslateX = 0;

        if (this.$options.centered) {
            this.state.currentTranslateX = this.state.minTranslateX / 2;
            this.state.targetTranslateX = this.state.minTranslateX / 2;
        }
    }

    intersected ([{ isIntersecting }]) {
        if (isIntersecting && !this.hasBeenReveal) {
            this.hasBeenReveal = true;
            this.animateIn();
        }
    }

    animateIn () {
        gsap.fromTo(this.$el.querySelectorAll('[data-ref="slides[]"]'), {
            opacity: 0,
        }, {
            opacity: 1,
            duration: 1.2,
            stagger: {
                each: 0.1,
                from: 'center',
                grid: 'auto',
            },
        });
    }

    dragged ({ mode, distance }) {
        if (mode === 'start') window.lenis.stop();
        if (mode === 'drop') window.lenis.start();
        this.state.forward = distance.x < 0;
        const clampDistanceX = clamp(distance.x, -400, 400);
        this.state.targetTranslateX += clampDistanceX * this.$options.speed;
    }

    addEvents () {
        this.$refs.wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.$refs.wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseDown () {
        this.state.isPressed = true;
        gsap.killTweensOf([this.$refs.slides, this.$refs.images], 'scale');
        gsap.to(this.$refs.slides, {
            scale: this.$options.scaleOnPress,
            duration: 0.7,
            ease: 'power4.out',
        });
        gsap.to(this.$refs.images, {
            scale: 1.1,
            duration: 1,
            ease: 'power4.out',
        });
    }

    onMouseUp () {
        this.state.isPressed = false;
        gsap.killTweensOf([this.$refs.slides, this.$refs.images], 'scale');
        gsap.to(this.$refs.slides, {
            scale: 1,
            duration: 0.5,
            ease: 'power4.out',
        });
        gsap.to(this.$refs.images, {
            scale: 1,
            duration: 0.5,
            ease: 'power4.out',
        });
    }

    update () {
        if (this.$options.infinite && this.state.forward && this.state.currentTranslateX <= this.state.baseTranslateX) {
            this.state.targetTranslateX = this.state.maxTranslateX + this.state.targetTranslateX - this.state.currentTranslateX;
            this.state.currentTranslateX = this.state.maxTranslateX;
        } else if (this.$options.infinite && !this.state.forward && this.state.targetTranslateX >= this.state.maxTranslateX) {
            this.state.targetTranslateX = this.state.baseTranslateX + this.state.targetTranslateX - this.state.currentTranslateX;
            this.state.currentTranslateX = this.state.baseTranslateX + this.state.currentTranslateX;
        } else {
            this.state.targetTranslateX = clamp(this.state.targetTranslateX, this.state.minTranslateX, this.state.maxTranslateX);
            this.state.currentTranslateX = damp(this.state.targetTranslateX, this.state.currentTranslateX, this.lerp, 0.01);
        }
        gsap.set(this.$refs.wrapper, { x: this.state.currentTranslateX });
        this.raq = requestAnimationFrame(this.update.bind(this));
    }

    setDisableStyle () {
        this.$refs.wrapper.style.width = '100%';
        this.$refs.wrapper.style.justifyContent = 'center';
        this.$refs.wrapper.style.cursor = 'default';
    }
}
