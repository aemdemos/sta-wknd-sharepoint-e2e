/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs, .panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: only proceed if labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row as per spec
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();
    // Tab content panel
    const panel = tabPanels[idx];

    // Defensive: find the main content fragment inside the tab panel
    let tabContent = null;
    // Try to find .cmp-contentfragment inside panel
    tabContent = panel.querySelector('.cmp-contentfragment');
    // If not found, fallback to all children
    if (!tabContent) {
      // Use all children as content
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => tabContent.append(node));
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
