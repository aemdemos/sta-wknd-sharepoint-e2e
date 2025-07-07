/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the provided element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // Header row, as specified by the component name (from block info)
  const headerRow = ['Tabs (tabs8)'];

  // Tab labels row: each tab label goes in its own column
  const tabList = tabsWrapper.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []).map(li => li.textContent.trim());

  // Tab content row: each tab's content goes in its own column
  // Collect all tab panels (not just the active one)
  const tabPanels = tabsWrapper.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]');

  // Match tabPanels to tabLabels by their dc:title property
  const tabContents = tabLabels.map((label) => {
    // Try matching tabpanel by dc:title in its data-cmp-data-layer
    let foundPanel = null;
    for (const panel of tabPanels) {
      const dataLayer = panel.getAttribute('data-cmp-data-layer');
      if (dataLayer) {
        try {
          // Parse JSON safely with proper quotes
          const json = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
          const key = Object.keys(json)[0];
          if (
            json[key] &&
            typeof json[key]['dc:title'] === 'string' &&
            json[key]['dc:title'].trim().toLowerCase() === label.toLowerCase()
          ) {
            foundPanel = panel;
            break;
          }
        } catch (e) {
          // fallback: ignore
        }
      }
    }
    if (foundPanel) {
      // For resilience, grab all child nodes (including elements and text)
      return Array.from(foundPanel.childNodes).filter(node => {
        // skip empty text nodes
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
        return true;
      });
    }
    // If no panel found for this tab, use empty string
    return '';
  });

  // Compose the rows for the table
  // First row: block header (single cell)
  // Second row: tab labels (N columns)
  // Third row: tab content (N columns, matching the order of the labels)
  const tableRows = [headerRow, tabLabels, tabContents];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace tabs block with the new table block
  tabsWrapper.replaceWith(block);
}
