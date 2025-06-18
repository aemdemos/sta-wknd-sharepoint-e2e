/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the provided element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Extract tab labels from the tablist <li> elements
  const tabLabelEls = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // 2. Extract tab panels (div.cmp-tabs__tabpanel)
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // 3. Prepare the header row (must match block name exactly)
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // 4. For each tab, create a row with: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // Defensive: skip if mismatch

    // Reference all child nodes of the panel except empty text nodes
    const tabContentWrapper = document.createElement('div');
    Array.from(panel.childNodes).forEach(node => {
      // Only append if not an empty text node
      if (node.nodeType !== 3 || (node.textContent && node.textContent.trim() !== '')) {
        tabContentWrapper.appendChild(node);
      }
    });
    rows.push([label, tabContentWrapper]);
  }

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
