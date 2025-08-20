/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row with exact block name
  const cells = [['Hero (hero19)']];

  // 1. Get the hero (top) image element – first .cmp-image in the block
  let heroImage = null;
  // Accept .cmp-image anywhere in element (hero usually comes first in DOM)
  const heroImageEl = element.querySelector('.cmp-image');
  if (heroImageEl) {
    heroImage = heroImageEl;
  } else {
    // fallback: first <img> if no cmp-image
    const img = element.querySelector('img');
    if (img) heroImage = img;
  }
  cells.push([heroImage ? heroImage : '']);

  // 2. Gather all prominent hero text (heading, subheading, optional author, etc.)
  // Locate the main title area. Titles are in .cmp-title blocks, typically h1/h4.
  // We'll collect all h1/h2/h3/h4/h5 and all paragraphs from the main content area, but only the top article's section
  let heroTexts = [];
  // Find the main responsivegrid area (first direct children main.container.responsivegrid)
  let mainContent = null;
  const mainCandidates = element.querySelectorAll('main.container.responsivegrid');
  if (mainCandidates.length > 0) {
    mainContent = mainCandidates[0];
  } else {
    mainContent = element;
  }

  // Get all .cmp-title h1/h2/h3/h4/h5 in mainContent
  const titleEls = mainContent.querySelectorAll('.cmp-title h1, .cmp-title h2, .cmp-title h3, .cmp-title h4, .cmp-title h5');
  titleEls.forEach(el => {
    if (!heroTexts.includes(el)) heroTexts.push(el);
  });
  // Also grab first "intro" p after title(s) (as context intro)
  // Get first <article> (the main contentfragment)
  let article = mainContent.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (article) {
    // Get p's before major heading (just the lead intro)
    let foundFirstMajorHeading = false;
    article.querySelectorAll('p, h1, h2, h3, h4, h5').forEach(el => {
      if (/h[1-5]/.test(el.tagName.toLowerCase()) && !foundFirstMajorHeading) {
        foundFirstMajorHeading = true;
      }
      if (!foundFirstMajorHeading && el.tagName.toLowerCase() === 'p') {
        // add only if not already in heroTexts
        if (!heroTexts.includes(el)) heroTexts.push(el);
      }
    });
  } else {
    // Fallback: add first p from mainContent after any titles
    let firstP = null;
    // Try to find first p after the last title
    let lastTitle = heroTexts.length ? heroTexts[heroTexts.length - 1] : null;
    if (lastTitle) {
      // Search for next p in DOM after lastTitle
      let next = lastTitle;
      while (next && next.nextElementSibling) {
        next = next.nextElementSibling;
        if (next.tagName && next.tagName.toLowerCase() === 'p') {
          firstP = next;
          break;
        }
      }
    }
    if (!firstP) {
      // fallback: any p in mainContent
      firstP = mainContent.querySelector('p');
    }
    if (firstP && !heroTexts.includes(firstP)) {
      heroTexts.push(firstP);
    }
  }

  // The hero text cell must be a single cell containing all referenced elements (no clones)
  cells.push([heroTexts.length ? heroTexts : '']);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
