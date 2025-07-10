/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements under .cmp-tabs__tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (content corresponding to tabs)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the header row: should be a single cell with the block name
  const cells = [['Tabs (tabs23)']];

  // For each tab, add a row with [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const panelEl = tabPanels[i];
    if (!labelEl || !panelEl) continue;

    // Tab label as plain text
    const tabLabel = labelEl.textContent.trim();
    // Tab content: find primary content
    let tabContent;
    // Try to find the main contentfragment block in the tabpanel
    const contentFragment = panelEl.querySelector('.contentfragment');
    if (contentFragment) {
      // Prefer the .cmp-contentfragment__elements, if present
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      tabContent = cfElements ? cfElements : contentFragment;
    } else {
      // fallback: all children of the panel
      const children = Array.from(panelEl.childNodes).filter(node => {
        // Ignore whitespace
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
        return true;
      });
      tabContent = children.length === 1 ? children[0] : children;
    }
    cells.push([tabLabel, tabContent]);
  }

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabsRoot element with the created table
  tabsRoot.replaceWith(block);
}
