/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (li elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: Ensure tabLabels and tabPanels match
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Build table rows: header, then each tab as [label, content]
  const rows = [];
  rows.push(['Tabs (tabs33)']); // Block name header

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    const panelContent = Array.from(panel.childNodes).filter(node => {
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    rows.push([
      label,
      panelContent.length === 1 ? panelContent[0] : panelContent
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
