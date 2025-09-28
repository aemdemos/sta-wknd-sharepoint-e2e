/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  // For each tab, add a row: [Label, Content]
  tabLabels.forEach((tab, idx) => {
    // Tab label text
    const label = tab.textContent.trim();

    // Tab panel content
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // For resilience: Use the full contentfragment/article inside the panel as content
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let content;
    if (contentFragment) {
      content = contentFragment;
    } else {
      // Fallback: Use the panel itself
      content = panel;
    }

    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block table
  tabsRoot.replaceWith(block);
}
