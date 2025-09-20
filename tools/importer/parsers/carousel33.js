/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the slide image element from a carousel item
  function getImageFromItem(item) {
    // Find the first <img> inside this item
    const img = item.querySelector('img');
    return img || null;
  }

  // Helper to extract all text content from a carousel item (flexible)
  function getTextContentFromItem(item) {
    // Collect all direct children except the image container
    const fragments = [];
    const imageContainer = item.querySelector('.image');
    Array.from(item.children).forEach((child) => {
      if (child !== imageContainer) {
        fragments.push(child.cloneNode(true));
      }
    });
    // If nothing found, try to get text from imageContainer siblings
    if (!fragments.length && imageContainer) {
      let sib = imageContainer.nextSibling;
      while (sib) {
        if (sib.nodeType === 1) fragments.push(sib.cloneNode(true));
        sib = sib.nextSibling;
      }
    }
    return fragments.length ? fragments : '';
  }

  // Find the main carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!items.length) return;

  // Build the table rows
  const headerRow = ['Carousel (carousel33)'];
  const rows = [headerRow];

  items.forEach((item) => {
    const img = getImageFromItem(item);
    if (!img) return;
    const textContent = getTextContentFromItem(item);
    // Always push two columns per row, second column empty if no text
    rows.push([img, textContent !== '' ? textContent : '']);
  });

  // Ensure each data row has exactly two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) {
      rows[i].push('');
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
