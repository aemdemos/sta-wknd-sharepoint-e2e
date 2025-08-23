/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Find tab panels (content)
  // Only direct children of tabsRoot with role="tabpanel"
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: sometimes there are more panels than labels, but only those corresponding to labels are needed.

  // Compose header row
  const cells = [['Tabs (tabs34)']];

  // Each tab: label, content
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    // Defensive: skip if labelEl is missing (should not happen)
    if (!labelEl) continue;
    const tabLabel = labelEl.textContent.trim();

    // Defensive: get corresponding tabPanel (by order)
    const panelEl = tabPanels[i];
    if (!panelEl) continue;

    // Reference the existing tab panel node directly
    cells.push([tabLabel, panelEl]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
