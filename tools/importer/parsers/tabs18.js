/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs wrapper; search for cmp-tabs inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row matches the component name as specified
  const headerRow = ['Tabs (tabs18)'];

  // Find the tab labels (tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((li) => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tabpanel elements in DOM order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the rows: [Tab Label, Tab Content], referencing the real panel element
  const rows = tabLabels.map((label, idx) => {
    // Defensive: if fewer tabPanels than tabLabels, provide empty string
    const panel = tabPanels[idx];
    if (!panel) return [label, ''];
    // Remove aria-hidden so content is visible
    panel.removeAttribute('aria-hidden');
    // Return the label and the actual panel element (not cloned)
    return [label, panel];
  });

  const cells = [headerRow, ...rows];

  // Create block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
