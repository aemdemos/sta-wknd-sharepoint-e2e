/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within 'element'
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // ----- EXTRACT TAB LABELS -----
  const tabLabelEls = tabsEl.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // ----- EXTRACT TAB CONTENT PANELS -----
  // Each panel is a .cmp-tabs__tabpanel and corresponds to the order of the tabs
  const tabPanels = tabsEl.querySelectorAll('.cmp-tabs__tabpanel');

  // ----- BUILD HEADER AND TABLE STRUCTURE -----
  const cells = [];
  // The header row is always the block name as per the instructions
  cells.push(['Tabs (tabs21)']);

  // For each tab: label (cell 1), content (cell 2)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: ensure a panel exists for each label
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Find the contentfragment inside the panel (robust to variations)
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        contentCell = contentFragment;
      } else {
        // Fallback: use the panel itself (should contain the content)
        contentCell = panel;
      }
    }
    cells.push([label, contentCell]);
  }

  // ----- CREATE THE TABLE BLOCK AND REPLACE -----
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsEl.replaceWith(block);
}
