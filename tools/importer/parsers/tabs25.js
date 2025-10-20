/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs, .panelcontainer');
  if (!tabsRoot) return;

  // Find tab navigation (tab labels)
  const tabNav = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('[role="tab"]'));

  // Find tab panels (content areas)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs25)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    if (!panel) return;
    // Get the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }
    // Add row: [Tab Label, Tab Content]
    rows.push([
      labelText,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
