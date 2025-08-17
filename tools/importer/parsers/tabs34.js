/* global WebImporter */
export default function parse(element, { document }) {
  // Find the only .cmp-tabs in this block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim());

  // Find all tab panels (in source order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the rows for the table
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabPanel = tabPanels[i];
    if (!label || !tabPanel) continue;
    // Use the entire contentfragment inside the tabpanel, if present
    let tabContent = tabPanel.querySelector(':scope > .contentfragment');
    if (!tabContent) {
      // Fallback: use all child nodes in a fragment
      const frag = document.createDocumentFragment();
      Array.from(tabPanel.childNodes).forEach(node => frag.appendChild(node));
      tabContent = frag;
    }
    rows.push([label, tabContent]);
  }

  // The table header: must exactly match the block name with variant
  const headerRow = ['Tabs (tabs34)'];
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace cmpTabs with the new table
  cmpTabs.replaceWith(table);
}
