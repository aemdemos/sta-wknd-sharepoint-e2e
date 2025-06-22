/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract all tab labels and panels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length) return;

  // Header row (single cell, as in the example)
  const headerRow = ['Tabs (tabs30)'];

  // Each subsequent row is [label, content]
  const tabRows = tabLabels.map((label, idx) => {
    // Wrap label in span
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label.textContent.trim();

    const panel = tabPanels[idx];
    // Include all non-empty children for full content preservation
    const children = Array.from(panel.childNodes).filter(node => node.nodeType !== Node.TEXT_NODE || /\S/.test(node.textContent));
    let content;
    if(children.length === 1){
      content = children[0];
    } else if(children.length > 1) {
      content = children;
    } else {
      content = '';
    }
    return [labelSpan, content];
  });

  // Compose the table (header, then tab rows)
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs element with block
  tabs.replaceWith(block);
}
