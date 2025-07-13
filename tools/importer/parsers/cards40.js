/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single column: ['Cards (cards40)']
  const headerRow = ['Cards (cards40)'];

  // Extract the image for first column
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let imgEl = null;
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Build content for second column
  const content = element.querySelector('.cmp-teaser__content');
  const textContent = document.createElement('div');
  if (content) {
    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = pretitle.textContent.trim();
      textContent.appendChild(p);
    }
    // Title (optional)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textContent.appendChild(h2);
    }
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      textContent.appendChild(descP);
    }
    // CTA (optional)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      const ctaP = document.createElement('p');
      ctaP.appendChild(cta);
      textContent.appendChild(ctaP);
    }
  }

  // Compose rows: first row is header (1 cell), second row is 2 cells
  const rows = [
    headerRow,
    [imgEl, textContent]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
