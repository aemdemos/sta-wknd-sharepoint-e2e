/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Extract corresponding tab panels
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build the rows for the block table
  // Header row: single cell
  const rows = [['Tabs (tabs20)']];

  // Subsequent rows: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    let panel = tabPanels[i];
    // Use aria-labelledby for robust panel detection
    const tabId = tabLabels[i].getAttribute('id');
    if (tabId) {
      const ariaPanel = tabs.querySelector(`[aria-labelledby="${tabId}"]`);
      if (ariaPanel) panel = ariaPanel;
    }
    // Content: find <article.cmp-contentfragment> if present, else first element, else div
    let contentCell = null;
    if (panel) {
      let contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (!contentFragment) {
        const firstElement = panel.querySelector(':scope > *');
        contentCell = firstElement || document.createElement('div');
      } else {
        contentCell = contentFragment;
      }
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the old tabs block with the new block table
  tabs.replaceWith(table);
}
