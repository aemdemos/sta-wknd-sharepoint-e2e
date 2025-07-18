/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract all tab labels from the tablist (in order)
  const tabLabels = Array.from(
    tabs.querySelectorAll(
      '.cmp-tabs__tablist li[role="tab"]'
    )
  );

  // Extract all tabpanel elements (tab content), in source order
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build a mapping from tabpanel id to tab label text
  const tabIdToLabel = {};
  tabLabels.forEach(labelEl => {
    const controlsId = labelEl.getAttribute('aria-controls');
    if (controlsId) {
      tabIdToLabel[controlsId] = labelEl.textContent.trim();
    }
  });

  // Compose rows: header + one row per tab (label, content)
  const rows = [];
  // Header row -- block name and variant
  rows.push(['Tabs (tabs31)']);

  // For each tab, find its label and corresponding panel content
  tabPanels.forEach(panel => {
    // Get the label for this tab panel
    const label = tabIdToLabel[panel.id] || '';
    // For content: get all direct children (to retain HTML structure)
    // filter out empty text nodes
    const children = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        return n.textContent.trim().length > 0;
      }
      return true;
    });
    // If no children but panel has text, use text node
    let content;
    if (children.length > 0) {
      content = children;
    } else if (panel.textContent && panel.textContent.trim()) {
      content = [document.createTextNode(panel.textContent.trim())];
    } else {
      content = ['']; // empty cell
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the new block table
  tabs.replaceWith(block);
}
