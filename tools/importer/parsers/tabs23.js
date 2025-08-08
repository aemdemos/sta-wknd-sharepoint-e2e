/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs.cmp-tabs container
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab label elements
  const tabLabelNodes = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row: block name as in example
  const cells = [['Tabs (tabs23)']];

  // For each tab, add [label, content] row
  for (let i = 0; i < tabLabelNodes.length; i++) {
    const label = tabLabelNodes[i].textContent.trim();
    const panel = tabPanels[i];
    let contentElem;
    if (panel) {
      // Reference the content fragment/article inside panel, or all children if not present
      // Only reference existing elements, do NOT clone
      const frag = panel.querySelector('.contentfragment, article, div, section');
      if (frag) {
        contentElem = frag;
      } else {
        // If no obvious wrapper, aggregate all children of panel
        const arr = Array.from(panel.childNodes).filter(node => {
          // Only include if element or meaningful text
          return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
        });
        contentElem = arr.length === 1 ? arr[0] : arr;
      }
    } else {
      // No panel: put empty string
      contentElem = '';
    }
    cells.push([label, contentElem]);
  }

  // Build the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
