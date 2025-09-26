/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a heading element for the card title
  function createHeading(titleEl) {
    if (!titleEl) return null;
    const h = document.createElement('h3');
    h.textContent = titleEl.textContent.trim();
    return h;
  }

  // Get all card items
  const items = Array.from(element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item'));

  // Table header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Find title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      titleEl = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Find description
    const descEl = item.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = [];
    // Add heading if present
    const heading = createHeading(titleEl);
    if (heading) textCell.push(heading);
    // Add description if present
    if (descEl) textCell.push(descEl);
    // Add CTA link if present (use title link)
    if (titleLink && titleLink.href) {
      // Only add CTA if href is not just '#'
      if (titleLink.getAttribute('href') && titleLink.getAttribute('href') !== '#') {
        // Only add CTA if not already used as heading
        const cta = document.createElement('a');
        cta.href = titleLink.href;
        cta.textContent = 'Read more';
        textCell.push(cta);
      }
    }

    // Compose row: [image, text]
    rows.push([
      imgEl ? imgEl : '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element with block
  element.replaceWith(block);
}
