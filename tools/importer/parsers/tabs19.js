/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the <ol> list
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;

  // Build rows: each row is [label, content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: find the main contentfragment/article inside the panel
    let content = null;
    // Try to find the first <article> or <div class="contentfragment">
    content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // For robustness, wrap the content in a div if it's not a Node
    rows.push([label, content]);
  }

  // Table header row as required
  const headerRow = ['Tabs (tabs19)'];
  const tableRows = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original tabs element with the new block table
  tabs.replaceWith(block);
}
