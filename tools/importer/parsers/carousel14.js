/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    // Find the first <img> within the item
    const img = item.querySelector('img');
    return img || '';
  }

  // Helper to extract the text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    // Try to find any text content inside the item, excluding images and navigation
    // Look for headings, paragraphs, and links
    const textFragments = [];
    item.querySelectorAll(':scope > *:not(.image):not(.cmp-carousel__actions):not(.cmp-carousel__indicators)').forEach((el) => {
      if (el.matches('h1,h2,h3,h4,h5,h6,p,a')) {
        textFragments.push(el.cloneNode(true));
      } else if (el.textContent && el.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = el.textContent.trim();
        textFragments.push(p);
      }
    });
    if (textFragments.length === 0) return undefined;
    if (textFragments.length === 1) return textFragments[0];
    const frag = document.createDocumentFragment();
    textFragments.forEach((el) => frag.appendChild(el));
    return frag;
  }

  // Find the main carousel container (the one with class 'cmp-carousel')
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the content container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Build the table rows
  const headerRow = ['Carousel (carousel14)'];
  const rows = [headerRow];

  items.forEach((item) => {
    const img = getImageFromItem(item);
    const textContent = getTextContentFromItem(item);
    // Only include the second cell if there is text content
    if (typeof textContent !== 'undefined') {
      rows.push([img, textContent]);
    } else {
      rows.push([img]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
