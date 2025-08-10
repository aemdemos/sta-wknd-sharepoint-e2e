/* global WebImporter */
export default function parse(element, { document }) {
  // Find the specific content fragment article (accordion content)
  const article = element.querySelector('article.cmp-contentfragment');
  if (!article) return;

  // Find the content root for the accordion blocks
  const elementsRoot = article.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // We'll iterate over children to group H2 (titles) and their following content (body)
  const children = Array.from(elementsRoot.children);

  const rows = [];
  let currentTitle = null;
  let currentContents = [];
  let foundFirstH2 = false;
  
  // Helper to flush an accordion row if both title and content exist
  function flushItem() {
    if (currentTitle && currentContents.length) {
      // Remove trailing empty divs
      while (
        currentContents.length &&
        currentContents[currentContents.length - 1].tagName === 'DIV' &&
        currentContents[currentContents.length - 1].innerHTML.trim() === ''
      ) {
        currentContents.pop();
      }
      // If only one node, place it directly, else as an array
      rows.push([currentTitle, currentContents.length === 1 ? currentContents[0] : currentContents]);
    }
    currentTitle = null;
    currentContents = [];
  }

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.tagName === 'H2') {
      if (foundFirstH2) {
        flushItem();
      }
      foundFirstH2 = true;
      currentTitle = node;
    } else if (foundFirstH2) {
      // Only start collecting content after the first H2 is found
      currentContents.push(node);
    }
  }
  flushItem();

  // Only create the block if we found at least one accordion row
  if (rows.length) {
    const headerRow = ['Accordion (accordion33)'];
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    article.replaceWith(table);
  }
}
