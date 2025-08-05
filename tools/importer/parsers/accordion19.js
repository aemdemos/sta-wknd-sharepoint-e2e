/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content area which includes the accordion sections
  // The structure is: main > div.cmp-container > main > div.cmp-container
  let mainContainers = element.querySelectorAll('main.container > div.cmp-container > main.container > div.cmp-container');
  let mainContainer = mainContainers.length ? mainContainers[0] : null;
  if (!mainContainer) return;

  // The content fragment section
  const cf = mainContainer.querySelector('.cmp-contentfragment__elements');
  if (!cf) return;

  // All <h2 class="cmp-title__text"> are section headers for accordion items
  const h2Arr = Array.from(cf.querySelectorAll('h2.cmp-title__text'));
  if (!h2Arr.length) return;

  // Prepare table rows: header + one for each accordion item
  const rows = [];
  // Block header row exactly as required
  rows.push(['Accordion (accordion19)']);

  // For each h2, extract accordion title (the h2) and all content up to next h2
  for (let i = 0; i < h2Arr.length; i++) {
    const h2 = h2Arr[i];
    const startParent = h2.parentElement;
    // Find the parent .cmp-contentfragment__elements to traverse siblings
    // Gather everything after h2's parent up to (not including) next h2's parent
    const siblings = [];
    let node = startParent.nextElementSibling;
    let nextH2 = h2Arr[i + 1];
    let nextParent = nextH2 ? nextH2.parentElement : null;
    while (node && node !== nextParent) {
      // Filter out empty grid containers
      if (
        node.matches('.aem-Grid, .aem-Grid--12, .aem-Grid--default--12, .aem-GridColumn, .aem-GridColumn--default--12') &&
        node.children.length === 0
      ) {
        node = node.nextElementSibling;
        continue;
      }
      siblings.push(node);
      node = node.nextElementSibling;
    }
    // Remove trailing empty elements (edge case)
    while (siblings.length && siblings[siblings.length - 1].textContent.trim() === '') {
      siblings.pop();
    }
    // Only one element? Use directly. Multiple? Use array.
    const contentCell = siblings.length === 1 ? siblings[0] : siblings;
    rows.push([h2, contentCell]);
  }

  // Replace the entire main container with the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  mainContainer.parentNode.replaceChild(block, mainContainer);
}
