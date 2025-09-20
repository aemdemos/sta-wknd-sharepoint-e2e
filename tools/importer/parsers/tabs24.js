/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Always use the required header row
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // Extract tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Extract tab panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure labels and panels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the contentfragment article inside each panel
    let contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire article as the tab content (reference, not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsBlock with the block table
  tabsBlock.replaceWith(block);
}
