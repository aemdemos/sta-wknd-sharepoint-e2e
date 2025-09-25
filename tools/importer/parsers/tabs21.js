/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Only proceed if we have at least one tab
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs21)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the corresponding tabpanel
    const panel = tabPanels[i];
    if (!panel) continue;

    // Tab content: reference the contentfragment > article if present, else the panel itself
    const contentFragment = panel.querySelector('.contentfragment > article') || panel.querySelector('article');
    let tabContent;
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
