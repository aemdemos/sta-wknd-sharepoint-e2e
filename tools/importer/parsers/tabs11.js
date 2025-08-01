/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the input element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Extract tab labels (as shown in the tablist)
  const tabLabels = [];
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 2. Extract tab panels and their contents
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // 3. Prepare the block table rows
  // Header row must match the block name in the instructions
  const cells = [['Tabs (tabs11)']];

  for (let i = 0; i < tabPanels.length; i++) {
    // Defensive: skip if there's no panel or label
    const panel = tabPanels[i];
    if (!panel) continue;
    const label = tabLabels[i] || `Tab ${i + 1}`;
    // The content for each tab is the contentfragment in the panel, or the panel itself
    // Reference the direct .contentfragment or .cmp-contentfragment child if present
    let tabContent = null;
    tabContent = panel.querySelector('.contentfragment, .cmp-contentfragment');
    if (!tabContent) {
      // fallback to all children nodes (to support panels without contentfragment)
      // create a fragment for all child nodes (to preserve formatting)
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
      tabContent = frag;
    }
    cells.push([label, tabContent]);
  }

  // 4. Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // 5. Replace the tabs component with the new block
  tabsRoot.replaceWith(block);
}
