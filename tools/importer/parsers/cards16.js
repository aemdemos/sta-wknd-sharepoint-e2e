/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block parser
  // Step 1: Set up header row
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Step 2: Find all card items
  // The cards are inside ul.cmp-image-list > li.cmp-image-list__item
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((item) => {
    // Each item contains:
    // - Image link: a.cmp-image-list__item-image-link > div > div > img
    // - Title link: a.cmp-image-list__item-title-link > span.cmp-image-list__item-title
    // - Description: span.cmp-image-list__item-description
    
    // Image (first column)
    let imageEl = item.querySelector('.cmp-image-list__item-image-link img');
    // Defensive: fallback to any img inside the card if not found
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // Text content (second column)
    // Title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let titleEl = null;
    if (titleLink && titleSpan) {
      // Wrap title in a heading element (h3)
      titleEl = document.createElement('h3');
      // If the title is a link, wrap the heading in the link
      const linkHref = titleLink.getAttribute('href');
      if (linkHref) {
        const linkEl = document.createElement('a');
        linkEl.href = linkHref;
        linkEl.appendChild(document.createTextNode(titleSpan.textContent));
        titleEl.appendChild(linkEl);
      } else {
        titleEl.textContent = titleSpan.textContent;
      }
    }

    // Description
    const descEl = item.querySelector('.cmp-image-list__item-description');
    // Defensive: fallback to any span after title if not found
    let descriptionEl = null;
    if (descEl) {
      descriptionEl = document.createElement('p');
      descriptionEl.textContent = descEl.textContent;
    }

    // Compose text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descriptionEl) textCellContent.push(descriptionEl);

    // Add row: [image, text]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Step 3: Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
