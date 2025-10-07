/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: ensure tabLabels and tabPanels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs3)']);

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[idx];

    // Defensive: if panel not found, skip
    if (!panel) return;

    // For the cell content, take the entire contentfragment/article inside the panel
    // This ensures resilience to structure changes
    let tabContent = null;
    // Look for contentfragment/article
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // Fallback: use panel's children
      tabContent = Array.from(panel.childNodes);
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
