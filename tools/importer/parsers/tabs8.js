/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Get the tab labels (from tablist > li)
  const tabLabels = [];
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // 2. Collect tab panels
  // We want the content under each tab, which is in .cmp-tabs__tabpanel
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // For resilience, grab the .contentfragment inside the tabpanel if present
  const tabContents = tabPanels.map(panel => {
    const frag = panel.querySelector('.contentfragment');
    return frag ? frag : panel;
  });

  // 3. Compose the table: header, then each tab (label + content)
  const cells = [];
  cells.push(['Tabs (tabs8)']);
  for (let i = 0; i < tabLabels.length; i++) {
    cells.push([tabLabels[i], tabContents[i] || '']);
  }

  // 4. Replace the original tabs element with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
