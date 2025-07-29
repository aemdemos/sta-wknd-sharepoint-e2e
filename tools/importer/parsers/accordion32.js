/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment block (main article body)
  const contentFragment = element.querySelector('.contentfragment .cmp-contentfragment');
  if (!contentFragment) return;

  // Table header row, exactly as in the example
  const headerRow = ['Accordion (accordion32)'];
  const accordionRows = [];

  // Get the <h3> title at the very top (main article title)
  const mainTitleEl = contentFragment.querySelector('h3.cmp-contentfragment__title');
  const mainTitle = mainTitleEl ? mainTitleEl.textContent.trim() : 'Section';

  // The area with all the content and section titles
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Helper: recursively flatten children of a node (esp. .aem-Grid, .aem-GridColumn wrappers)
  function flattenNodes(nodes) {
    const out = [];
    nodes.forEach(node => {
      if (node.nodeType === 1 && (node.classList.contains('aem-Grid') || node.classList.contains('aem-GridColumn'))) {
        out.push(...flattenNodes(Array.from(node.childNodes)));
      } else {
        out.push(node);
      }
    });
    return out;
  }

  // Get a flat list of children
  const flatNodes = flattenNodes(Array.from(elementsContainer.childNodes));

  // Now, split content into sections at <div.title> containing <h2.cmp-title__text>
  let sections = [];
  let currentTitle = mainTitle;
  let currentContent = [];
  let firstSection = true;

  flatNodes.forEach(node => {
    if (
      node.nodeType === 1 &&
      node.classList.contains('title') &&
      node.querySelector('h2.cmp-title__text')
    ) {
      // Found a section divider
      if (firstSection && currentContent.length === 0) {
        // The very first section -- start accumulating its content
        firstSection = false;
      } else {
        // Push the previous section (if any)
        if (currentContent.length > 0) {
          accordionRows.push([
            currentTitle,
            currentContent.length === 1 ? currentContent[0] : currentContent.slice()
          ]);
        }
        currentContent = [];
      }
      // Set new title from h2
      currentTitle = node.querySelector('h2.cmp-title__text').textContent.trim();
    } else {
      // Only keep nodes with meaningful content
      if (
        (node.nodeType === 1 && (node.tagName !== 'DIV' || node.querySelector('img,blockquote,p,hr,h4'))) ||
        (node.nodeType === 3 && node.textContent.trim())
      ) {
        currentContent.push(node);
      }
    }
  });

  // Push the last section (if any)
  if (currentContent.length > 0) {
    accordionRows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent.slice()
    ]);
  }

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...accordionRows
  ], document);

  // Replace the contentfragment with the new accordion table
  contentFragment.replaceWith(table);
}
