/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is the tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per spec
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // Get tab labels
  const tabList = element.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have matching tab labels and panels
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Use the main content fragment/article inside the panel
      // Reference the actual DOM node, not a clone
      const frag = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
      // Instead of cloneNode, move the node directly (removes from DOM)
      content = frag;
    }
    rows.push([
      label,
      content,
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.parentNode.replaceChild(table, element);
}
