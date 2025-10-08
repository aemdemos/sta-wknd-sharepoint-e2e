/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: single cell as per guidelines
  const headerRow = ['Carousel (carousel6)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Select all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
  if (items.length === 0) return;

  // Helper to extract image from teaser
  function getImage(teaser) {
    const img = teaser.querySelector('.cmp-teaser__image img');
    return img || document.createTextNode('');
  }

  // Helper to extract text content from teaser
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
      Array.from(desc.childNodes).forEach((node) => {
        content.appendChild(node.cloneNode(true));
      });
    }
    // CTA
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      const div = document.createElement('div');
      div.appendChild(cta);
      content.appendChild(div);
    }
    return content.childNodes.length ? content : document.createTextNode('');
  }

  // Build rows for each slide
  const rows = items.map((item) => {
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return [document.createTextNode(''), document.createTextNode('')];
    const img = getImage(teaser);
    const textContent = getTextContent(teaser);
    return [img, textContent];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
