/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly
  const headerRow = ['Hero (hero38)'];

  // Helper: find the first .cmp-image inside any descendant image block in the top-level element
  let heroImg = null;
  // Search only direct children for .image > .cmp-image
  const directDivs = element.querySelectorAll(':scope > div');
  for (const div of directDivs) {
    const image = div.querySelector('.image .cmp-image');
    if (image && !heroImg) {
      heroImg = image;
      break;
    }
  }

  // Extract hero text content: Prefer all title blocks (h1, h2, h3, h4, h5, h6, p), in order, from all direct children.
  // Only extract heading and paragraph elements that are in the first main section (before more complex content like articles, etc.)
  let heroTextEls = [];
  let seenMainContent = false;
  for (const div of directDivs) {
    // If this child contains an article.contentfragment or main content, stop collecting hero text
    if (
      div.querySelector('article.contentfragment, article.cmp-contentfragment, .aem-Grid, main article')
    ) {
      // Stop collecting hero text
      seenMainContent = true;
      break;
    }
    // Otherwise, collect all headings and paras in this block
    const els = div.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    for (const el of els) {
      // Reference the existing element in the document
      heroTextEls.push(el);
    }
  }
  // If nothing found, fallback to all headings and paras in the block before the first article
  if (heroTextEls.length === 0) {
    let foundArticle = false;
    const all = Array.from(element.querySelectorAll('*'));
    for (const el of all) {
      if (foundArticle) break;
      if (el.closest('article.contentfragment, article.cmp-contentfragment, main article')) {
        foundArticle = true;
        break;
      }
      if (/^H[1-6]$/.test(el.tagName) || el.tagName === 'P') {
        heroTextEls.push(el);
      }
    }
  }

  // Compose the rows: header, image, text
  const rows = [
    headerRow,
    [heroImg],
    [heroTextEls.length > 0 ? heroTextEls : '']
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
