/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cmp-tabs element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels in order
  const tabLabels = [];
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  // Extract tab panels in order
  const tabPanels = [];
  // These are paired by order only, so must match the tabLabels order
  const allPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  allPanels.forEach(panel => {
    // Instead of cloning, reference the *contents* (children)
    // We'll wrap all meaningful children in a container for the table cell
    const cell = document.createElement('div');
    // Only append non-empty children (skip aem-Grid if empty)
    Array.from(panel.childNodes).forEach(child => {
      // Filter out empty/meaningless .aem-Grid wrappers
      if (
        child.nodeType === 1 &&
        child.classList.contains('contentfragment') &&
        child.children.length === 1 &&
        child.children[0].classList.contains('cmp-contentfragment__elements') &&
        child.children[0].innerHTML.trim() === ''
      ) {
        return;
      }
      if (
        child.nodeType === 1 &&
        child.classList.contains('cmp-contentfragment__elements') &&
        child.innerHTML.trim() === ''
      ) {
        return;
      }
      // For nested wrappers, keep structure for semantic meaning
      cell.appendChild(child);
    });
    // If cell has only one child, just reference that element directly (for resilience)
    if (cell.childNodes.length === 1) {
      tabPanels.push(cell.firstChild);
    } else {
      tabPanels.push(cell);
    }
  });
  // Build the table
  const rows = [['Tabs (tabs7)']];
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([
      tabLabels[i],
      tabPanels[i] || ''
    ]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original .cmp-tabs element
  tabsBlock.replaceWith(table);
}
