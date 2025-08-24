/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel') || element;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const cells = [];
  // Table header EXACTLY as in example
  cells.push(['Carousel (carousel14)']);

  // Find all slides
  const slides = Array.from(content.children).filter(child => child.classList && child.classList.contains('cmp-carousel__item'));
  slides.forEach((slide) => {
    // Find the image element (mandatory)
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // Collect all text content except images
    // Look for all elements except image wrappers
    // To be as flexible as possible, we want ANY text except image
    // Construct a container for text content found inside the slide
    const textElements = [];
    // Use a TreeWalker to process all descendants except <img> or elements containing <img>
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        if (node.tagName === 'IMG') return NodeFilter.FILTER_REJECT;
        if (node.querySelector && node.querySelector('img')) return NodeFilter.FILTER_REJECT;
        // Only accept if the element contains textual content
        if (node.textContent && node.textContent.trim().length > 0) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      }
    });
    let node = walker.nextNode();
    while (node) {
      textElements.push(node);
      node = walker.nextNode();
    }
    // Also include any top-level text nodes that aren't just whitespace
    Array.from(slide.childNodes).forEach(n => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = n.textContent.trim();
        textElements.push(span);
      }
    });

    // If there is any text content, create a second cell; otherwise only image
    if (textElements.length > 0) {
      cells.push([imageCell, textElements]);
    } else {
      cells.push([imageCell]);
    }
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
