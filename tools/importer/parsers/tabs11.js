/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab headers (labels)
  const tabHeaders = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if headers and panels match
  if (tabHeaders.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs11)']);

  // Each tab: label, content
  for (let i = 0; i < tabHeaders.length; i++) {
    const label = tabHeaders[i];
    const panel = tabPanels[i];
    // Defensive: clone the panel's children into a fragment for clean extraction
    const frag = document.createDocumentFragment();
    // Only append direct children (preserves structure, avoids parent wrappers)
    Array.from(panel.childNodes).forEach(node => {
      // Only append element nodes or text nodes with content
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        frag.appendChild(node.cloneNode(true));
      }
    });
    rows.push([
      label,
      frag
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
