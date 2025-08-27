/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Carousel (carousel22)'];

  // Find the inner carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide = .cmp-carousel__item
  const slides = [...content.querySelectorAll(':scope > .cmp-carousel__item')];

  const rows = slides.map((slide) => {
    // 1. Image: find the <img> in the slide (mandatory)
    const img = slide.querySelector('.cmp-teaser__image img');

    // 2. Text content (title, desc, CTA)
    const contentCell = document.createElement('div');
    let hasContent = false;

    // Title (can be missing)
    const title = slide.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim() !== '') {
      // Use the same heading element from the document, not a clone
      contentCell.appendChild(title);
      hasContent = true;
    }

    // Description (can be missing)
    const desc = slide.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim() !== '') {
      // If description contains block elements (like <p>), move all children; else, move as text
      if (desc.children.length > 0) {
        [...desc.children].forEach(child => contentCell.appendChild(child));
      } else {
        // wrap text in a <p> for consistency
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCell.appendChild(p);
      }
      hasContent = true;
    }

    // CTA(s) (can be missing)
    const actionContainer = slide.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const ctas = Array.from(actionContainer.querySelectorAll('a'));
      ctas.forEach((a, idx) => {
        // Ensure we reference the link from the DOM (move, not clone)
        if (hasContent) contentCell.appendChild(document.createElement('br'));
        contentCell.appendChild(a);
        hasContent = true;
      });
    }

    // If no content, set empty string for the cell
    return [img, hasContent ? contentCell : ''];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
