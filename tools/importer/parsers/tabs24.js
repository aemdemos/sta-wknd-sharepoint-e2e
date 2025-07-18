/* global WebImporter */
export default function parse(element, { document }) {
  // Find the CMP tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (in order)
  const tabLabelElements = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the table rows: header first, then [Tab Label, Tab Content] for each tab
  const rows = [];
  rows.push(['Tabs (tabs24)']); // Header row: single column

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      panel.removeAttribute('aria-hidden');
      // Move all children of the panel into a container div
      const containerDiv = document.createElement('div');
      Array.from(panel.childNodes).forEach((child) => {
        containerDiv.appendChild(child);
      });
      contentCell = containerDiv;
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new block table
  tabs.replaceWith(table);
}
