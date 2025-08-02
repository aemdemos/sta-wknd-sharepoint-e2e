/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the .cmp-tabs element (the tabs block)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 2. Extract tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList
    ? Array.from(tabList.children).map(li => li.textContent.trim())
    : [];

  // 3. Extract tab panels in order
  // Each panel content should be in the same order as tab labels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // 4. Form the header row and data rows
  const cells = [['Tabs (tabs23)']];

  // Defensive: Use the minimum length to avoid mismatch
  const nTabs = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < nTabs; i += 1) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Extract the main content for the tab
    // Try to find .contentfragment > article, else fallback to all children
    let tabContent = null;
    const article = panel.querySelector('.contentfragment > article');
    if (article) {
      tabContent = article;
    } else {
      // fallback: gather all child nodes (including text and elements)
      // filter out empty text nodes
      const nodes = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (nodes.length === 1) {
        tabContent = nodes[0];
      } else {
        tabContent = nodes;
      }
    }
    cells.push([label, tabContent]);
  }

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
