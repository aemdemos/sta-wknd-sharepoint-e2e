/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.children : []).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Compose block table rows
  const rows = [];
  // 1. Header row - single column
  rows.push(['Tabs (tabs34)']);
  // 2. Tab labels row - multiple columns
  rows.push(tabLabels);
  // 3. Each tab: one row per tab, with 2 columns
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    let content = '';
    const panel = tabPanels[i];
    if (panel) {
      // Use first cmp-contentfragment/article if present
      const cf = panel.querySelector('.cmp-contentfragment');
      if (cf) {
        content = cf;
      } else if (panel.children.length === 1) {
        content = panel.children[0];
      } else if (panel.children.length > 1) {
        const div = document.createElement('div');
        Array.from(panel.childNodes).forEach(child => div.append(child));
        content = div;
      } else {
        content = document.createTextNode(panel.textContent.trim());
      }
    }
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
