/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs block inside
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: check labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const tabPanel = tabPanels[i];
    // Defensive: skip if not found
    if (!tabPanel) return;

    // The content is usually a single contentfragment/article inside
    let tabContent = null;
    // Try to find the main content fragment/article
    const contentFragment = tabPanel.querySelector('.cmp-contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use the whole tabPanel
      tabContent = tabPanel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
