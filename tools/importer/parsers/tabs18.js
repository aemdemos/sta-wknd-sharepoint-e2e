/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tablist = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]'));

  // Get tab panels by role
  // Only consider direct children of the .cmp-tabs element to avoid nested/unrelated tabpanels
  const tabPanels = Array.from(tabsBlock.children).filter(child => child.getAttribute('role') === 'tabpanel');

  // Defensive: if tabPanels are not found, try fallback selector (for flexibility)
  if (tabPanels.length === 0) {
    tabPanels.push(...Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]')));
  }

  // Table header row exactly as required
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    if (!panel) continue;

    // Reference the first non-empty child element of the tabpanel if available, else the panel itself
    let tabContent = null;
    const children = Array.from(panel.children).filter(c => c.textContent.trim() || c.querySelector('*'));
    if (children.length === 1) {
      tabContent = children[0];
    } else if (children.length > 1) {
      // Combine all children into a single container for the table cell
      const wrapper = document.createElement('div');
      children.forEach(child => wrapper.appendChild(child));
      tabContent = wrapper;
    } else {
      // If no non-empty children, use the panel itself
      tabContent = panel;
    }

    // Add tab label and content to the row
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
