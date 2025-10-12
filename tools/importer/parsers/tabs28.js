/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels (li elements inside ol[role="tablist"])
  const tabLabels = Array.from(cmpTabs.querySelectorAll('ol[role="tablist"] > li'));

  // Get tab panels (div[role="tabpanel"] inside cmpTabs)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs28)']);

  // Each tab: label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    if (!panel) return;
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
