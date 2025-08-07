/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the given element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (tab names)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get the tab panels (tab contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose header row as a single cell per requirements
  const cells = [['Tabs (tabs38)']];

  // Each tab is a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label text
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    // Tab content is the .contentfragment inside the panel (reference, not clone)
    let content = '';
    if (tabPanels[i]) {
      const contentfragment = tabPanels[i].querySelector('.contentfragment');
      if (contentfragment) {
        content = contentfragment;
      } else {
        content = tabPanels[i];
      }
    }
    cells.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
