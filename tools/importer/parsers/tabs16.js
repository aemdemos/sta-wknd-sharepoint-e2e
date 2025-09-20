/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length) return;

  // Table header as required
  const headerRow = ['Tabs (tabs16)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the contentfragment element itself (reference, not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
