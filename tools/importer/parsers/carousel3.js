/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a teaser
  function getImage(teaser) {
    // Find the image inside the teaser
    const img = teaser.querySelector('.cmp-teaser__image img');
    return img;
  }

  // Helper to extract the text content (title, description, CTA) from a teaser
  function getTextContent(teaser) {
    const content = document.createElement('div');
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      content.appendChild(h);
    }
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description contains block elements, preserve them
      if (desc.children.length > 0) {
        Array.from(desc.childNodes).forEach((node) => {
          content.appendChild(node.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        content.appendChild(p);
      }
    }
    // CTA
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Place CTA at the bottom
      const ctaDiv = document.createElement('div');
      ctaDiv.appendChild(cta);
      content.appendChild(ctaDiv);
    }
    return content.childNodes.length > 0 ? content : null;
  }

  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.cmp-carousel__item');

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Carousel (carousel3)']);

  slides.forEach((slide) => {
    // Each slide contains a .teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;
    // First cell: image
    const img = getImage(teaser);
    // Second cell: text content (title, desc, cta)
    const textContent = getTextContent(teaser);
    rows.push([
      img || '',
      textContent || '',
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
