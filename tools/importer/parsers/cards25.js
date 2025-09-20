/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Defensive: Find all immediate list items representing cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Find the image (always present)
    const imageLink = item.querySelector('a.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      // Find the img inside the image link
      imageEl = imageLink.querySelector('img');
    }

    // Find the title (as heading, inside a link)
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element (h3)
        const h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode(titleSpan.textContent));
        titleEl = h3;
      }
    }

    // Find the description
    const descSpan = item.querySelector('span.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      // Use a paragraph for description
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      descEl = p;
    }

    // Compose the text cell: title, description, and (optionally) CTA
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    // Optionally add CTA (link to article)
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      cta.setAttribute('target', '_blank');
      textCellContent.push(cta);
    }

    // Add the row: [image, text content]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
