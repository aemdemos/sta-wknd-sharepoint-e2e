/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: matches example exactly
  const headerRow = ['Hero (hero27)'];

  // 2. Image row: extract the first <img> in the block (background image)
  let img = null;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      img = imageContainer.querySelector('img');
    }
  } else {
    // fallback: get first img anywhere in element if teaser missing
    img = element.querySelector('img');
  }

  // 3. Content row: Title, description, CTA (using existing elements)
  let contentCell = [];
  if (teaser) {
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Title
      const title = contentContainer.querySelector('.cmp-teaser__title');
      if (title) contentCell.push(title);
      // Description
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) contentCell.push(desc);
      // Call-to-Action
      const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const cta = ctaContainer.querySelector('a');
        if (cta) contentCell.push(cta);
      }
    }
  }
  // fallback: if teaser/content not found, collect all headings, paragraphs, and links
  if (contentCell.length === 0) {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(el => contentCell.push(el));
    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach(el => contentCell.push(el));
    const links = element.querySelectorAll('a');
    links.forEach(el => contentCell.push(el));
  }

  // Build the table
  const cells = [
    headerRow,
    [img ? img : ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
