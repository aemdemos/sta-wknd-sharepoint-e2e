/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the main tabs block
  if (!element.classList.contains('cmp-tabs')) return;

  // Header row must match block name exactly
  const headerRow = ['Tabs (tabs14)'];
  const rows = [headerRow];

  // Get tab labels (li elements inside ol[role=tablist])
  const tabList = element.querySelector('ol[role="tablist"]');
  const tabLabels = tabList ? Array.from(tabList.children) : [];

  // Get all tab panels (div[role=tabpanel])
  const tabPanels = Array.from(element.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Extract all HTML content inside the tabpanel as a single HTML string
    const contentHTML = panel.innerHTML;
    // Create a container div and set its HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = contentHTML;
    const contentCell = wrapper;

    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
