/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the specification
  const headerRow = ['Accordion (accordion33)'];

  // Find the content fragment block that contains the accordion content
  const cfElements = element.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Convert NodeList to an array for easier processing, keeping both text and element nodes
  const nodes = Array.from(cfElements.childNodes).filter(node => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    return false;
  });

  // Find the start of the accordion items (the first H2)
  let i = nodes.findIndex(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2');
  if (i < 0) return;

  const rows = [headerRow];

  while (i < nodes.length) {
    // The title for each accordion section is always an H2
    if (nodes[i].nodeType === Node.ELEMENT_NODE && nodes[i].tagName === 'H2') {
      const titleEl = nodes[i];
      i++;
      const contentEls = [];
      // Collect all nodes until the next H2 (or end of content)
      while (i < nodes.length && !(nodes[i].nodeType === Node.ELEMENT_NODE && nodes[i].tagName === 'H2')) {
        if (nodes[i].nodeType === Node.TEXT_NODE && nodes[i].textContent.trim().length > 0) {
          // Wrap orphaned text nodes in a <p> to preserve formatting
          const p = document.createElement('p');
          p.textContent = nodes[i].textContent.trim();
          contentEls.push(p);
        } else if (nodes[i].nodeType === Node.ELEMENT_NODE) {
          contentEls.push(nodes[i]);
        }
        i++;
      }
      // Remove empty elements
      const filteredContent = contentEls.filter(el => {
        if (el.nodeType === Node.TEXT_NODE) return el.textContent.trim().length > 0;
        if (el.nodeType === Node.ELEMENT_NODE) {
          // Keep if it has text or images
          return el.textContent.trim().length > 0 || el.querySelector('img');
        }
        return false;
      });
      // Accordion row: [title, content (single element or array)]
      rows.push([
        titleEl,
        filteredContent.length === 1 ? filteredContent[0] : filteredContent
      ]);
    } else {
      i++;
    }
  }
  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
