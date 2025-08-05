/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab label elements (li)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll(':scope > .cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get tab panel elements (divs)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll(':scope > .cmp-tabs__tabpanel')
  );

  // Table: first row is single header cell
  const rows = [["Tabs (tabs28)"]];
  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i]?.textContent?.trim() || '';
    let panelContent = '';
    const panel = tabPanels[i];
    if (panel) {
      // Get all children that are not empty grid wrappers
      const children = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains('aem-Grid') || node.classList.contains('aem-Grid--12') || node.classList.contains('aem-Grid--default--12')) {
            return false;
          }
          return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return false;
      });
      if (children.length === 1) {
        panelContent = children[0];
      } else if (children.length > 1) {
        panelContent = children;
      }
    }
    rows.push([labelText, panelContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
