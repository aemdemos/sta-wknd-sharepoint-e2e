/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block requirements
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Defensive: Find the image list (cards container)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Find the image element (mandatory)
    let img = item.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if img not found
    if (!img) {
      img = document.createElement('span');
      img.textContent = '[No image]';
    }

    // Find the title (mandatory)
    let titleSpan = item.querySelector('.cmp-image-list__item-title');
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    let titleEl = null;
    if (titleText) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
    }

    // Find the description (optional)
    let descSpan = item.querySelector('.cmp-image-list__item-description');
    let descText = descSpan ? descSpan.textContent.trim() : '';
    let descEl = null;
    if (descText) {
      descEl = document.createElement('p');
      descEl.textContent = descText;
    }

    // Find the CTA (optional, use title link if present)
    let titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let ctaEl = null;
    if (titleLink && titleLink.href) {
      ctaEl = document.createElement('a');
      ctaEl.href = titleLink.href;
      ctaEl.textContent = 'Learn more';
    }

    // Compose text cell content
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    if (ctaEl) textCellContent.push(ctaEl);

    // Add row: [image, text content]
    rows.push([
      img,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with the block table
  element.replaceWith(block);
}
