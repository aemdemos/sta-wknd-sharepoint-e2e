/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs8)'];

  // Build rows for each tab
  const rows = tabLabels.map((label, i) => {
    // Tab label text
    const tabLabel = label.textContent.trim();
    // Tab content: use the entire tabpanel contents
    const tabPanel = tabPanels[i];
    // Defensive: find the main content fragment/article inside each tabpanel
    let tabContent = null;
    const contentFragment = tabPanel.querySelector('article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use tabPanel itself
      tabContent = tabPanel;
    }
    return [tabLabel, tabContent];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with table
  tabsBlock.replaceWith(block);
}
