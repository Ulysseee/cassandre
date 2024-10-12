module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base"],
  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["~", "./app"]],
        extensions: [".ts", ".js", ".jsx", ".json"],
      },
    },
  },
  rules: {
    indent: ["error", 2],
    "no-underscore-dangle": "off",
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
    "class-methods-use-this": ["warn"],
    "no-new": "off",
    "no-bitwise": "off",
    "no-plusplus": "off",
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "max-len": "off",
    "arrow-parens": ["warn", "as-needed"],
  },
};
