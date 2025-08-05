/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the supplied element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements in tab list)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tabpanels (divs with class cmp-tabs__tabpanel)
  // Only direct children of tabsBlock
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // The block table header row
  const cells = [['Tabs (tabs16)']];

  // For each tab, get its label and its content
  for (let i = 0; i < tabLis.length; i++) {
    const tabLi = tabLis[i];
    // The label is the text content of the tab li
    const tabLabel = tabLi.textContent.trim();
    // Which tabpanel? The aria-controls of the li matches the id of the tabpanel
    const controls = tabLi.getAttribute('aria-controls');
    let tabPanel = tabPanels.find(panel => panel.id === controls);
    // Defensive fallback: if not found by id, just use the i-th
    if (!tabPanel && tabPanels[i]) {
      tabPanel = tabPanels[i];
    }
    // If found, use the referenced element directly
    // If not found, leave cell empty (string)
    cells.push([
      tabLabel,
      tabPanel || ''
    ]);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
