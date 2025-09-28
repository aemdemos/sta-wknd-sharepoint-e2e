/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    const img = item.querySelector('img');
    return img || '';
  }

  // Helper to extract text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    const texts = [];
    item.querySelectorAll(':scope > *:not(.image)').forEach((el) => {
      if (el.textContent && el.textContent.trim()) {
        if (/^h[1-6]$/i.test(el.tagName)) {
          const h = document.createElement('h2');
          h.textContent = el.textContent.trim();
          texts.push(h);
        } else if (el.tagName === 'P') {
          const p = document.createElement('p');
          p.textContent = el.textContent.trim();
          texts.push(p);
        } else {
          texts.push(el.textContent.trim());
        }
      }
    });
    return texts.length ? texts : null;
  }

  // Find the carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build the table rows
  const headerRow = ['Carousel (carousel34)']; // exactly one column in header
  const rows = [headerRow];

  items.forEach((item) => {
    const img = getImageFromItem(item);
    const textContent = getTextContentFromItem(item);
    // Always push two columns per row (image, text content), but if no text, use empty string
    rows.push([img, textContent ? textContent : '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
