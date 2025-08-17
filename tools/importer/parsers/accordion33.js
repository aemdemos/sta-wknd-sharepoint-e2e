/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per example
  const headerRow = ['Accordion (accordion33)'];

  // Find the contentfragment article which contains the accordion data
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;
  // Find the contentfragment elements container
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We want to extract all H2s and the content between them for the accordion
  const accordionRows = [];
  let currentTitle = null;
  let currentContent = [];
  // Go through all children of cmp-contentfragment__elements
  const nodes = Array.from(cfElements.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2') {
      if (currentTitle) {
        // Add previous section
        accordionRows.push([
          currentTitle,
          currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
        ]);
      }
      currentTitle = node;
      currentContent = [];
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.tagName === 'P' || node.classList.contains('aem-Grid'))
    ) {
      // aem-Grid may contain image only
      if (node.classList.contains('aem-Grid')) {
        const image = node.querySelector('.cmp-image');
        if (image) currentContent.push(image);
      } else {
        currentContent.push(node);
      }
    }
  });
  // Add the last section if present
  if (currentTitle) {
    accordionRows.push([
      currentTitle,
      currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
    ]);
  }

  if (accordionRows.length === 0) return;

  // Compose the table
  const tableRows = [headerRow, ...accordionRows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
