/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Carousel (carousel15)'];

  // Select the carousel
  const carousel = element.querySelector('[class*="cmp-carousel"]');
  if (!carousel) return;
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;

  // Gather all slides
  const slides = Array.from(slidesContainer.querySelectorAll('.cmp-carousel__item'));
  const rows = slides.map((slide) => {
    // 1. Image: find the first <img> in the slide
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // 2. Text: gather ALL content not inside image containers
    let textCell = '';
    // Find all descendants of slide that are NOT within a .image or .cmp-image container
    const imageContainers = Array.from(slide.querySelectorAll('.image, .cmp-image'));
    // Use a TreeWalker to collect text-relevant elements outside image containers
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        // Ignore descendants of image containers
        if (imageContainers.some(ic => ic.contains(node))) return NodeFilter.FILTER_REJECT;
        // Ignore the slide root node itself (we want descendants)
        if (node === slide) return NodeFilter.FILTER_SKIP;
        // Accept elements and non-empty text nodes only
        if (node.nodeType === 3 && node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
        if (node.nodeType === 1 && node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      }
    });
    const textNodes = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode.nodeType === 3) {
        // Text node: wrap in <p> for semantic meaning
        const p = document.createElement('p');
        p.textContent = currentNode.textContent.trim();
        textNodes.push(p);
      } else {
        textNodes.push(currentNode);
      }
      currentNode = walker.nextNode();
    }
    if (textNodes.length > 0) {
      textCell = textNodes.length === 1 ? textNodes[0] : textNodes;
    }

    return [imageCell, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
