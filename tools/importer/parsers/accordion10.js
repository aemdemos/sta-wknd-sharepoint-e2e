/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main article/content container
  const mainContainer = element.querySelector('main.container > div > main.container');
  if (!mainContainer) return;

  // Find the main contentfragment article
  const contentFragment = mainContainer.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the elements container
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Accordion header row (as per block naming and example)
  const cells = [['Accordion (accordion10)']];

  // Get all direct children of cfElements
  const children = Array.from(cfElements.childNodes);

  // We'll iterate and group each accordion item by H2 headings
  let collecting = false;
  let sectionTitle = null;
  let sectionContentNodes = [];

  // Helper to check for a div containing a H2.cmp-title__text
  function isSectionTitleDiv(node) {
    return (
      node.nodeType === 1 &&
      node.tagName === 'DIV' &&
      node.querySelector('h2.cmp-title__text')
    );
  }

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (isSectionTitleDiv(node)) {
      // Save previous section if exists
      if (sectionTitle && sectionContentNodes.length > 0) {
        cells.push([sectionTitle, sectionContentNodes]);
      }
      // Start new section
      sectionTitle = node.querySelector('h2.cmp-title__text');
      sectionContentNodes = [];
      collecting = true;
    } else {
      if (collecting) {
        // Only include significant content (not empty grid divs)
        if (
          (node.nodeType === 1 && node.tagName === 'DIV' && node.classList.contains('aem-Grid') && !node.textContent.trim())
        ) {
          continue;
        }
        // if it's a text node that's just whitespace, skip
        if (node.nodeType === 3 && !node.textContent.trim()) continue;
        sectionContentNodes.push(node);
      }
    }
  }
  // Add last section if present
  if (sectionTitle && sectionContentNodes.length > 0) {
    cells.push([sectionTitle, sectionContentNodes]);
  }

  // Create accordion block and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  contentFragment.replaceWith(table);
}
