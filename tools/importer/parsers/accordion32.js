/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const article = element.querySelector('article.contentfragment');
  if (!article) return;

  // Accordion block header row
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // Find all h2 section titles (accordion items)
  const sectionTitles = article.querySelectorAll('h2.cmp-title__text');

  sectionTitles.forEach((titleEl, idx) => {
    // Title cell: reference the heading element
    const titleCell = titleEl;
    // Content cell: collect all nodes between this h2 and the next h2
    let contentNodes = [];
    let node = titleEl.parentElement.parentElement.nextElementSibling;
    while (node) {
      // If this node contains the next h2, stop
      if (node.querySelector && node.querySelector('h2.cmp-title__text')) break;
      // If node is a .cmp-title, skip
      if (node.classList && node.classList.contains('cmp-title')) {
        node = node.nextElementSibling;
        continue;
      }
      // If it's a grid wrapper, descend into its children
      if (node.classList && node.classList.contains('aem-Grid')) {
        Array.from(node.children).forEach(child => {
          if (child.textContent.trim() || child.querySelector('img')) {
            contentNodes.push(child);
          }
        });
      } else {
        if (node.textContent.trim() || node.querySelector('img')) {
          contentNodes.push(node);
        }
      }
      node = node.nextElementSibling;
    }
    // If no content found, try to find all following <p> and <div> until next h2
    if (contentNodes.length === 0) {
      let fallback = titleEl.parentElement.parentElement.nextElementSibling;
      while (fallback) {
        if (fallback.querySelector && fallback.querySelector('h2.cmp-title__text')) break;
        if (
          (fallback.tagName === 'P' || fallback.tagName === 'DIV') &&
          fallback.textContent.trim()
        ) {
          contentNodes.push(fallback);
        }
        fallback = fallback.nextElementSibling;
      }
    }
    // Only add row if there is actual content in contentNodes
    if (contentNodes.length > 0) {
      rows.push([titleCell, contentNodes]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
