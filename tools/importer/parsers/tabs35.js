/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Find all tabpanels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length) return;

  // Compose the table cells: header row, then one row per tab [label, content]
  const cells = [['Tabs (tabs35)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Use the .contentfragment from the panel, or fallback to the whole panel
    const contentFragment = panel.querySelector('.contentfragment');
    let contentNodes = [];
    if (contentFragment) {
      contentNodes = Array.from(contentFragment.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      );
    } else {
      contentNodes = Array.from(panel.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      );
    }
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else {
      content = contentNodes;
    }
    cells.push([label, content]);
  }
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
