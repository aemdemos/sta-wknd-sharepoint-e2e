/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel (cmp-carousel) element inside the block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all direct slide items
  const items = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));

  // Prepare the block rows: first row is the header
  const rows = [
    ['Carousel (carousel6)']
  ];

  items.forEach(item => {
    // Each slide is a cmp-carousel__item
    // Image is inside .cmp-teaser__image img (mandatory)
    // Text is composed of title, description, and CTA
    
    const teaser = item.querySelector('.teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    let imageCell = '';
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    const textCellElements = [];
    const teaserContent = teaser.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (Heading)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        // Use an h2 to preserve heading semantics
        const h2 = document.createElement('h2');
        h2.innerHTML = title.innerHTML;
        textCellElements.push(h2);
      }
      // Description (may be a div or p)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        // If only text, wrap in <p>
        if (desc.children.length === 0) {
          const p = document.createElement('p');
          p.innerHTML = desc.innerHTML.trim();
          textCellElements.push(p);
        } else {
          // Otherwise add child elements as-is
          Array.from(desc.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              textCellElements.push(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length) {
              const p = document.createElement('p');
              p.textContent = node.textContent.trim();
              textCellElements.push(p);
            }
          });
        }
      }
      // CTA (Call To Action) link
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) {
        // Reference the existing anchor
        const ctaPara = document.createElement('p');
        ctaPara.appendChild(cta);
        textCellElements.push(ctaPara);
      }
    }
    // If no text, leave cell empty string
    rows.push([
      imageCell || '',
      textCellElements.length === 0
        ? ''
        : (textCellElements.length === 1 ? textCellElements[0] : textCellElements)
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
