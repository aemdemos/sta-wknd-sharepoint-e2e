/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all slides from the carousel block
  function getSlides(carouselContent) {
    // Only direct children with class 'cmp-carousel__item' are slides
    return Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract image element from a slide
  function getImage(slide) {
    // Find the first <img> inside the slide
    const img = slide.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from a slide
  function getTextContent(slide) {
    // Try to find a heading, paragraph, or any text block inside the slide
    // Look for elements that might contain text (h1-h6, p, span, etc.)
    const textBlocks = [];
    // Heading (if present)
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textBlocks.push(heading.cloneNode(true));
    }
    // Paragraphs
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => {
      textBlocks.push(p.cloneNode(true));
    });
    // Other text (if present)
    // If no heading or paragraph, try to get all text nodes
    if (textBlocks.length === 0) {
      // Get all text nodes directly under the slide
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
      });
      let node;
      while ((node = walker.nextNode())) {
        // Wrap in a <span> for consistency
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textBlocks.push(span);
      }
    }
    // If nothing found, return '' so the second column is always present
    if (textBlocks.length === 0) return '';
    // If only one block, return it; else return array
    return textBlocks.length === 1 ? textBlocks[0] : textBlocks;
  }

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  const slides = getSlides(carouselContent);
  if (slides.length === 0) return;

  // Table header row
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  // For each slide, build a row: always [image, textContent] (textContent may be empty string)
  slides.forEach((slide) => {
    const img = getImage(slide);
    if (!img) return; // Defensive: skip slide if no image
    const textContent = getTextContent(slide);
    rows.push([img, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
