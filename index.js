require("dotenv").config();

// OFFLINE STUFF
const IS_OFFLINE = false;
const FOOTER = require("./model/footer");
const ABOUT = require("./model/about");
const COMMON = require("./model/common");
const WORKS = require("./model/works");

const express = require("express");
const { createClient } = require("contentful");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");
const { BLOCKS, INLINES } = require("@contentful/rich-text-types");

const app = express();
const path = require("path");

const port = 8080;

const log = (data) => console.log(JSON.stringify(data, null, 2));

const initCMS = () =>
  createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

const getCommon = async (CMS) => {
  const common = await CMS.getEntry("5cKjWZGhvzmSnnLK8Npv96");

  return {
    common: common.fields,
  };
};

const handleWysiwyg = (data) => {
  if (typeof data === "string") return data;
  return documentToHtmlString(data, {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, next) => `${next(node.content)}`,
      [INLINES.HYPERLINK]: (node, next) =>
        `<a href="${
          node.data.uri
        }" target="_blank" rel="noopener noreferrer" class="ui-hyperlink">${next(
          node.content
        )}</a>`,
    },
  });
};

const handleColorName = (col) => {
  const [color] = col;
  if (color === "Beige") return "beige";
  if (color === "Bleu ciel") return "lightblue";
  if (color === "Bleu électrique") return "blue";
  if (color === "Vert") return "green";
  if (color === "Vert clair") return "lightgreen";
  if (color === "Rose pale") return "rose";
  if (color === "Orange") return "orange";
  return "beige";
};

const handleLinkResolver = (content) => {
  if (content.sys.contentType.sys.id.includes("work")) {
    return `/project/${content.fields.slug}`;
  }

  if (content.sys.contentType.sys.id === "contact") {
    return "/about";
  }

  if (content.sys.contentType.sys.id === "home") {
    return "/";
  }

  return "/";
};

const handleMail = (links) => links.find((link) => link.key === "mail");

const handleFormat = (format) => {
  if (format === "Carré") return "square";
  if (format === "Horizontal") return "horizontal";
  if (format === "Vertical") return "vertical";
  return "square";
};

const handleAlignment = (alignment) => {
  if (alignment === "Gauche") return "alignLeft";
  if (alignment === "Centre") return "alignCenter";
  return "alignCenter";
};

const handleWorksRows = (works) =>
  works.reduce(
    (prev, curr, index) =>
      (index % 2 === 0
        ? prev.push([curr])
        : prev[prev.length - 1].push(curr)) && prev,
    []
  );

const handleYear = (date) => new Date(date).getFullYear();

const handleBubbleImages = (bubbleImages) =>
  bubbleImages.map((image) => image.fields.file.url);

const handleTitleAbout = (title) => {
  let raw;

  if (typeof title === "string") {
    raw = title;
  } else {
    raw = documentToHtmlString(title);
  }

  const newStr = raw.replace(
    /\[scribble\]/g,
    `
    <span class="page-about-scribble" data-component="SVGReveal" data-option-duration="2">
        <svg data-ref="svg" width="95" height="93" viewBox="0 0 95 93" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M68.0155 91.624C54.038 74.6725 24.6554 39.9666 18.9454 36.7547C11.8079 32.7399 4.67046 33.186 2.44 38.093C0.209538 43 5.54903 52.368 17.161 49.2454C28.773 46.1227 49.2796 33.186 57.7554 26.9408C66.2311 20.6955 75.153 14.8963 84.0748 17.1267C92.9966 19.3572 93.8888 34.0781 92.1045 41.6617C90.3201 49.2454 83.6287 59.9515 69.7998 59.9515C55.971 59.9515 29.6516 53.2601 20.2836 58.1671C10.9157 63.0741 10.0236 76.457 17.161 84.0405C24.2984 91.624 35.4508 92.0702 40.3578 84.0405C45.2648 76.0108 40.3578 43 39.0195 34.9704C37.6812 26.9408 35.0047 9.54311 44.3726 3.74391C53.7405 -2.05528 64.8928 5.08219 69.7998 12.6658C70.5121 13.7664 77.0476 34.5035 74.7069 49.6913C73.1551 59.7601 69.3538 64.9273 60.878 70.469C52.4023 76.0108 45.2648 77.349 43.0343 71.1037C40.8039 64.8585 53.7405 53.2601 58.2015 51.0296C62.6624 48.7991 66.2311 46.5685 68.9077 47.907C71.5842 49.2454 72.4764 51.4757 71.5842 55.9366C69.9405 64.1552 62.6624 69.3194 58.6475 71.9959C54.6327 74.6725 48.3874 76.4568 46.6031 73.3342C44.8187 70.2116 47.0491 65.9588 50.1718 62.1819C53.2944 58.405 56.4171 55.0444 58.2015 53.2601C59.9858 51.4757 64.4467 48.3533 66.6772 49.2454C68.9077 50.1374 69.7998 52.1741 67.1233 55.9366C64.4467 59.6991 59.5911 63.1846 51.064 67.9811C43.9265 71.9959 37.2351 75.5009 27.4211 76.9029C17.6071 78.3049 14.0383 76.4568 13.1833 70.2116C11.5497 58.2785 61.028 33.632 75.599 40.3234" stroke="#FF6C3C" stroke-width="2.7"/>
        </svg>
    </span>
  `
  );
  const newStr2 = newStr.replace(
    /\[object\]/g,
    `
    <span data-ref="loop" class="page-about-loop">
        <span data-ref="leftParenthesis" class="page-about-loop-parenthesis page-about-loop-parenthesis--left">(</span>
        <span data-ref="loopWord" class="page-about-loop-word">
            <span data-ref="loopInner" class="page-about-loop-inner"></span>
            <span data-ref="loopCarret" class="page-about-loop-carret"></span>
        </span>
        <span data-ref="rightParenthesis" class="page-about-loop-parenthesis page-about-loop-parenthesis--right">)</span>
    </span>
`
  );

  return newStr2;
};

const handleSpacer = (data) => {
  let raw = handleWysiwyg(data);

  const newStr = raw.replace(
    /\[spacer\]/g,
    `<span class="ui-spacer">&nbsp</span>`
  );

  return newStr;
};

const handleOffline = (path, res) => {
  if (path === "/") {
    res.render("pages/home", {
      common: COMMON,
      homePage: {
        baseline: "interactive&<br>brand designer",
        bubbleImages: [
          {
            fields: {
              file: {
                url: "images/bubble-01.png",
              },
            },
          },
          {
            fields: {
              file: {
                url: "images/bubble-02.png",
              },
            },
          },
          {
            fields: {
              file: {
                url: "images/bubble-03.png",
              },
            },
          },
        ],
        works: WORKS,
      },
      footer: FOOTER,
    });
  } else if (path === "/about") {
    res.render("pages/about", {
      common: COMMON,
      about: ABOUT,
    });
  }
};

app.use((req, res, next) => {
  res.locals.getWysiwyg = handleWysiwyg;
  res.locals.getColorName = handleColorName;
  res.locals.getLinkUrl = handleLinkResolver;
  res.locals.getMail = handleMail;
  res.locals.getFormat = handleFormat;
  res.locals.getAlignment = handleAlignment;
  res.locals.getWorksRows = handleWorksRows;
  res.locals.getYear = handleYear;
  res.locals.getBubbleImages = handleBubbleImages;
  res.locals.getTitleAbout = handleTitleAbout;
  res.locals.getSpacerText = handleSpacer;

  next();
});
app.use(express.static(path.join(__dirname, "dist")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  if (IS_OFFLINE) handleOffline("/", res);

  const CMS = await initCMS();
  const common = await getCommon(CMS);
  const homePage = await CMS.getEntry("3MspXo6cNqu83f6mwIBXWD");
  const footer = await CMS.getEntry("2nsk60KEJQkGM7SFWFfpfQ");

  res.render("pages/home", {
    ...common,
    homePage: homePage.fields,
    footer: footer.fields,
  });
});

app.get("/ui", (req, res) => {
  res.render("pages/ui");
});

app.get("/projects", async (req, res) => {
  const CMS = await initCMS();
  const common = await getCommon(CMS);
  const projectsPage = await CMS.getEntry("19D81NneK510sD1PAjAVNS");
  const footer = await CMS.getEntry("2nsk60KEJQkGM7SFWFfpfQ");

  res.render("pages/projects", {
    ...common,
    projectsPage: projectsPage.fields,
    footer: footer.fields,
  });
});

app.get("/project/:uid", async (req, res) => {
  const CMS = await initCMS();
  const common = await getCommon(CMS);

  const contentTypes = [
    "work_left_template",
    "work_right_template",
    "work_video_template",
  ];

  let project = null;

  for (const contentType of contentTypes) {
    const {
      items: [work],
    } = await CMS.getEntries({
      content_type: contentType,
      "fields.slug": req.params.uid,
      limit: 1,
    });

    if (work) {
      project = work;
      break; // Stop searching once the project is found
    }
  }

  if (!project) {
    return res.status(404).render("pages/404");
  }

  const currentWorkDate = project.fields.date;
  const currentWorkSlug = project.fields.slug;
  const content_type = project.sys.contentType.sys.id;

  let nextWork = await CMS.getEntries({
    content_type,
    "fields.date[gte]": currentWorkDate,
    "fields.slug[nin]": currentWorkSlug,
    order: "fields.date",
    limit: 1,
  });

  if (nextWork.total === 0) {
    nextWork = await CMS.getEntries({
      content_type,
      order: "fields.date",
      limit: 1,
    });
  }

  [nextWork] = nextWork.items;

  res.render("pages/project", {
    ...common,
    // ...project.fields,
    fields: project.fields,
    tags: project.metadata.tags,
    template: project.sys.contentType.sys.id,
    ...(nextWork && { nextWork }),
  });
});

app.get("/about", async (req, res) => {
  if (IS_OFFLINE) handleOffline("/about", res);

  const CMS = await initCMS();
  const common = await getCommon(CMS);
  const aboutPage = await CMS.getEntry("22bMbG3m1LHKFEjZmUZjv1");
  const footer = await CMS.getEntry("2nsk60KEJQkGM7SFWFfpfQ");

  res.render("pages/about", {
    ...common,
    aboutPage: aboutPage.fields,
    footer: footer.fields,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
