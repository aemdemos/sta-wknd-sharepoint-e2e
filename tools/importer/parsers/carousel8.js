/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Carousel (carousel8)'];

  // Get main carousel container & content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Collect all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Build table rows
  const rows = [headerRow];

  items.forEach((item) => {
    // Image cell: find first <img> inside .cmp-image or within item
    let imageCell = '';
    const img = item.querySelector('.cmp-image img') || item.querySelector('img');
    if (img) imageCell = img;

    // Text cell: should be flexible, gather any headings, paragraphs, lists, links, and non-image sections
    let textCell = '';
    const textElements = [];
    // Find all direct child nodes that are not image containers
    Array.from(item.children).forEach((child) => {
      // Only collect content NOT in the image area
      if (!child.classList.contains('cmp-image') && !child.classList.contains('image')) {
        // For each child, collect all heading, paragraph, list and link descendants
        child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,ul,ol,li,a').forEach((el) => textElements.push(el));
        // If child itself is a heading, paragraph, list, or link, include it
        if (
          /^H[1-6]$/.test(child.tagName) ||
          child.tagName === 'P' ||
          child.tagName === 'A' ||
          child.tagName === 'UL' ||
          child.tagName === 'OL' ||
          child.tagName === 'LI'
        ) {
          textElements.push(child);
        }
      }
    });
    if (textElements.length) {
      textCell = textElements;
    }
    rows.push([imageCell, textCell]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
