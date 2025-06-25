/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (find first .cmp-tabs inside this element)
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // 1. Extract tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 2. Extract tab panels and contents in their original order
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // 3. Build the table block
  // Header row (always exactly: Tabs (tabs12))
  const blockHeader = ['Tabs (tabs12)'];
  const cells = [blockHeader];

  // 4. For each tab: [label, content]
  tabPanels.forEach((panel, idx) => {
    // Get label by index in tabLabels
    let label = tabLabels[idx] || '';
    if (!label && panel.hasAttribute('aria-labelledby')) {
      const tabId = panel.getAttribute('aria-labelledby');
      const tabElem = tabId ? cmpTabs.querySelector(`#${tabId}`) : null;
      if (tabElem) label = tabElem.textContent.trim();
    }

    // For content: Prefer to reference the direct children, skipping empty or structural elements
    const children = Array.from(panel.children).filter(child => {
      // Ignore empty grid containers and empty divs
      if (
        child.classList.contains('aem-Grid') ||
        (child.tagName === 'DIV' && child.textContent.trim() === '' && child.children.length === 0)
      ) return false;
      return true;
    });

    let contentCell;
    if (children.length === 1) {
      contentCell = children[0];
    } else if (children.length > 1) {
      contentCell = children;
    } else {
      // Fallback: if no element children, reference the panel itself
      contentCell = panel;
    }

    cells.push([label, contentCell]);
  });

  // 5. Create the table and replace the cmp-tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  cmpTabs.replaceWith(table);
}
