/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the correct block
  if (!element || !element.classList.contains('tabs')) return;

  // Table header row
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // Find the tabs container
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // For each tab, find its corresponding tabpanel by aria-controls
  tabLabels.forEach(label => {
    const labelText = label.textContent.trim();
    const controlsId = label.getAttribute('aria-controls');
    if (!controlsId) return;
    const panel = cmpTabs.querySelector(`#${controlsId}`);
    if (!panel) return;
    // Find the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment.cloneNode(true);
    } else {
      // fallback: use panel itself
      tabContent = panel.cloneNode(true);
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
