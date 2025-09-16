/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Always use the correct header row
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // Get tab labels and panels
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: match labels and panels
  const count = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < count; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find the main content fragment inside the panel
    let tabContent = null;
    // Prefer the article, but fallback to the first child div if needed
    const cf = panel.querySelector('article') || panel.querySelector('.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel.querySelector('div');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
