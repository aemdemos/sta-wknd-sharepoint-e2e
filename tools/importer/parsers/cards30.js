/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Defensive: find all immediate <li> children in the list
  const list = element.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children).filter(li => li.tagName === 'LI');

  items.forEach((li) => {
    // Find the image element
    let imgEl = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Compose text cell: Title (as heading), Description, CTA (title link)
    const textCell = [];
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
        textCell.push(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.push(descP);
    }
    // CTA (title link)
    if (titleLink) {
      // Only add if href is present and not just '#'
      const href = titleLink.getAttribute('href');
      if (href && href !== '#') {
        const cta = document.createElement('a');
        cta.href = href;
        cta.textContent = 'Read more';
        textCell.push(cta);
      }
    }

    // Compose row: [image, textCell]
    rows.push([
      imgEl ? imgEl : '',
      textCell
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
