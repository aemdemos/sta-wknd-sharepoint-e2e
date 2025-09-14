/* global WebImporter */
export default function parse(element, { document }) {
  // Only run if this is the tabs block root
  if (!element.classList.contains('tabs')) return;

  // Find the cmp-tabs element
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Get all content inside the tab panel (excluding the panel container itself)
    // We'll clone the children to avoid moving them from the DOM
    const contentFragment = document.createElement('div');
    Array.from(panel.children).forEach(child => {
      contentFragment.appendChild(child.cloneNode(true));
    });

    rows.push([label, contentFragment]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  element.replaceWith(block);
}
