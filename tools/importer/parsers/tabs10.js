/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsSection = element.querySelector('.tabs');
  if (!tabsSection) return;
  const tabsRoot = tabsSection.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []).map(tab => tab.textContent.trim());

  // Extract tab panels in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Build header row with block name and variant
  const headerRow = ['Tabs (tabs10)'];
  const cells = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Panel content: prefer the first child that is meaningful
    // Most panels contain a .contentfragment or .cmp-contentfragment
    let panelContent = null;
    let candidates = Array.from(panel.children);
    for (const c of candidates) {
      if (c.classList.contains('contentfragment') || c.classList.contains('cmp-contentfragment')) {
        panelContent = c;
        break;
      }
    }
    // fallback to panel itself if no key content found
    if (!panelContent) panelContent = panel;
    // For tab content, we reference the whole content block (preserves all structure, images, semantic meaning)
    cells.push([label, panelContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs section with the table
  tabsSection.parentNode.replaceChild(table, tabsSection);
}
