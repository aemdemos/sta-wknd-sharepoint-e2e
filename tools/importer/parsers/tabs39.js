/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find all tab panel elements (content areas for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: skip if mismatch
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // The first row is the block name only in a single cell
  const rows = [['Tabs (tabs39)']];

  // For each tab, build a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Try to find the .contentfragment/article inside the panel
    let tabContent = [];
    const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (contentFragment) {
      // Exclude the h3.cmp-contentfragment__title if present
      const fragChildren = Array.from(contentFragment.children).filter(child => !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title')));
      // If at least one child exists, use all children
      if (fragChildren.length > 0) {
        tabContent = fragChildren;
      } else {
        // fallback: use the entire contentFragment
        tabContent = [contentFragment];
      }
    } else {
      // fallback: use all direct children of the panel
      tabContent = Array.from(panel.children);
      if (!tabContent.length) tabContent = [''];
    }
    // If still empty, use an empty string
    if (tabContent.length === 0) tabContent = [''];

    // For semantic meaning, always provide original elements directly
    rows.push([
      label,
      tabContent.length === 1 ? tabContent[0] : tabContent
    ]);
  }

  // Create the block table and replace the tabs block with it
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
