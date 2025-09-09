/* global WebImporter */
export default function parse(element, { document }) {
  // Find all teaser blocks (each is a slide)
  const teaserEls = element.querySelectorAll('.cmp-teaser');

  // Prepare rows: header first
  const headerRow = ['Carousel (carousel12)'];
  const rows = [headerRow];

  teaserEls.forEach((teaser) => {
    // IMAGE CELL
    let imgEl = teaser.querySelector('.cmp-teaser__image img');
    // Defensive: fallback if not found
    if (!imgEl) imgEl = teaser.querySelector('img');

    // TEXT CELL
    let textCellContent = '';
    const contentEl = teaser.querySelector('.cmp-teaser__content');
    if (contentEl) {
      // If there's a heading, preserve heading level
      const heading = contentEl.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        // Clone heading to preserve tag and formatting
        textCellContent += heading.outerHTML;
      }
      // Get all other content (e.g., paragraphs, links)
      Array.from(contentEl.children).forEach((child) => {
        if (!/^H[1-6]$/i.test(child.tagName)) {
          textCellContent += child.outerHTML;
        }
      });
    }
    // If no text, leave cell empty
    if (!textCellContent) textCellContent = '';

    // Add row: [image, text]
    rows.push([imgEl, textCellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block table
  element.replaceWith(block);
}
