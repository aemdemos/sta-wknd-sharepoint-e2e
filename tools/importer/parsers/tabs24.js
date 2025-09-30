/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: If labels and panels mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: Find the contentfragment article inside the tab panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the whole article as tab content (reference, not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
