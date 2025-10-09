/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure we have matching labels/panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const rows = [];
  // Header row: use the block name exactly
  rows.push(['Tabs (tabs23)']);

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const tabPanel = tabPanels[i];
    if (!tabPanel) return;

    // Extract the main contentfragment/article inside the tab panel
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment') || tabPanel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Reference the actual element (do not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: reference all children
      tabContent = Array.from(tabPanel.childNodes);
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.replaceWith(block);
}
