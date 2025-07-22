/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs) within the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from li elements inside .cmp-tabs__tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  if (!tabLabels.length) return;

  // Extract corresponding tab panels (order should match tab labels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Prepare header row for block table
  const headerRow = ['Tabs (tabs25)'];

  // Prepare tab label row: each label styled as <strong> like in example
  const tabLabelRow = tabLabels.map(li => {
    const strong = document.createElement('strong');
    strong.textContent = li.textContent.trim();
    return strong;
  });

  // Prepare tab content row: each cell array contains all direct children of the tab panel (to preserve formatting/semantics)
  const tabContentRow = tabPanels.map(panel => {
    // Prefer main content areas in tab panels (skip empty wrappers)
    // If .contentfragment is present, use it, else use all non-empty children
    let contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (contentFragment) {
      return [contentFragment];
    }
    // Otherwise, include all non-empty children in order
    const children = Array.from(panel.children).filter(child => {
      if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return false;
      // Remove empty div wrappers
      return child.textContent.trim() !== '' || child.querySelector('img, ul, li, h1, h2, h3, h4, h5, h6, p');
    });
    return children.length ? children : [document.createTextNode("")];
  });

  // Compose the table rows as shown in the markdown example:
  // First row: header; second row: tab labels; third row: tab content
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Create the table using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block (not the whole element!) with the table
  tabsBlock.replaceWith(table);
}
