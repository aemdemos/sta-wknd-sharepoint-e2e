/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs15)'];
  const rows = [headerRow];

  // Find the main tabs container
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[data-cmp-hook-tabs="tabpanel"])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Create a wrapper div and move all children of the panel into it
    const wrapper = document.createElement('div');
    while (panel.firstChild) {
      wrapper.appendChild(panel.firstChild);
    }
    rows.push([label, wrapper]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
