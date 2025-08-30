/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row exactly as required
  const headerRow = ['Accordion (accordion17)'];

  // Find the most likely main content area (the main block containing the article)
  let mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainContent) {
    // If not exactly present, fallback to the deepest main element
    const mains = element.querySelectorAll('main');
    if (mains.length > 1) {
      mainContent = mains[mains.length - 1];
    } else if (mains.length === 1) {
      mainContent = mains[0];
    }
  }
  if (!mainContent) return;

  // Locate the article/content fragment
  let cf = mainContent.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!cf) cf = mainContent.querySelector('article');
  if (!cf) return;

  // Get the element containing the content sections
  let cfBody = cf.querySelector('.cmp-contentfragment__elements') || cf;
  // Prepare an array of all content nodes in order
  let nodes = [];
  // Some children may be divs containing further grids, so flatten a level
  cfBody.childNodes.forEach((node) => {
    // If it's a div with only one child that is a heading, flatten
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName === 'DIV' &&
      node.childNodes.length === 1 &&
      node.firstElementChild &&
      /^H[1-6]$/.test(node.firstElementChild.tagName)
    ) {
      nodes.push(node.firstElementChild);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('cmp-title')) {
      // or, .cmp-title containing a heading
      const heading = node.querySelector('h1, h2, h3, h4, h5, h6, .cmp-title__text');
      if (heading) {
        nodes.push(heading);
      }
    } else {
      nodes.push(node);
    }
  });
  // Remove empty text nodes
  nodes = nodes.filter(n => !((n.nodeType === Node.TEXT_NODE && !n.textContent.trim())));

  // Helper for detecting accordion titles
  function isTitle(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
    if (/^H[2-4]$/.test(node.tagName)) return true;
    if (node.classList.contains('cmp-title__text')) return true;
    return false;
  }

  // Extract accordion rows: [title, content]
  const rows = [];
  let currTitle = null;
  let currContent = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    // Ignore empty text node
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) continue;
    if (isTitle(node)) {
      if (currTitle) {
        // Only add if we have a title
        const filteredContent = currContent.filter(n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
        // Always keep as array unless just one item
        rows.push([
          currTitle,
          filteredContent.length === 1 ? filteredContent[0] : filteredContent
        ]);
      }
      currTitle = node;
      currContent = [];
    } else {
      currContent.push(node);
    }
  }
  // Push final
  if (currTitle) {
    const filteredContent = currContent.filter(n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
    rows.push([
      currTitle,
      filteredContent.length === 1 ? filteredContent[0] : filteredContent
    ]);
  }

  if (!rows.length) return;

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  mainContent.replaceWith(table);
}
