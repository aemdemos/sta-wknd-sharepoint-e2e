/* global WebImporter */
export default function parse(element, { document }) {
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll(':scope > li.cmp-tabs__tab') : []);

  // Get all tab panels in correct order
  const tabPanels = Array.from(tabsBlock.querySelectorAll(':scope > [data-cmp-hook-tabs="tabpanel"]'));

  // Create the header row (exactly as in the example)
  const cells = [['Tabs (tabs14)']];

  // Each tab row: [label, content]
  tabLabels.forEach((li, idx) => {
    // Tab label: extract as plain text (as in the example)
    const label = li.textContent.trim();
    // Tab content: prefer .cmp-contentfragment__elements if present, else panel
    let content = '';
    if (tabPanels[idx]) {
      const frag = tabPanels[idx].querySelector('.cmp-contentfragment__elements');
      content = frag ? frag : tabPanels[idx];
    }
    cells.push([label, content]);
  });

  // Create table and replace tabs block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(block);
}
