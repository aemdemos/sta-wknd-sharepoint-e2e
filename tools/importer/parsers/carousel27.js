/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. HEADER ROW ---
  const header = ['Carousel (carousel27)'];

  // --- 2. IMAGE (first column) ---
  let imgEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // --- 3. TEXT CONTENT (second column) ---
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  const content = [];
  if (contentWrapper) {
    // Title: use heading element (keep source tag if h2, else convert to h2)
    const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleEl) {
      if (/^h[1-6]$/i.test(titleEl.tagName)) {
        content.push(titleEl);
      } else {
        const h2 = document.createElement('h2');
        h2.textContent = titleEl.textContent.trim();
        content.push(h2);
      }
    }
    // Description: keep as paragraph (keep source tag if p/div)
    const descEl = contentWrapper.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If it's already a <p>, reference it, else wrap in <p>
      if (descEl.tagName.toLowerCase() === 'p') {
        content.push(descEl);
      } else {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        content.push(p);
      }
    }
    // CTA link: reference existing <a>
    const ctaEl = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      content.push(ctaEl);
    }
  }

  // --- 4. BUILD FINAL TABLE ARRAY ---
  // Cells: header row [block name], then one slide row [image, text content]
  // Image and text content are each wrapped in their respective cells
  const cells = [
    header,
    [imgEl, content]
  ];

  // --- 5. CREATE BLOCK TABLE ---
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- 6. REPLACE ORIGINAL ELEMENT ---
  element.replaceWith(block);
}
