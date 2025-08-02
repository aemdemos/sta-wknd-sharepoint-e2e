/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header for block table
  const headerRow = ['Tabs (tabs10)'];
  // Each row will be: [Tab label, Tab content]
  const rows = [headerRow];

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: only process as many panels as there are labels (and vice versa)
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    // Tab label, as plain string
    const label = tabLabels[i].textContent.trim();
    // Panel content: try to get the main contentfragment inside the panel
    const panel = tabPanels[i];
    // Prefer contentfragment article if present, else use full panel
    let contentElem = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // fallback: use everything inside the tabpanel
      // We'll wrap all direct children of the panel in a fragment span
      const frag = document.createElement('span');
      Array.from(panel.childNodes).forEach(child => frag.appendChild(child));
      contentElem = frag;
    }
    rows.push([label, contentElem]);
  }

  // Create the tabs block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the whole tabs block with the new table
  tabsBlock.replaceWith(table);
}
