/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment article
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Get the contentfragment elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Helper: flatten grids and collect all relevant blocks
  function flattenContent(nodes) {
    const out = [];
    nodes.forEach(node => {
      if (node.nodeType === 1 && node.classList.contains('aem-Grid')) {
        out.push(...flattenContent(Array.from(node.children)));
      } else if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        out.push(node);
      }
    });
    return out;
  }

  // Collect all content nodes (including after .cmp-contentfragment__elements)
  let nodes = flattenContent(Array.from(elementsContainer.childNodes));
  let sibling = elementsContainer.nextSibling;
  while (sibling) {
    if (sibling.nodeType === 1 || (sibling.nodeType === 3 && sibling.textContent.trim())) {
      nodes.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  // Find all h2.cmp-title__text nodes to split sections
  const sections = [];
  let currentTitle = null;
  let currentContent = [];

  // For intro: gather all content before first h2.cmp-title__text
  let i = 0;
  for (; i < nodes.length; i++) {
    const node = nodes[i];
    const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) {
      break;
    } else {
      // Only add non-empty content
      if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img, blockquote, p'))) {
        currentContent.push(node);
      }
    }
  }
  if (currentContent.length) {
    // Use main title as label for intro section
    const mainTitle = element.querySelector('.cmp-title h1.cmp-title__text');
    sections.push({ title: mainTitle ? mainTitle : document.createElement('span'), content: currentContent.slice() });
  }

  // Now process the rest for each accordion section
  currentContent = [];
  for (; i < nodes.length; i++) {
    const node = nodes[i];
    const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) {
      // If we have a previous section, push it
      if (currentTitle && currentContent.length) {
        sections.push({ title: currentTitle, content: currentContent.slice() });
      }
      currentTitle = h2;
      currentContent = [];
    } else {
      if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img, blockquote, p'))) {
        currentContent.push(node);
      }
    }
  }
  // Push last section
  if (currentTitle && currentContent.length) {
    sections.push({ title: currentTitle, content: currentContent.slice() });
  }

  // Build table rows
  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];
  sections.forEach(section => {
    // Defensive: skip empty content
    if (!section.content.length) return;
    let titleCell = section.title;
    let contentCell = section.content.length === 1 ? section.content[0] : section.content;
    rows.push([titleCell, contentCell]);
  });

  // Only output rows with non-empty content
  if (rows.length === 1) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
