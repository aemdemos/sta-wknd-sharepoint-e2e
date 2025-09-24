/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block requirements
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find all card list items
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Get the article containing the card content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE COLUMN ---
    // Find the image inside the image link
    let imageEl = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }

    // --- TEXT COLUMN ---
    // Title (as heading)
    let titleEl = article.querySelector('.cmp-image-list__item-title');
    let titleHeading = null;
    if (titleEl) {
      titleHeading = document.createElement('strong');
      titleHeading.textContent = titleEl.textContent;
    }

    // Description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    // Compose text cell content
    const textCell = [];
    if (titleHeading) textCell.push(titleHeading);
    if (descEl) {
      // Add a line break if both title and description
      if (titleHeading) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    // CTA: Use the title link as CTA if present
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink && titleLink.href) {
      // Only add CTA if not redundant with title
      // (In this design, the title is the CTA, so skip duplicate)
    }

    // Build the row: [image, text content]
    rows.push([
      imageEl || '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
