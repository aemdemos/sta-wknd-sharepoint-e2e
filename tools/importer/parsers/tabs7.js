/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the list of tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  if (tabLabels.length === 0) return;

  // Get all tab panels (content)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Create the header row as a single column, per spec
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];

  // For each tab label, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const controls = tabLabels[i].getAttribute('aria-controls');
    // Find the panel by id
    const panel = tabPanels.find(tp => tp.id === controls);
    let contentCell = '';
    if (panel) {
      // Try to find the main <article> in the panel
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // If not, include all children except scripts/styles
        const fragment = document.createDocumentFragment();
        Array.from(panel.children).forEach(child => {
          if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            fragment.appendChild(child);
          }
        });
        contentCell = fragment;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the new block table
  tabs.replaceWith(table);
}
