/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements with role="tab")
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tab panels (divs with role="tabpanel")
  const tabPanelEls = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Table header: block name exactly as required, only one cell in array
  const headerRow = ['Tabs (tabs37)'];

  // Each row after header should have 2 columns: [tab label, tab content]
  const rows = [headerRow];

  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    // Find matching panel by aria-labelledby (robust to order mismatch)
    const tabId = tabLabelEls[i].id;
    let panel = tabPanelEls.find(
      (pane) => pane.getAttribute('aria-labelledby') === tabId
    );
    // Fallback: just use i-th panel if matching fails (should not happen in valid markup)
    if (!panel) {
      panel = tabPanelEls[i];
    }
    // Always reference the content of the panel
    // For robustness, if there's a single child which is .contentfragment, use that, else use whole panel
    let contentFragment = panel.querySelector('.contentfragment');
    let content;
    if (contentFragment && panel.children.length === 1) {
      content = contentFragment;
    } else {
      content = panel;
    }
    rows.push([label, content]); // <-- FIX: two columns per tab row
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
