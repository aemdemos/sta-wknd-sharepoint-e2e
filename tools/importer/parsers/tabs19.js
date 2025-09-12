/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if this is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // Find the main tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if counts match
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: skip if missing
    if (!label || !panel) continue;

    // For content, use the entire tabpanel's innerHTML as a div
    const contentDiv = document.createElement('div');
    // Use panel.innerHTML to ensure content is not empty
    contentDiv.innerHTML = panel.innerHTML;
    // Ensure at least some text content is present
    if (!contentDiv.textContent.trim()) continue;

    rows.push([label, contentDiv]);
  }

  // Only replace if we have at least one tab row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
