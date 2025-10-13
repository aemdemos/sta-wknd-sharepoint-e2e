/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsContainer) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs') || tabsContainer;
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist, [role="tablist"]');
  const tabHeaders = tablist ? Array.from(tablist.querySelectorAll('[role="tab"], .cmp-tabs__tab')) : [];
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have headers and panels
  if (!tabHeaders.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, i) => {
    // Tab label text
    const label = tabHeader.textContent.trim();

    // Find corresponding panel (by index)
    const panel = tabPanels[i];
    if (!panel) return;

    // Defensive: find the main content fragment inside the panel
    let tabContent = null;
    // Usually a contentfragment/article inside panel
    const contentFragment = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (contentFragment) {
      // Remove duplicate title if present
      const fragTitle = contentFragment.querySelector('.cmp-contentfragment__title, h3');
      if (fragTitle) fragTitle.remove();
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }

    // Add row: [Tab Label, Tab Content]
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
