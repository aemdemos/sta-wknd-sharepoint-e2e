/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel27) block: 2 columns, multiple rows, header row is block name
  // Each slide: [image, text content]

  // 1. Header row
  const headerRow = ['Carousel (carousel27)'];

  // 2. Find the teaser block (the actual slide content)
  let teaser = element.querySelector('.cmp-teaser');
  if (!teaser) {
    if (element.classList.contains('cmp-teaser')) {
      teaser = element;
    } else {
      teaser = element;
    }
  }

  // 3. Extract image (mandatory, first cell)
  let imageEl = null;
  const imgContainer = teaser.querySelector('.cmp-teaser__image img');
  if (imgContainer) {
    imageEl = imgContainer;
  } else {
    imageEl = teaser.querySelector('img');
  }

  // 4. Extract text content (title, description, CTA)
  const textContent = document.createElement('div');
  // Title (heading)
  const titleEl = teaser.querySelector('.cmp-teaser__title');
  if (titleEl) {
    textContent.appendChild(titleEl);
  }
  // Description
  const descEl = teaser.querySelector('.cmp-teaser__description');
  if (descEl) {
    textContent.appendChild(descEl);
  }
  // CTA (link)
  const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
  if (ctaEl) {
    textContent.appendChild(ctaEl);
  }

  // 5. Build table rows
  const rows = [
    headerRow,
    [imageEl, textContent]
  ];

  // 6. Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 7. Replace the original element
  element.replaceWith(table);
}
