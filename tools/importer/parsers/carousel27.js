/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const cells = [
    ['Carousel (carousel27)']
  ];

  // Find the main .cmp-teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- IMAGE ---
  // Find image in .cmp-teaser__image (first cell)
  let imgEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }
  if (!imgEl) return;

  // --- TEXT (second cell) ---
  // Compose a container for text content
  const textFragment = document.createDocumentFragment();

  // Title (if present)
  const title = teaser.querySelector('.cmp-teaser__title');
  if (title) {
    // Use the existing element but ensure it's an <h2>
    // If not, create a new h2 and transfer textContent
    const isH2 = title.tagName.toLowerCase() === 'h2';
    let h2;
    if (isH2) {
      h2 = title;
    } else {
      h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
    }
    textFragment.appendChild(h2);
  }

  // Description (if present)
  const desc = teaser.querySelector('.cmp-teaser__description');
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    textFragment.appendChild(p);
  }

  // CTA link (if present)
  const cta = teaser.querySelector('.cmp-teaser__action-link');
  if (cta) {
    // Place CTA in its own div, as in original structure
    const ctaDiv = document.createElement('div');
    ctaDiv.appendChild(cta);
    textFragment.appendChild(ctaDiv);
  }

  // Add row: [ image, text content ]
  cells.push([
    imgEl,
    textFragment
  ]);

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
