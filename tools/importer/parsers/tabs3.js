/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Find tab labels (tab triggers)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Find tab panels (content areas)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, fallback: try to pair by order
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Compose the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs3)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: extract the content panel
    const panel = tabPanels[i];
    // Defensive: if panel is missing, skip
    if (!panel) return;

    // For robustness, include the entire tab panel content
    // Find the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(block);
}
