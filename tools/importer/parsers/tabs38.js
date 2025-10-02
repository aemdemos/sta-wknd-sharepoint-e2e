/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tab container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose table rows: header, then [label, content] for each tab
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // Defensive: tabLabels and tabPanels should match
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire content fragment for resilience
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block
  tabsBlock.replaceWith(block);
}
