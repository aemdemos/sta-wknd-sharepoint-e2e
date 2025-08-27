/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach(item => {
    // Image cell: reference the <img> element directly if available
    let imageEl = item.querySelector('.cmp-image-list__item-image img');

    // Title: Use the link text, bolded (using <strong>)
    let titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent) {
        titleText = titleSpan.textContent;
      }
    }
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = titleText;

    // Description: Use the description span text as a paragraph
    let descSpan = item.querySelector('.cmp-image-list__item-description');
    let descP = null;
    if (descSpan && descSpan.textContent && descSpan.textContent.trim()) {
      descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
    }

    // Card text cell: combine strong title and optional description paragraph
    const textCell = descP ? [strongTitle, descP] : [strongTitle];

    // Build the row: [image, textCell]
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create the block table using referenced DOM elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
