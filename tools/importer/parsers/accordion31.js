/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper: Get all accordion sections (h2.cmp-title__text)
  function getAccordionSections(root) {
    const sections = [];
    const h2s = Array.from(root.querySelectorAll('h2.cmp-title__text'));
    h2s.forEach((h2) => {
      const titleDiv = h2.closest('.cmp-title');
      // Find the parent container that holds this section
      let sectionParent = titleDiv.parentElement;
      // Gather all nodes between this h2 and the next h2
      const contentNodes = [];
      let node = sectionParent.nextSibling;
      while (node) {
        // Stop at next .cmp-title containing h2.cmp-title__text
        if (node.nodeType === 1 && node.querySelector && node.querySelector('h2.cmp-title__text')) {
          break;
        }
        // Include element nodes and their children
        if (node.nodeType === 1) {
          // If it's a grid, flatten children
          if (node.classList && node.classList.contains('aem-Grid')) {
            Array.from(node.children).forEach(child => {
              contentNodes.push(child);
            });
          } else {
            contentNodes.push(node);
          }
        }
        // Include text nodes
        if (node.nodeType === 3 && node.textContent.trim() !== '') {
          contentNodes.push(document.createTextNode(node.textContent));
        }
        node = node.nextSibling;
      }
      // If no content found, try to get all <p> until next h2 (for edge cases)
      if (contentNodes.length === 0) {
        let fallbackNode = sectionParent.nextSibling;
        while (fallbackNode) {
          if (fallbackNode.nodeType === 1 && fallbackNode.querySelector && fallbackNode.querySelector('h2.cmp-title__text')) {
            break;
          }
          if (fallbackNode.nodeType === 1 && fallbackNode.tagName === 'P') {
            contentNodes.push(fallbackNode);
          }
          fallbackNode = fallbackNode.nextSibling;
        }
      }
      // If still no content, try to get all siblings until next h2
      if (contentNodes.length === 0) {
        let fallbackNode = sectionParent.nextSibling;
        while (fallbackNode) {
          if (fallbackNode.nodeType === 1 && fallbackNode.querySelector && fallbackNode.querySelector('h2.cmp-title__text')) {
            break;
          }
          if (fallbackNode.nodeType === 1) {
            contentNodes.push(fallbackNode);
          }
          fallbackNode = fallbackNode.nextSibling;
        }
      }
      // If only one node, use it directly
      let cellContent = null;
      if (contentNodes.length === 1) {
        cellContent = contentNodes[0];
      } else if (contentNodes.length > 1) {
        cellContent = contentNodes;
      } else {
        cellContent = document.createTextNode('No content available.');
      }
      sections.push({ title: h2, content: cellContent });
    });
    return sections;
  }

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Accordion (accordion31)'];
  rows.push(headerRow);

  // All accordion sections
  const sections = getAccordionSections(contentFragment);
  sections.forEach(({ title, content }) => {
    rows.push([
      title,
      content
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
