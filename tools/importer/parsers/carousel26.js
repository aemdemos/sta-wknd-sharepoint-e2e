/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Header row
  const headerRow = ['Carousel (carousel26)'];
  const rows = [headerRow];

  // Find the teaser block(s)
  const teasers = [element.querySelector('.cmp-teaser')].filter(Boolean);

  teasers.forEach(teaser => {
    // IMAGE (first column)
    let img = '';
    const imgEl = teaser.querySelector('.cmp-teaser__image img');
    if (imgEl) img = imgEl;

    // TEXT (second column)
    const textContent = [];
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      const h2 = content.querySelector('h2');
      if (h2) textContent.push(h2);
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) textContent.push(cta);
    }
    rows.push([
      img,
      textContent.length ? textContent : ''
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
