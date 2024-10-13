import { Base, getInstanceFromElement } from "@studiometa/js-toolkit";
import gsap from "gsap";
import { removeClass } from "@studiometa/js-toolkit/utils";
import { COLORS } from "../constants/colors";
import HomeHeader from "./HomeHeader";
import Navigation from "./Navigation";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default class OverlayTransition extends Base {
  static config = {
    name: "Preloader",
    refs: [
      "wrapper",
      "logoFrames[]",
      "name",
      "scribblePath",
      "nameWord",
      "overlay",
    ],
    options: {
      name: {
        type: String,
        default: "cassandre",
      },
    },
  };

  mounted() {
    this.logoFramesAnimation = null;
    this.overlay = {
      context: this.$refs.overlay.getContext("2d"),
      width: window.innerWidth * window.devicePixelRatio,
      height: window.innerHeight * window.devicePixelRatio,
    };
    this.$refs.overlay.width = this.overlay.width;
    this.$refs.overlay.height = this.overlay.height;
  }

  async animateIn() {
    return new Promise((resolve) => {
      gsap
        .timeline({
          onStart: () => {
            removeClass(this.$el, "is-hidden");
            gsap.set(this.$refs.logoFrames, { autoAlpha: 0 });
            const scribblePathLength = this.$refs.scribblePath.getTotalLength();
            gsap.set(this.$refs.scribblePath, {
              strokeDasharray: `${scribblePathLength} ${scribblePathLength}`,
            });
          },
        })
        .timeScale(1.4)
        .add(this.animateLogoFrames().repeat(5))
        .set(this.$refs.name, { autoAlpha: 1 })
        .to(this.$refs.nameWord, {
          duration: 0.45,
          ease: `step(${this.$options.name.length})`,
          onUpdate: function (nameTarget, nameString) {
            nameTarget.innerText = nameString.slice(
              0,
              Math.round(this.progress() * nameString.length)
            );
          },
          onUpdateParams: [this.$refs.nameWord, this.$options.name],
        })
        .to(this.$refs.nameWord, {
          delay: 1.3,
          duration: 0.15,
          ease: `step(${this.$options.name.length})`,
          onUpdate: function (nameTarget, nameString) {
            nameTarget.innerText = nameString.slice(
              0,
              Math.round((1 - this.progress()) * nameString.length)
            );
          },
          onUpdateParams: [this.$refs.nameWord, this.$options.name],
        })
        .fromTo(
          this.$refs.scribblePath,
          {
            strokeDashoffset: this.$refs.scribblePath.getTotalLength(),
          },
          {
            strokeDashoffset: -this.$refs.scribblePath.getTotalLength() + 1,
            duration: 2.3,
            ease: "quart.out",
          },
          ">+=0.1"
        )
        .set(this.$refs.overlay, { autoAlpha: 1 })
        .call(resolve, [], ">-=0.9");
    });
  }

  async animateOut() {
    const homeHeaderElement = document.querySelector(
      '[data-component="HomeHeader"]'
    );
    if (homeHeaderElement)
      this.header = getInstanceFromElement(homeHeaderElement, HomeHeader);
    this.navigation = getInstanceFromElement(
      document.querySelector('[data-component="Navigation"]'),
      Navigation
    );
    return new Promise((resolve) => {
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(this.$el, { autoAlpha: 0 });
            document.querySelector("[data-taxi]").style.transform = "";
            resolve();
          },
        })
        .add(
          gsap.to(this.overlay, {
            duration: 1,
            ease: "expo.in",
            onUpdate: this.animateOverlay,
            onUpdateParams: [this.overlay, this.overlay.height, "#FF6C3C"],
          })
        )
        .add(
          gsap.to(this.overlay, {
            onStart: () => {
              gsap.set(this.$refs.wrapper, { autoAlpha: 0 });
            },
            duration: 1,
            ease: "expo.out",
            onUpdate: this.animateOverlay,
            onUpdateParams: [this.overlay, 0, "#FF6C3C"],
          })
        )
        .call(
          () => {
            if (this.header) this.header.animateIn();
          },
          null,
          "-=0.9"
        )
        .call(
          () => {
            this.navigation.animateIn();
          },
          null,
          "-=0.5"
        );
    });
  }

  animatePageTransitionIn({ onComplete }) {
    return gsap
      .timeline({
        onStart: () => {
          gsap.set(this.$el, { autoAlpha: 1 });
          gsap.set(this.$refs.wrapper, { autoAlpha: 1 });

          gsap.set(this.$refs.logoFrames, { autoAlpha: 0 });
          gsap.set(this.$refs.name, { autoAlpha: 0 });
        },
        onComplete: onComplete,
      })
      .from(this.$refs.wrapper, {
        clipPath: "inset(100% 0 0 0)",
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
          this.logoFramesAnimation = this.animateLogoFrames().repeat(5);
        },
      })
      .add(
        gsap.to(this.overlay, {
          duration: 1,
          ease: "expo.in",
          onUpdate: this.animateOverlay,
          onUpdateParams: [this.overlay, this.overlay.height, "#FF6C3C"],
          onComplete: () => {
            gsap.set(this.$refs.wrapper, { autoAlpha: 0 });
            gsap.set(this.$refs.logoFrames, { autoAlpha: 0 });
            document.querySelector("[data-taxi]").style.transform = "";
            // this.logoFramesAnimation.kill();
          },
        }),
        ">+=1"
      );
  }

  animatePageTransitionOut({ onComplete }) {
    return gsap
      .timeline({
        delay: 0.2,
        onComplete: async () => {
          window.lenis.scrollTo(1);
          gsap.set(this.$el, { autoAlpha: 0 });
          onComplete();
        },
      })
      .add(
        gsap.to(this.overlay, {
          duration: 1,
          ease: "expo.out",
          onUpdate: this.animateOverlay,
          onUpdateParams: [this.overlay, 0, "#FF6C3C"],
        })
      );
  }

  animateLogoFrames() {
    if (this.logoFramesAnimation) this.logoFramesAnimation.kill();
    return gsap.to(this.$refs.logoFrames, {
      onStart: () => {
        gsap.set(this.$refs.logoFrames, { autoAlpha: 0 });
      },
      keyframes: [
        { autoAlpha: 0, duration: 0 },
        { autoAlpha: 1, duration: 0, delay: 0.04 },
        { autoAlpha: 0, duration: 0, delay: 0.08 },
      ],
      stagger: 0.081,
    });
  }

  animateOverlay(overlay, baseY, fillColor) {
    overlay.context.clearRect(0, 0, overlay.width, overlay.height);
    overlay.context.save();
    overlay.context.beginPath();

    overlay.context.moveTo(overlay.width, baseY);
    overlay.context.lineTo(0, baseY);

    const widthSegments = Math.ceil(overlay.width / 40);
    const t = (1 - this.ratio) * overlay.height;
    const amplitude = 200 * Math.sin(this.ratio * Math.PI);

    overlay.context.lineTo(0, t);

    for (let index = 0; index <= widthSegments; index++) {
      const n = 40 * index;
      const r = t - Math.sin((n / overlay.width) * Math.PI) * amplitude;

      overlay.context.lineTo(n, r);
    }

    overlay.context.fillStyle = fillColor;
    overlay.context.fill();
    overlay.context.restore();
  }
}
