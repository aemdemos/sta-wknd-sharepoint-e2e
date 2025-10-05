/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    return item.querySelector('.cmp-image__image');
  }

  // Helper to extract the text content from a carousel item, if any
  function getTextContentFromItem(item) {
    // Look for heading and description elements
    let title = '';
    let desc = '';
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6, strong, b');
    if (heading) title = heading.textContent.trim();
    const p = item.querySelector('p');
    if (p) desc = p.textContent.trim();
    if (title && desc) {
      const frag = document.createDocumentFragment();
      const h = document.createElement('h2');
      h.textContent = title;
      frag.appendChild(h);
      const para = document.createElement('p');
      para.textContent = desc;
      frag.appendChild(para);
      return frag;
    } else if (title) {
      const h = document.createElement('h2');
      h.textContent = title;
      return h;
    } else if (desc) {
      const para = document.createElement('p');
      para.textContent = desc;
      return para;
    }
    // Otherwise, try to get any text directly under the item
    const text = item.textContent.trim();
    if (text) return text;
    return null;
  }

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel18)'];
  rows.push(headerRow);

  // Each slide: [image, text content] if text exists, otherwise [image]
  items.forEach((item) => {
    const img = getImageFromItem(item);
    if (!img) return;
    const textContent = getTextContentFromItem(item);
    if (textContent) {
      rows.push([img, textContent]);
    } else {
      rows.push([img]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
