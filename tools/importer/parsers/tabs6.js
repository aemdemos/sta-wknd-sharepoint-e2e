/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels as text (for the second row)
  const tabLabelEls = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabLabels = tabLabelEls.map(e => e.textContent.trim());

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the table rows
  // 1. Header row
  const cells = [['Tabs (tabs6)']];
  // 2. Tab labels row
  cells.push(tabLabels);
  // 3+. Each tab panel is a row with one cell: the content of that tab
  tabPanels.forEach(panel => {
    // The main content inside each tab panel is a .contentfragment (article)
    const content = panel.querySelector('.contentfragment, article, .cmp-contentfragment, .cmp-contentfragment__elements') || panel;
    // Wrap the referenced content in a div for safety, but reference the existing content
    const wrapper = document.createElement('div');
    // Reference all children of the content element, not clone
    Array.from(content.childNodes).forEach(node => {
      wrapper.appendChild(node);
    });
    cells.push([wrapper]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
