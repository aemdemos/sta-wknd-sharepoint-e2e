/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image list container
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  // Defensive: Find all card items
  const items = imageList
    ? imageList.querySelectorAll('li.cmp-image-list__item')
    : element.querySelectorAll('li.cmp-image-list__item');

  // Table header
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // For each card item, extract image and text content
  items.forEach((item) => {
    // Defensive: Find the content wrapper
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image container
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the image element inside the link
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }

    // --- TEXT CELL ---
    // Compose title, description, and CTA link
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    // Title (as heading)
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCellContent.push(heading);
    }
    // Description
    if (descriptionSpan) {
      const desc = document.createElement('div');
      desc.textContent = descriptionSpan.textContent;
      textCellContent.push(desc);
    }
    // CTA link (if present and not redundant)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already in title
      if (!titleSpan || titleLink.textContent !== titleSpan.textContent) {
        textCellContent.push(titleLink);
      }
    }

    // Add row: [image, text]
    rows.push([
      imageCell || '',
      textCellContent.length === 1 ? textCellContent[0] : textCellContent,
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
