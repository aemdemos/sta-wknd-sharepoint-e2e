/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageEl(item) {
    // Find the teaser image container
    const imgContainer = item.querySelector('.cmp-teaser__image');
    if (!imgContainer) return null;
    // Find the actual <img> inside
    const img = imgContainer.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content (title, description, CTA) from a carousel item
  function getTextContentEl(item) {
    const content = document.createElement('div');
    // Title
    const title = item.querySelector('.cmp-teaser__title');
    if (title) {
      // Use h2 as is, but remove classes
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      content.appendChild(h);
    }
    // Description
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      // Clone the description node (may contain <p> etc)
      Array.from(desc.childNodes).forEach((node) => {
        content.appendChild(node.cloneNode(true));
      });
    }
    // CTA
    const cta = item.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Use as is, but remove classes
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      content.appendChild(a);
    }
    // If nothing was appended, return null
    return content.childNodes.length > 0 ? content : null;
  }

  // Find the carousel content wrapper
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Gather all carousel items
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel23)'];
  rows.push(headerRow);

  // For each slide/item, extract image and text content
  items.forEach((item) => {
    // Each item contains a .cmp-teaser
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;
    // Image cell
    const img = getImageEl(teaser);
    // Text cell
    const textContent = getTextContentEl(teaser);
    // Only add row if image exists (image is mandatory)
    if (img) {
      const row = [img, textContent || ''];
      rows.push(row);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
