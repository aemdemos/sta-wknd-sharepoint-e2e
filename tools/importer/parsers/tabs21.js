/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content wrappers) in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table: first row is the single header cell
  const rows = [['Tabs (tabs21)']];

  // Each subsequent row: [tab label, tab content] (NO extra label row)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Get all immediate children that are not just empty text nodes
      const children = Array.from(panel.childNodes).filter(
        n => (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()))
      );
      if (children.length === 1) {
        content = children[0];
      } else if (children.length > 1) {
        content = children;
      }
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
