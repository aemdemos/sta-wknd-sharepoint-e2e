/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());
  // Extract tab panels
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Compose table: header, then one row per tab [label, content]
  const cells = [['Tabs (tabs14)']];
  tabLabels.forEach((label, idx) => {
    const panel = tabPanels[idx];
    if (!panel) return;
    // Create a div to hold all panel content (clone to preserve DOM)
    const contentDiv = document.createElement('div');
    Array.from(panel.childNodes).forEach(child => {
      contentDiv.appendChild(child.cloneNode(true));
    });
    cells.push([label, contentDiv]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabs.replaceWith(block);
}
