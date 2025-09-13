/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate carousel items
  function getCarouselItems(carouselEl) {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    // Find the first <img> inside the item
    const img = item.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    // Try to find heading, paragraph, or any visible text content inside the item
    // Look for headings (h1-h6), paragraphs, and links
    const fragment = document.createDocumentFragment();
    // Collect headings
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) fragment.appendChild(heading.cloneNode(true));
    // Collect paragraphs
    item.querySelectorAll('p').forEach(p => {
      fragment.appendChild(p.cloneNode(true));
    });
    // Collect links (if not already inside paragraphs)
    item.querySelectorAll('a').forEach(a => {
      if (!fragment.contains(a)) {
        fragment.appendChild(a.cloneNode(true));
      }
    });
    // If fragment is empty, return null
    if (!fragment.hasChildNodes()) return null;
    return fragment;
  }

  // Find the main carousel element inside the block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel items
  const items = getCarouselItems(carousel);
  if (!items.length) return;

  // Build the table rows
  const headerRow = ['Carousel (carousel18)']; // Only one column in header row
  const rows = [headerRow];

  items.forEach((item) => {
    const img = getImageFromItem(item);
    const textContent = getTextContentFromItem(item);
    // Only include the second column if there is text content
    if (textContent) {
      rows.push([img, textContent]);
    } else {
      rows.push([img]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
