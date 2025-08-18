/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block name, exactly as specified
  const headerRow = ['Hero (hero39)'];

  // Prepare second row: background image (optional)
  let imgEl = null;
  // Seek image in .cmp-teaser__image (descendant of element)
  const teaserDiv = element.querySelector('.cmp-teaser');
  if (teaserDiv) {
    const teaserImageDiv = teaserDiv.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      imgEl = teaserImageDiv.querySelector('img');
    }
  }

  // Prepare third row: content (headline, description, etc)
  let contentEls = [];
  if (teaserDiv) {
    const teaserContentDiv = teaserDiv.querySelector('.cmp-teaser__content');
    if (teaserContentDiv) {
      // Title (h2)
      const titleEl = teaserContentDiv.querySelector('.cmp-teaser__title');
      if (titleEl) contentEls.push(titleEl);
      // Description (div > p)
      const descEl = teaserContentDiv.querySelector('.cmp-teaser__description');
      if (descEl) {
        // If description has multiple paragraphs, include them all
        const ps = descEl.querySelectorAll('p');
        if (ps.length > 0) {
          contentEls.push(...ps);
        } else {
          contentEls.push(descEl);
        }
      }
      // CTA: not present in this HTML, but code would allow to add if appeared (e.g., a link)
    }
  }
  // Ensure at least an empty string in the cell if nothing was found

  const cells = [
    headerRow,
    [imgEl ? imgEl : ''],
    [contentEls.length ? contentEls : ''],
  ];

  // Create block table, referencing original elements
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
