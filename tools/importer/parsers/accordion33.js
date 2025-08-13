/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment (the main article)
  const contentFragment = element.querySelector('article.contentfragment, .contentfragment');
  if (!contentFragment) return;
  // Find the main content container with all headings/paragraphs/images
  const contentElementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements > div');
  if (!contentElementsContainer) return;

  // Get all child nodes of the content container
  const nodes = Array.from(contentElementsContainer.childNodes);

  // Prepare table rows: header first
  const rows = [['Accordion (accordion33)', '']];

  let currentTitle = null;
  let currentContent = [];

  const pushSection = () => {
    if (currentTitle && currentContent.length) {
      // Use the first h2 as the title, and everything after as content
      rows.push([
        currentTitle,
        currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
      ]);
    }
    currentTitle = null;
    currentContent = [];
  };

  // Helper checks
  const isH2 = (node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2';
  const isEmptyGrid = (node) => node.nodeType === Node.ELEMENT_NODE &&
    node.classList && node.classList.contains('aem-Grid') && node.children.length === 0;

  // Traverse node list in order
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isH2(node)) {
      pushSection();
      currentTitle = node;
    } else {
      // Skip empty grid wrappers
      if (isEmptyGrid(node)) continue;
      // If this is a grid with children (e.g. images in section), include its children as content
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList &&
        node.classList.contains('aem-Grid') &&
        node.children.length > 0
      ) {
        // Add all children (often image containers)
        Array.from(node.children).forEach(child => currentContent.push(child));
      } else {
        // Otherwise, if not a whitespace node, add directly
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') continue;
        currentContent.push(node);
      }
    }
  }
  // Push last section
  pushSection();

  // Only create the block if there is at least one accordion entry
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
