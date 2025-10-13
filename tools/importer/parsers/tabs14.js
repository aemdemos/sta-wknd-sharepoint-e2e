/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: fallback if not found
  const cmpTabs = tabsContainer ? tabsContainer.querySelector('.cmp-tabs') : element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: skip if no panel
    if (!panel) return;

    // For resilience, grab the whole tab panel content
    // Find the main contentfragment/article inside the panel
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    // If not found, fallback to panel itself
    let tabContent = contentFragment || panel;

    // Add row: [Tab Label, Tab Content]
    rows.push([labelText, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
