/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build rows: first row is header
  const rows = [['Tabs (tabs19)']];

  // For each tab, add a row with [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();
    // Tab content panel
    const panel = tabPanels[i];
    // Defensive: if panel is missing, skip
    if (!panel) return;

    // For tab content, preserve the entire contentfragment/article inside the tabpanel
    // Find the contentfragment/article
    let tabContent = panel.querySelector('article') || panel;
    // Defensive: if contentfragment/article is missing, use panel itself
    if (!tabContent) tabContent = panel;

    rows.push([
      labelText,
      tabContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsContainer.replaceWith(block);
}
