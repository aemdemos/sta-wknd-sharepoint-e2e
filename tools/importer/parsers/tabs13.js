/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse if this is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as required
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // Find the tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only process if counts match
  if (tabLabels.length !== tabPanels.length) return;

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // For tab content, use the entire tabpanel content as a wrapper div
    const wrapper = document.createElement('div');
    Array.from(panel.childNodes).forEach(node => {
      wrapper.appendChild(node.cloneNode(true));
    });
    rows.push([label, wrapper]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
