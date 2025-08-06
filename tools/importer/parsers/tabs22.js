/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block root: .tabs .cmp-tabs
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;
  
  // 1. Extract tab labels (in order)
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  
  // 2. Extract tab panels (in order)
  // Each panel has [role="tabpanel"]
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  
  // 3. Build header row
  const headerRow = ['Tabs (tabs22)'];
  // 4. Build data rows: each tab = [label, content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // skip if tab label but no panel
    // Find content to use for the cell:
    // If there's a contentfragment > article, use it, else panel
    let contentElem = panel.querySelector('article');
    if (!contentElem) {
      // If not, use all children of panel
      if (panel.children.length === 1) {
        contentElem = panel.children[0];
      } else if (panel.children.length > 1) {
        // Create a container for all children
        const wrapper = document.createElement('div');
        Array.from(panel.children).forEach(child => wrapper.appendChild(child));
        contentElem = wrapper;
      } else {
        // fallback: use panel itself
        contentElem = panel;
      }
    }
    rows.push([label, contentElem]);
  }
  // 5. Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // 6. Replace the .tabs block with the table
  tabsBlock.replaceWith(table);
}
