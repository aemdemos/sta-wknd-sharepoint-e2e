/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from the article content
  function getAccordionItems(articleEl) {
    // We'll look for all h2 titles (section headers) and everything up to the next h2 is its content
    const items = [];
    // Find the correct content root
    let contentRoot = articleEl.querySelector('.cmp-contentfragment__elements') || articleEl;
    // Build flat list of nodes (including nested grids/containers)
    let nodes = [];
    function flatten(node) {
      // collect useful nodes only
      if (node.nodeType !== 1) return; // only elements
      // Ignore empty grid wrappers
      if (
        (node.matches('[class*="aem-Grid"]') || node.matches('.cmp-container')) &&
        node.children.length &&
        Array.from(node.children).filter(x => x.nodeType === 1).length === 1
      ) {
        flatten(node.children[0]);
        return;
      }
      if (
        node.matches('[class*="aem-Grid"]') ||
        node.matches('.cmp-container') ||
        node.matches('.cmp-contentfragment__elements')
      ) {
        Array.from(node.children).forEach(flatten);
        return;
      }
      nodes.push(node);
    }
    Array.from(contentRoot.children).forEach(flatten);
    // Now, build accordion items
    let currentTitle = null;
    let currentContent = [];
    // To support the first section which may be before any h2, we note h3/h4 as special case
    let i = 0;
    while (i < nodes.length) {
      const node = nodes[i];
      if (node.matches && node.matches('.cmp-title h2, .cmp-title__text')) {
        // If this is a section start
        if (currentTitle) {
          // Push previous item
          items.push([
            currentTitle,
            currentContent.length === 1 ? currentContent[0] : currentContent.slice()
          ]);
        }
        // New section
        currentTitle = node;
        currentContent = [];
      } else {
        // For very first section, before any h2, try to use h3/h4/cmp-contentfragment__title as title
        if (!currentTitle && node.matches && node.matches('h3.cmp-contentfragment__title, h4.cmp-title__text')) {
          currentTitle = node;
        } else {
          currentContent.push(node);
        }
      }
      i++;
    }
    if (currentTitle) {
      items.push([
        currentTitle,
        currentContent.length === 1 ? currentContent[0] : currentContent.slice()
      ]);
    }
    return items;
  }

  // Find the article/contentfragment
  let article = element.querySelector('article.contentfragment') || element.querySelector('.cmp-contentfragment');
  if (!article) return;
  // Compose the header row exactly as the spec
  const headerRow = ['Accordion (accordion32)'];
  // Build the table rows
  const rows = getAccordionItems(article).filter(row => row[0]);
  if (!rows.length) return;
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
