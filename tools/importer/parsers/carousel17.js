/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image element inside the slide
    let imgEl = null;
    const imageWrapper = item.querySelector('.image');
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    if (!imgEl) return;

    // Try to find any text content in the slide (e.g., headings, paragraphs, links)
    // Look for direct children after the image wrapper
    let textContent = '';
    // Get all elements except the image wrapper
    const slideChildren = Array.from(item.children).filter(child => !child.classList.contains('image'));
    if (slideChildren.length > 0) {
      // Create a fragment to hold all text elements
      const frag = document.createElement('div');
      slideChildren.forEach(child => frag.appendChild(child.cloneNode(true)));
      textContent = frag;
    }

    // Always provide two columns: image and text cell (even if text is empty)
    rows.push([imgEl, textContent]);
  });

  // Ensure all rows after header have exactly two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
