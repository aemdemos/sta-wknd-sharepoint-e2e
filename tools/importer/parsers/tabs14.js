/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block: look for a div with class 'cmp-tabs'
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Table header row as defined in the example: must match exactly
  const rows = [['Tabs (tabs14)']];

  // Get the tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Get the corresponding tabpanel content containers (data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: only process up to the minimum length
  const tabCount = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    // For maximum robustness, reference the immediate content inside the tabpanel,
    // but avoid grabbing wrapper grid structures that add no semantic content.
    // In the given HTML, the .contentfragment element inside the panel is the main content.
    // If not found, use the panel's children as a fallback (to avoid unneeded wrapper).
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else if (panel.children.length === 1) {
      tabContent = panel.firstElementChild;
    } else {
      // fallback: use all children inside the tabpanel as an array
      tabContent = Array.from(panel.children);
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
