/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels (li elements under tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Get tab panels (divs with class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: first row is header
  const rows = [];
  const headerRow = ['Tabs (tabs35)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Get label text
    const label = labelEl.textContent.trim();

    // Defensive: find the corresponding tabpanel by index
    const panel = tabPanels[idx];
    if (!panel) return;

    // The content is everything inside the tabpanel
    // We'll use the .contentfragment inside the tabpanel if present, else all children
    let content = null;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      content = cf;
    } else {
      // fallback: wrap all children in a div
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach((n) => wrapper.appendChild(n.cloneNode(true)));
      content = wrapper;
    }

    rows.push([label, content]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
