/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row per block spec
  const headerRow = ['Cards (cards14)'];

  // Find all card items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [headerRow];

  items.forEach((li) => {
    // Defensive: Find image element
    let img = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: Find title span and its link
    let titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Defensive: Find description
    let descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCellContent = [];
    if (titleSpan) {
      // Use heading for title
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      if (titleLink && titleLink.href) {
        // Wrap heading in link if available
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(heading);
        textCellContent.push(link);
      } else {
        textCellContent.push(heading);
      }
    }
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCellContent.push(descP);
    }
    // Optionally add CTA if the title link is not used above
    // (In this source, title is already a link, so no extra CTA)

    // Compose row: [image, text cell]
    rows.push([
      img || '',
      textCellContent
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
