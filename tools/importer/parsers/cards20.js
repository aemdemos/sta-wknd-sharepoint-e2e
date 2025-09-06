/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list block
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  // If not found, fallback to element itself
  const listRoot = imageList || element;

  // Find all card items (li elements)
  const items = Array.from(listRoot.querySelectorAll('li.cmp-image-list__item'));

  // Table header
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Defensive: find the content article
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // Image: find the first img inside the image link
    let imageCell = null;
    const imageLink = content.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
    // Defensive fallback: if no image found, skip row
    if (!imageCell) return;

    // Text cell: Title, Description, CTA
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = content.querySelector('.cmp-image-list__item-title');
    const descSpan = content.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCellContent = [];
    // Title (as heading)
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCellContent.push(heading);
    }
    // Description
    if (descSpan) {
      const desc = document.createElement('div');
      desc.textContent = descSpan.textContent;
      textCellContent.push(desc);
    }
    // CTA (title link)
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = titleSpan ? titleSpan.textContent : titleLink.textContent;
      cta.setAttribute('target', '_blank');
      textCellContent.push(cta);
    }

    // Add row: [image, text]
    rows.push([imageCell, textCellContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
