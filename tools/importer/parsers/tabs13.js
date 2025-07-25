/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element within the provided element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get all the tab list items (labels)
  const tabLabelEls = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all the tab panels (content)
  const tabPanelEls = Array.from(tabsEl.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build a mapping of label id to label text
  const labelIdToText = {};
  tabLabelEls.forEach(labelEl => {
    const id = labelEl.getAttribute('id');
    if (id) {
      labelIdToText[id] = labelEl.textContent.trim();
    }
  });

  // Compose the cells for the table
  const cells = [
    ['Tabs (tabs13)']
  ];

  // For each tab panel, build the table row
  tabPanelEls.forEach(panelEl => {
    const labelId = panelEl.getAttribute('aria-labelledby');
    const labelText = labelIdToText[labelId] || '';
    // Use the article (content fragment) if present, else use the panel itself
    let contentEl = panelEl.querySelector('article');
    if (!contentEl) contentEl = panelEl;
    cells.push([labelText, contentEl]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs element with the new block table
  tabsEl.replaceWith(block);
}
