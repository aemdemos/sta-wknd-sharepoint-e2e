/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within this block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tab list (assume ol > li.cmp-tabs__tab)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels and match order to tabLabels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Compose the first (header) row
  const cells = [['Tabs (tabs34)']];

  // Add a row for all tabs with [label, content] format
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let panelContent;
    if (panel) {
      // Reference all children of the tab panel directly (do not clone)
      const children = Array.from(panel.childNodes).filter(
        node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
      );
      // If no children, fallback to empty string
      panelContent = children.length ? children : '';
    } else {
      panelContent = '';
    }
    cells.push([
      label,
      panelContent
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs element with the new block table
  tabs.replaceWith(block);
}
