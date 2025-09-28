/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all h2s and their content until the next h2
  function getAccordionSections(root) {
    const sections = [];
    const h2s = Array.from(root.querySelectorAll('h2.cmp-title__text'));
    h2s.forEach((h2) => {
      // Title cell is the h2 itself
      const titleCell = h2;
      // Find all nodes after h2's .cmp-title up to the next h2.cmp-title__text
      const contentParts = [];
      let node = h2.parentElement.parentElement.nextSibling;
      while (node) {
        // Stop if next h2.cmp-title__text is encountered
        if (node.nodeType === 1 && node.querySelector && node.querySelector('h2.cmp-title__text')) {
          break;
        }
        // Only add element nodes
        if (node.nodeType === 1) {
          // Skip empty .aem-Grid
          if (node.classList.contains('aem-Grid') && node.children.length === 0) {
            node = node.nextSibling;
            continue;
          }
          // If .aem-Grid, flatten its children
          if (node.classList.contains('aem-Grid')) {
            Array.from(node.children).forEach(child => contentParts.push(child));
          } else {
            contentParts.push(node);
          }
        }
        node = node.nextSibling;
      }
      // If no contentParts, fallback to next <p> after .cmp-title
      if (contentParts.length === 0) {
        let fallback = h2.parentElement.parentElement.nextElementSibling;
        while (fallback && fallback.tagName !== 'P') {
          fallback = fallback.nextElementSibling;
        }
        if (fallback && fallback.tagName === 'P') {
          contentParts.push(fallback);
        }
      }
      // Remove empty content cells (do not push empty cell)
      if (contentParts.length === 0) return;
      sections.push([titleCell, contentParts]);
    });
    return sections;
  }

  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Build the table rows
  const headerRow = ['Accordion (accordion9)'];
  const rows = [headerRow];

  // Get accordion sections (h2 + content)
  const accordionSections = getAccordionSections(contentFragment);

  // Add each accordion section as a row (always 2 columns, but skip if content is missing)
  accordionSections.forEach(([titleEl, contentEls]) => {
    rows.push([titleEl, contentEls]);
  });

  // Only output if there is at least one accordion row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
