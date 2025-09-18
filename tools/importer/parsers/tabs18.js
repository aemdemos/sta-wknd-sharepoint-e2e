/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: header, then each tab (label, content)
  const rows = [];
  // Always use the block name as header
  rows.push(['Tabs (tabs18)']);

  // For each tab, find its label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find the tabpanel by aria-controls or by order
    let tabPanel = null;
    const ariaControls = tabLabel.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = tabsRoot.querySelector(`#${ariaControls}`);
    }
    if (!tabPanel) {
      // fallback: by index
      tabPanel = tabPanels[i];
    }
    if (!tabPanel) return; // skip if missing

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: use the whole tabpanel content (children)
    // Defensive: collect all children as an array
    const contentElements = Array.from(tabPanel.children);
    let contentCell;
    if (contentElements.length === 1) {
      contentCell = contentElements[0];
    } else if (contentElements.length > 1) {
      contentCell = contentElements;
    } else {
      // fallback: empty
      contentCell = '';
    }

    rows.push([labelText, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs root with the table
  tabsRoot.replaceWith(table);
}
