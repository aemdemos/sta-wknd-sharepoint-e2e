/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all text content for a slide, robust against various structures
  function extractTextContent(slide) {
    const textContent = [];
    // Collect all headings, paragraphs, links, lists, blockquotes, etc. that are NOT part of image wrappers
    // We'll also grab non-empty text nodes
    const forbidden = new Set();
    // Mark image wrappers and their descendants as forbidden
    slide.querySelectorAll('.image, .cmp-image').forEach(wrapper => {
      forbidden.add(wrapper);
      wrapper.querySelectorAll('*').forEach(el => forbidden.add(el));
    });
    // Get all possible elements carrying text, in order
    const candidates = slide.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, li, a, span, strong, em, blockquote, div');
    candidates.forEach(node => {
      if (!forbidden.has(node)) {
        // Only add if not empty
        if (node.textContent && node.textContent.trim().length > 0) {
          textContent.push(node);
        }
      }
    });
    // Also add direct text nodes not part of any forbidden element
    Array.from(slide.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        textContent.push(document.createTextNode(node.textContent.trim()));
      }
    });
    // If no elements, return empty string
    if (textContent.length === 1) return textContent[0];
    if (textContent.length > 1) return textContent;
    return '';
  }

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  const slideRows = [];
  items.forEach((item) => {
    // First cell: the image (if any)
    let imgCell = '';
    const img = item.querySelector('img');
    if (img) imgCell = img;
    // Second cell: all text content (robustly extracted)
    let textCell = extractTextContent(item);
    slideRows.push([imgCell, textCell]);
  });

  // Build the table with header row (single header cell), then each slide row (2 cells)
  const cells = [
    ['Carousel (carousel8)'],
    ...slideRows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
