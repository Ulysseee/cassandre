import {
  Base,
  withFreezedOptions,
  withScrolledInView,
} from "@studiometa/js-toolkit";

export default class Parallax extends withFreezedOptions(
  withScrolledInView(Base)
) {
  static config = {
    name: "Parallax",
    options: {
      percent: {
        type: Number,
        default: 10,
      },
      reverse: {
        type: Boolean,
        default: false,
      },
    },
    refs: ["container", "image"],
  };

  scrollProgressY = 0;

  mounted() {
    this.$refs.image.style.willChange = "transform";
    this.scaleString = `scale(${1 + this.$options.percent / 100}, ${
      1 + this.$options.percent / 100
    })`;
    this.$el.style.transform = `scale(${1 + this.$options.percent / 100})`;
    this.$refs.container.style.transform = this.scaleString;
  }

  scrolledInView({ progress }) {
    this.scrollProgressY = progress.y - 0.5;
  }

  ticked() {
    const percentY =
      this.scrollProgressY *
      this.$options.percent *
      (this.$options.reverse ? 1 : -1);

    return () => {
      this.$refs.container.style.transform = `${this.scaleString} translateY(${percentY}%)`;
    };
  }
}
