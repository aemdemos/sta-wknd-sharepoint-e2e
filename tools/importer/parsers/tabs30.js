/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Extract tab labels from the tablist
  const tabLabels = [];
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Extract tab panels in order
  const tabPanels = tabsEl.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]');

  // Prepare header row exactly as required
  const rows = [['Tabs (tabs30)']];

  // For each tab, extract its label and main content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    let content = '';
    if (tabPanel) {
      // Use the first main content child for the tab (often <article> or .contentfragment)
      // Use the .contentfragment element if present, which wraps the main content
      let mainContent = tabPanel.querySelector('.contentfragment');
      if (!mainContent) {
        // fallback to tabPanel itself if nothing else
        mainContent = tabPanel;
      }
      content = mainContent;
    }
    rows.push([label, content]);
  }

  // Create the block table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
  return table;
}
