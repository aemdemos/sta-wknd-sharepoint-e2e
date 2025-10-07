/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero28) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (optional)
  // Row 3: Title, subheading, CTA (optional)

  // --- Row 1: Header ---
  const headerRow = ['Hero (hero28)'];

  // --- Row 2: Background image ---
  let imageEl = '';
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      imageEl = img.cloneNode(true);
    }
  }
  const imageRow = [imageEl];

  // --- Row 3: Content ---
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentRowEls = [];
  if (contentDiv) {
    // Title
    const titleEl = contentDiv.querySelector('.cmp-teaser__title');
    if (titleEl) {
      const h1 = document.createElement('h1');
      h1.innerHTML = titleEl.innerHTML;
      contentRowEls.push(h1);
    }
    // Description
    const descEl = contentDiv.querySelector('.cmp-teaser__description');
    if (descEl) {
      const p = document.createElement('p');
      p.innerHTML = descEl.innerHTML;
      contentRowEls.push(p);
    }
    // CTA
    const ctaLink = contentDiv.querySelector('.cmp-teaser__action-link');
    if (ctaLink) {
      contentRowEls.push(ctaLink.cloneNode(true));
    }
  }
  const contentRow = [contentRowEls];

  // --- Compose table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
