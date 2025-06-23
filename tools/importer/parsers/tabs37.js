/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the given element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs, [data-cmp-is="tabs"]');
  if (!tabsBlock) return;

  // The actual tabs block is likely .cmp-tabs inside .tabs.panelcontainer
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Extract tab labels from the tablist (ol > li)
  const tabList = cmpTabs.querySelector('ol.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.children) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Extract tab panels: look for direct children of cmpTabs with role="tabpanel" (or .cmp-tabs__tabpanel)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // For each tab, get its label and content
  const tabRows = tabPanels.map((tabpanel, i) => {
    // The label for this tab (if missing, fallback to aria-labelledby lookup)
    let label = tabLabels[i];
    if (!label && tabpanel.hasAttribute('aria-labelledby')) {
      const labelId = tabpanel.getAttribute('aria-labelledby');
      const labelEl = document.getElementById(labelId);
      if (labelEl) label = labelEl.textContent.trim();
    }
    if (!label) label = `Tab ${i+1}`;

    // The content for this tab: use all ELEMENT children of tabpanel, or fallback to tabpanel
    // This avoids including whitespace/text nodes or script/style
    const contentElements = Array.from(tabpanel.children).filter(node => {
      return node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE';
    });
    let cellContent;
    if (contentElements.length === 1) {
      cellContent = contentElements[0];
    } else if (contentElements.length > 1) {
      cellContent = contentElements;
    } else {
      // fallback: use tabpanel's entire content
      cellContent = tabpanel;
    }
    return [label, cellContent];
  });

  // Compose the final cells array: first row is block name, then each tab row
  const cells = [
    ['Tabs (tabs37)'],
    ...tabRows
  ];

  // Create the block table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
