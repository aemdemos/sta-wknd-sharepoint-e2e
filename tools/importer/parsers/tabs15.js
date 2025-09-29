/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Header row
  const headerRow = ['Tabs (tabs15)'];

  // Build rows: [label, content]
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();

    // Tab content: use the full tabpanel content
    const panel = tabPanels[i];
    // Defensive: find the main contentfragment/article inside the tabpanel
    let content = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use the entire panel
      content = panel;
    }
    return [label, content];
  });

  // Table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
