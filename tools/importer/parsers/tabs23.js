/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find tab labels (li)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row
  const headerRow = ['Tabs (tabs23)'];

  // Each tab gets a row: [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabelEl = tabLabels[i];
    // Reference the label node directly, but remove unnecessary tabindex, aria, etc for output
    // Actually, for resilience, use the actual tab label text
    const labelText = tabLabelEl.textContent.trim();
    // Get corresponding panel
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Reference the inner content of the panel directly. Usually it's .contentfragment
      // We want the children of the contentfragment/article, not the outer tabpanel wrapper
      const contentFragment = panel.querySelector('.contentfragment, article');
      if (contentFragment) {
        // Reference the actual contentfragment/article node
        tabContent = contentFragment;
      } else {
        // Fallback: use all children of the panel
        if (panel.children.length > 0) {
          tabContent = Array.from(panel.children);
        } else {
          tabContent = panel;
        }
      }
    } else {
      tabContent = '';
    }
    rows.push([labelText, tabContent]);
  }

  // Compose table cells: header + rows
  const cells = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
