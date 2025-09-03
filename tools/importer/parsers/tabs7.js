/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process tab blocks
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Header row
  const headerRow = ['Tabs (tabs7)'];

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: Use the entire tab panel's content
    const panel = tabPanels[i];
    // Defensive: Find the main content fragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    return [labelText, tabContent];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
