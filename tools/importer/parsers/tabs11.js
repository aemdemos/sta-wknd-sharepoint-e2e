/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist li[role="tab"]'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose rows: header row, then one row per tab
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use the entire tabpanel content
      // Find the contentfragment inside the panel
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        content = Array.from(contentFragment.childNodes);
      } else {
        content = Array.from(panel.childNodes);
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element (not just tabsBlock)
  element.replaceWith(block);
}
