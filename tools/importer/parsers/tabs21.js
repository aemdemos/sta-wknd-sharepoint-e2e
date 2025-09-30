/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role=tabpanel)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs21)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!label || !panel) continue;

    // Extract the content of the tab panel
    // We'll use the first child of the tabpanel, which is usually a .contentfragment
    // If not found, fallback to all children
    let contentElem = null;
    if (panel.children.length === 1) {
      contentElem = panel.children[0];
    } else {
      // fallback: wrap all children in a div
      contentElem = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => contentElem.appendChild(node.cloneNode(true)));
    }
    rows.push([label, contentElem]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
