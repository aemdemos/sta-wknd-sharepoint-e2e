/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer, .cmp-tabs');
  // Defensive: fallback if not found
  const cmpTabs = tabsContainer?.querySelector('.cmp-tabs') || element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements inside tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build rows for the block table
  const rows = [];
  // Header row (block name)
  rows.push(['Tabs (tabs28)']);

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!panel) return;

    // For resilience, grab the contentfragment/article inside the panel
    let tabContent = panel.querySelector('.cmp-contentfragment, article');
    if (!tabContent) {
      // fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((n) => tabContent.appendChild(n.cloneNode(true)));
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
