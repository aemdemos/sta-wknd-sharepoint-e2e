/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabsBlock = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Collect tab headers and panels
  const tabHeaderEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist > li');
  const tabPanelEls = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare the rows per the markdown structure
  // 1. Header row: ['Tabs (tabs31)']
  // 2. Second row: [ [<strong>Overview</strong>, <strong>Itinerary</strong>, ...] ]
  // 3+. Each row: [<strong>Overview</strong>, <tab content>]
  const table = [];
  // Header row
  table.push(['Tabs (tabs31)']);

  // Row of all tab labels in a single cell as <strong> elements
  const labelNodes = Array.from(tabHeaderEls).map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });
  table.push([labelNodes]);

  // For each tab: [label, content]
  for (let i = 0; i < tabHeaderEls.length; i++) {
    const tabLabel = tabHeaderEls[i].textContent.trim();
    const panel = tabPanelEls[i];
    if (!panel) continue;
    let contentEl = panel.querySelector('.contentfragment');
    if (!contentEl) contentEl = panel;
    const labelNode = document.createElement('strong');
    labelNode.textContent = tabLabel;
    table.push([labelNode, contentEl]);
  }

  const block = WebImporter.DOMUtils.createTable(table, document);
  tabsWrapper.replaceWith(block);
}
