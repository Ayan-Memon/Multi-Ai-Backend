import pptxgen from "pptxgenjs";

const primary = "1449E6";
const dark = "171717";
const muted = "666666";
const border = "E5E7EB";
const white = "FFFFFF";
const light = "F8FAFC";

export const generatePpt = async (data) => {
  const ppt = new pptxgen();

  ppt.layout = "LAYOUT_WIDE";
  ppt.author = "Nexora";
  ppt.company = "Nexora";
  ppt.title = data.title;
  ppt.subject = data.title;
  ppt.lang = "en-US";

  // Cover
  addCover(ppt, data);

  // Content slides
  data?.slides?.forEach((slide, idx) => {
    addContentSlide(ppt, slide.title, slide.point, idx + 1, data.slides.length);
  });

  // Thank you
  addThankYou(ppt);

  const buffer = await ppt.write({
    outputType: "nodebuffer",
  });

  return buffer;
};

const addCover = (ppt, data) => {
  const slide = ppt.addSlide("BLANK");

  slide.background = {
    color: white,
  };

  // Accent bar
  slide.addShape(ppt.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.12,
    line: { color: primary, transparency: 100 },
    fill: { color: primary },
  });

  // Nexora
  slide.addText("NEXORA", {
    x: 0.8,
    y: 0.65,
    w: 2,
    h: 0.35,
    fontSize: 16,
    bold: true,
    color: primary,
    charSpacing: 2,
  });

  // Main title
  slide.addText(data.title || "Untitled Presentation", {
    x: 1,
    y: 2.35,
    w: 11.3,
    h: 1.1,
    fontSize: 38,
    bold: true,
    color: dark,
    align: "center",
    valign: "mid",
    margin: 0,
    breakLine: false,
  });

  // Subtitle
  slide.addText(data.subtitle || "", {
    x: 2,
    y: 3.65,
    w: 9.3,
    h: 0.7,
    fontSize: 18,
    color: muted,
    align: "center",
    valign: "mid",
    margin: 0,
  });

  // Bottom line
  slide.addShape(ppt.ShapeType.line, {
    x: 5.4,
    y: 5.15,
    w: 2.5,
    h: 0,
    line: {
      color: primary,
      width: 2,
    },
  });

  slide.addText("Generated with NEXORA", {
    x: 0.8,
    y: 6.8,
    w: 3,
    h: 0.3,
    fontSize: 10,
    color: muted,
    margin: 0,
  });
};

const addContentSlide = (ppt, title, points = [], slideNumber, totalSlides) => {
  const slide = ppt.addSlide("BLANK");

  slide.background = {
    color: white,
  };

  // Top accent
  slide.addShape(ppt.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.08,
    line: {
      color: primary,
      transparency: 100,
    },
    fill: {
      color: primary,
    },
  });

  // Slide number
  slide.addText(`${String(slideNumber).padStart(2, "0")}`, {
    x: 11.8,
    y: 0.45,
    w: 0.7,
    h: 0.35,
    fontSize: 12,
    bold: true,
    color: primary,
    align: "right",
    margin: 0,
  });

  // Title
  slide.addText(title || "Untitled", {
    x: 0.75,
    y: 0.55,
    w: 10.5,
    h: 0.65,
    fontSize: 30,
    bold: true,
    color: dark,
    margin: 0,
  });

  // Divider
  slide.addShape(ppt.ShapeType.line, {
    x: 0.75,
    y: 1.4,
    w: 11.8,
    h: 0,
    line: {
      color: border,
      width: 1,
    },
  });

  // Points
  const textRuns = points.map((item) => ({
    text: item,
    options: {
      bullet: {
        indent: 18,
      },
      breakLine: true,
    },
  }));

  slide.addText(textRuns, {
    x: 1,
    y: 1.8,
    w: 10.8,
    h: 4.5,
    fontSize: 20,
    color: dark,
    breakLine: false,
    paraSpaceAfterPt: 18,
    valign: "mid",
    margin: 0.05,
    fit: "shrink",
  });

  // Footer
  slide.addText("NEXORA", {
    x: 0.75,
    y: 7.05,
    w: 1.5,
    h: 0.25,
    fontSize: 9,
    bold: true,
    color: muted,
    charSpacing: 1.5,
    margin: 0,
  });

  slide.addText(`${slideNumber} / ${totalSlides}`, {
    x: 11.3,
    y: 7.05,
    w: 1.3,
    h: 0.25,
    fontSize: 9,
    color: muted,
    align: "right",
    margin: 0,
  });
};

const addThankYou = (ppt) => {
  const slide = ppt.addSlide("BLANK");

  slide.background = {
    color: light,
  };

  slide.addShape(ppt.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.12,
    line: {
      color: primary,
      transparency: 100,
    },
    fill: {
      color: primary,
    },
  });

  slide.addText("Thank You", {
    x: 1,
    y: 2.6,
    w: 11.3,
    h: 0.8,
    fontSize: 40,
    bold: true,
    color: dark,
    align: "center",
    margin: 0,
  });

  slide.addText("Generated with NEXORA", {
    x: 2,
    y: 3.65,
    w: 9.3,
    h: 0.4,
    fontSize: 16,
    color: muted,
    align: "center",
    margin: 0,
  });

  slide.addShape(ppt.ShapeType.line, {
    x: 5.4,
    y: 4.5,
    w: 2.5,
    h: 0,
    line: {
      color: primary,
      width: 2,
    },
  });
};
