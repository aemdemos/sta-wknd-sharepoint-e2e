/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (by class 'cmp-tabs')
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab headers (tab titles)
  const tabHeaders = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (tab content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: match tab headers to tab panels by index
  const rows = [];
  // Header row as per requirements
  rows.push(['Tabs (tabs18)']);

  for (let i = 0; i < tabHeaders.length; i++) {
    const header = tabHeaders[i];
    const panel = tabPanels[i];
    if (!header || !panel) continue;

    // Tab label: use the text content of the tab header
    const tabLabel = header.textContent.trim();

    // Tab content: use the entire panel content
    // Defensive: reference children from the panel, do not clone
    const tabContent = document.createElement('div');
    Array.from(panel.childNodes).forEach((node) => {
      tabContent.appendChild(node);
    });

    rows.push([tabLabel, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
