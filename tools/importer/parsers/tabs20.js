/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container by looking for a div with class 'cmp-tabs'
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab label <li>s (direct children of the tablist <ol>)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panel containers (divs with role=tabpanel)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel[role="tabpanel"]')
  );

  // Defensive: ensure we have at least one tab label and one panel
  if (!tabLabels.length || !tabPanels.length) return;

  // Compose the table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs20)']);

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Reference the existing tabPanel element (do not clone!)
    rows.push([label, panel]);
  }

  // Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block in the DOM
  element.parentNode.replaceChild(block, element);
}
