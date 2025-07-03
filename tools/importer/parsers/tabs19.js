/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tablist (ol[role=tablist]) and tab labels
  const tabList = tabs.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabelsEls = Array.from(tabList.children).filter(el => el.getAttribute('role') === 'tab');

  // Get all tabpanel elements (in DOM order)
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build the header row per block spec
  const rows = [ ['Tabs (tabs19)'] ];

  // For each tab, create a row [label, content]
  for (let i = 0; i < tabLabelsEls.length; i++) {
    const label = tabLabelsEls[i]?.textContent?.trim() || '';
    // Synchronize by order; find corresponding tabpanel
    const panel = tabPanels[i];
    let contentElem = null;
    if (panel) {
      // Try to use the full tabpanel content, but only reference existing elements
      // Prefer the main child article.cmp-contentfragment if present, else panel itself
      const article = panel.querySelector('article.cmp-contentfragment');
      contentElem = article || panel;
    } else {
      contentElem = document.createTextNode('');
    }
    rows.push([label, contentElem]);
  }

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs element with the new block
  tabs.replaceWith(block);
}
