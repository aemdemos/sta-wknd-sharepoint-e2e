/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the <img> element from within .cmp-teaser__image
  function getImageElement(el) {
    const imageWrap = el.querySelector('.cmp-teaser__image');
    if (imageWrap) {
      const img = imageWrap.querySelector('img');
      return img || '';
    }
    return '';
  }

  // Helper: get the text content block for the teaser slide
  function getTextCellContent(el) {
    const content = el.querySelector('.cmp-teaser__content');
    if (!content) return '';
    const nodes = [];
    // Pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = pretitle.textContent.trim();
      nodes.push(p);
    }
    // Title (as heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      nodes.push(h2);
    }
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      nodes.push(p);
    }
    // CTA (optional)
    const action = content.querySelector('.cmp-teaser__action-link');
    if (action && action.textContent.trim()) {
      const cta = document.createElement('p');
      cta.appendChild(action); // Use the original element
      nodes.push(cta);
    }
    return nodes.length ? nodes : '';
  }

  // Build the table as specified
  const cells = [];
  // Header row - exact match
  cells.push(['Carousel (carousel40)']);

  // Slide rows
  // In this HTML example, there is only one "slide"
  const imgEl = getImageElement(element);
  const textContent = getTextCellContent(element);
  cells.push([
    imgEl,
    textContent
  ]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
