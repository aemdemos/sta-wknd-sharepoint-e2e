/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // 2. Find carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // 3. Get all slides (carousel items)
  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Each item contains a .cmp-teaser
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE (first column) ---
    // Find the teaser image (img inside .cmp-teaser__image)
    let img = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      img = teaserImage;
    }

    // --- TEXT CONTENT (second column) ---
    // Build a fragment for the text content
    const textFrag = document.createElement('div');
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      textFrag.appendChild(h2);
    }
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If the description contains block elements (e.g., <p>), clone them
      let hasBlock = false;
      Array.from(desc.childNodes).forEach((node) => {
        if (node.nodeType === 1 && ['P', 'UL', 'OL', 'DIV'].includes(node.nodeName)) {
          hasBlock = true;
        }
      });
      if (hasBlock) {
        Array.from(desc.childNodes).forEach((node) => {
          textFrag.appendChild(node.cloneNode(true));
        });
      } else if (desc.textContent.trim()) {
        // Only add as paragraph if not already block content
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textFrag.appendChild(p);
      }
    }
    // CTA (button/link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textFrag.appendChild(cta);
    }

    // Only add the text cell if it has content
    const textCell = textFrag.childNodes.length ? textFrag : '';

    // Add row: [image, text content]
    rows.push([
      img ? img : '',
      textCell
    ]);
  });

  // 4. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
