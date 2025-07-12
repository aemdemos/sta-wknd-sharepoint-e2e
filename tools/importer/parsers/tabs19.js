/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 2. Extract tab labels (in document order)
  const tabLabelEls = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // 3. Extract each panel content in the proper order
  // The panels may not be in the DOM order as the labels, so match by order of appearance
  // .cmp-tabs__tabpanel
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: ensure labels and panels match
  const rowCount = Math.min(tabLabels.length, tabPanels.length);

  // 4. Build table rows: header row then one row per tab (label, content)
  const rows = [];
  rows.push(['Tabs (tabs19)']); // Header row must match exactly the block name

  for (let i = 0; i < rowCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!panel || !label) continue;
    // For content: grab all children, combining them into a fragment
    // We want the entire panel content exactly as in the DOM for semantic meaning
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Remove whitespace-only, script, or style
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style') return false;
        // Remove cmp-tabs__tabpanel__*, aria-hidden hidden panels
        if (node.hasAttribute('aria-hidden') && node.getAttribute('aria-hidden') === 'true') return false;
        return true;
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Keep non-empty text nodes
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    let content;
    if (contentNodes.length === 1) {
      content = contentNodes[0];
    } else if (contentNodes.length > 1) {
      // Wrap in a fragment
      const fragment = document.createDocumentFragment();
      contentNodes.forEach(n => fragment.appendChild(n));
      content = fragment;
    } else {
      // Empty tab
      content = '';
    }
    rows.push([label, content]);
  }

  // 5. Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
