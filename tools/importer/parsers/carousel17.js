/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Carousel (carousel17)'];
  const rows = [];

  // Find the .cmp-carousel inside the block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides (items)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  slides.forEach(slide => {
    // First cell: image. Look for first <img> descendant of slide.
    const img = slide.querySelector('img');

    // Second cell: all non-image, non-.image content
    let textNodes = [];
    // All descendants of the slide that are not inside .image
    Array.from(slide.childNodes).forEach(node => {
      // If it's an element and not inside .image, or a text node with nontrivial text
      if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('image')) {
        textNodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textNodes.push(document.createTextNode(node.textContent));
      }
    });
    // Also, check for deeply nested text nodes/elements not in .image
    // We'll use a TreeWalker to gather all non-.image descendants
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip any node that is inside .image (unless it's .image itself)
        let current = node.parentNode;
        while(current && current !== slide) {
          if(current.classList && current.classList.contains('image')) return NodeFilter.FILTER_REJECT;
          current = current.parentNode;
        }
        // Only accept text nodes with real content and elements (except .image)
        if(node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
        if(node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('image')) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      }
    });
    let deepNodes = [];
    let wnode = walker.nextNode();
    while(wnode) {
      // Only add if not already in textNodes
      if (!textNodes.includes(wnode)) {
        deepNodes.push(wnode);
      }
      wnode = walker.nextNode();
    }
    // Remove duplicate nodes
    const allTextNodes = [...textNodes, ...deepNodes];
    // If only one, put as is, else build fragment
    let textCell = '';
    if (allTextNodes.length === 1) {
      textCell = allTextNodes[0];
    } else if (allTextNodes.length > 1) {
      const frag = document.createDocumentFragment();
      allTextNodes.forEach(n => frag.appendChild(n));
      textCell = frag;
    }

    rows.push([img, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
