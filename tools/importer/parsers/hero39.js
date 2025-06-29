/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block name
  const headerRow = ['Hero (hero39)'];

  // Image row (background image)
  let imageCell = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      imageCell = imageDiv;
    }
  }

  // Content row (title, description)
  const contentCell = document.createElement('div');
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Title: keep heading level as is
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      contentCell.appendChild(title);
    }
    // Description: use direct children of description div
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach((node) => {
        contentCell.appendChild(node);
      });
    }
    // CTA handling (not present in this HTML, but for robustness)
    const cta = content.querySelector('.cmp-teaser__cta');
    if (cta) {
      contentCell.appendChild(cta);
    }
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [imageCell].filter(Boolean),
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
