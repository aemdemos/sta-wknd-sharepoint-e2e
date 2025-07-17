/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside this section
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the <ol> element
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabHeaders = Array.from(tabList ? tabList.children : []).map(li => li && li.textContent.trim()).filter(Boolean);

  // Get tab panels, in the same order as tab headers
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare table rows
  const rows = [];
  // Header row: block name
  rows.push(['Tabs (tabs23)']);

  // Each tab row: [label, content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const tabLabel = tabHeaders[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // For the content, reference the content fragment's article element,
    // or else fallback to all direct children of panel
    let contentEl = panel.querySelector('article');
    if (!contentEl) {
      // fallback: use all the children of the panel
      let contentFrag = document.createElement('div');
      contentFrag.append(...panel.childNodes);
      contentEl = contentFrag;
    }
    rows.push([tabLabel, contentEl]);
  }

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
