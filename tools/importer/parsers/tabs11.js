/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab titles from the tablist
  const tabTitles = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if we have matching titles and panels
  if (!tabTitles.length || !tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs11)']);

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabTitles.length; i++) {
    const title = tabTitles[i].textContent.trim();
    // Defensive: sometimes there are more titles than panels or vice versa
    const panel = tabPanels[i];
    if (!panel) continue;

    // Reference the actual panel content (not cloning, not creating new elements)
    const panelContent = document.createElement('div');
    Array.from(panel.childNodes).forEach((node) => {
      panelContent.appendChild(node.cloneNode(true));
    });
    rows.push([title, panelContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
