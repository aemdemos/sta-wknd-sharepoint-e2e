/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsContainer = tabsBlock;
  // Defensive: if .cmp-tabs is inside .tabs.panelcontainer
  if (tabsBlock && tabsBlock.querySelector('.cmp-tabs')) {
    tabsContainer = tabsBlock.querySelector('.cmp-tabs');
  }
  if (!tabsContainer) return;

  // Get tab headers (titles)
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel')
  );

  // Defensive: ensure tabHeaders and tabPanels match
  if (tabHeaders.length === 0 || tabPanels.length === 0 || tabHeaders.length !== tabPanels.length) return;

  // Prepare table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs11)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  tabHeaders.forEach((tabHeader, i) => {
    // Tab label
    const label = tabHeader.textContent.trim();
    // Tab content: use the entire tabPanel's content
    const panel = tabPanels[i];
    // Defensive: find the main content fragment/article inside the panel
    let content = null;
    // Prefer the contentfragment/article if present
    content = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (!content) {
      // fallback to panel itself
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
