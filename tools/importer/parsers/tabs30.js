/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabList = tabs.querySelector('ol[role="tablist"]');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);
  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));

  // Prepare table header
  const rows = [['Tabs (tabs30)']];

  // Build a row for each tab
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Try to find the corresponding tab panel by matching aria-controls
    let panel = null;
    const panelId = tabLabels[i].getAttribute('aria-controls');
    if (panelId) {
      panel = tabs.querySelector(`#${panelId}`);
    }
    if (!panel) {
      // fallback: use tabPanels[i]
      panel = tabPanels[i];
    }
    let content = null;
    if (panel) {
      // Prefer main article in panel if present
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: use panel directly
        content = panel;
      }
    } else {
      // If the panel is missing, keep the cell empty
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  }
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the block table
  tabs.replaceWith(block);
}
