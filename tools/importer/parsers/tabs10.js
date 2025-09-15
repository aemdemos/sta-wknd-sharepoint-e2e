/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements in the tablist)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build rows: header first (must match block name exactly)
  const rows = [ ['Tabs (tabs10)'] ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Collect all direct children of the tabpanel (preserving structure)
    const contentFragment = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(node => {
      // Only append element nodes or text nodes with content
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        contentFragment.appendChild(node.cloneNode(true));
      }
    });
    // If contentFragment is empty, fallback to panel itself
    const content = contentFragment.childNodes.length ? Array.from(contentFragment.childNodes) : [panel.cloneNode(true)];
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
