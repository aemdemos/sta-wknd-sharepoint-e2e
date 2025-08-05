/* global WebImporter */
export default function parse(element, { document }) {
  // The accordion block header row
  const headerRow = ['Accordion (accordion33)'];

  // Find the main contentfragment
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We need to extract all accordion sections: each section starts with a .title.cmp-title--underline (h2),
  // and the content is all following nodes until the next such title, or end of container.

  // We'll use childNodes to ensure we get all content, including stray text nodes or paragraphs.
  const nodes = Array.from(elementsContainer.childNodes);
  const rows = [];
  let currentTitle = null;
  let currentContent = [];

  function pushRow() {
    if (currentTitle && currentContent.length) {
      // Use single element if only one, else array
      const row = [currentTitle, currentContent.length === 1 ? currentContent[0] : currentContent.slice()];
      rows.push(row);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    // Is this a section heading (title)
    if (
      node.nodeType === 1 &&
      node.classList &&
      node.classList.contains('title') &&
      node.classList.contains('cmp-title--underline') &&
      node.querySelector('h2.cmp-title__text')
    ) {
      // Save the previous row
      pushRow();
      // Start new row
      currentTitle = node.querySelector('h2.cmp-title__text');
      currentContent = [];
    } else {
      // If there's an open section, gather content
      if (currentTitle) {
        // Skip empty grid wrappers (sometimes AEM outputs those)
        if (
          node.nodeType === 1 &&
          node.classList &&
          node.classList.contains('aem-Grid') &&
          node.children.length === 0
        ) {
          continue;
        }
        // Capture text (text nodes)
        if (node.nodeType === 3) {
          if (node.textContent.trim()) {
            currentContent.push(document.createTextNode(node.textContent));
          }
        } else if (node.nodeType === 1) {
          // Only include elements with meaningful content (avoid empty divs)
          if (
            node.tagName === 'DIV' &&
            node.childNodes.length === 0
          ) {
            continue;
          }
          currentContent.push(node);
        }
      }
    }
  }
  // Push the last row (if any)
  pushRow();

  // Only build accordion if rows found
  if (!rows.length) return;

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  contentFragment.replaceWith(table);
}
