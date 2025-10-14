/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by class or role)
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsContainer;
  if (tabsBlock && tabsBlock.classList.contains('cmp-tabs')) {
    tabsContainer = tabsBlock;
  } else if (tabsBlock) {
    tabsContainer = tabsBlock.querySelector('.cmp-tabs');
  } else {
    tabsContainer = element.querySelector('.cmp-tabs');
  }
  if (!tabsContainer) return;

  // Get tab headers
  const tabHeaders = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if headers and panels match
  if (tabHeaders.length === 0 || tabPanels.length === 0 || tabHeaders.length !== tabPanels.length) {
    return;
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs38)']);

  // For each tab, extract label and content
  tabHeaders.forEach((header, idx) => {
    // Tab label (text content)
    const tabLabel = header.textContent.trim();
    // Tab content (panel)
    const panel = tabPanels[idx];

    // Defensive: If panel is hidden, still extract its content
    // Find the main content fragment/article inside the panel
    let tabContent = null;
    const frag = panel.querySelector('article.cmp-contentfragment');
    if (frag) {
      tabContent = frag;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
