/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as per spec
  const headerRow = ['Tabs (tabs33)'];

  // Find the tabs container (should be the direct child with class 'cmp-tabs')
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    // Use the entire tabpanel content (not just article) for full fidelity
    let content = null;
    if (panel) {
      // Use all children of the panel for content
      const fragment = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => fragment.appendChild(node.cloneNode(true)));
      content = fragment;
    }
    return [label, content];
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
