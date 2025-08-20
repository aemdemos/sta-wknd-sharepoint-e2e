/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (all immediate children of .cmp-tabs__tablist [role="tab"])
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tabpanels (contents)
  // Only immediate children with data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose rows: first row is the block name, exactly as required
  const rows = [['Tabs (tabs38)']];

  // For each tab, add row: [label, content]
  // The label can be the textContent of the tab label
  // The content is the relevant tabpanel's contentfragment (if present), else the tabpanel itself
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    // Find the content fragment inside the tab panel
    const contentFragment = panel.querySelector('.contentfragment');
    let tabContentEl;
    if (contentFragment) {
      tabContentEl = contentFragment;
    } else {
      // fallback to the panel itself
      tabContentEl = panel;
    }
    // Reference the actual element, do not clone
    rows.push([label, tabContentEl]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
