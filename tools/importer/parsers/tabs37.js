/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabelNodes = Array.from(
    tabsRoot.querySelectorAll(':scope > .cmp-tabs__tablist > li[role="tab"]')
  );
  const tabLabels = tabLabelNodes.map(li => li.textContent.trim());

  // Get all tab panel elements in order
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll(':scope > .cmp-tabs__tabpanel')
  );

  // Table header as per guidelines
  const rows = [['Tabs (tabs37)']];

  // For each tab: label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    // Gather all direct children of tabpanel that are elements
    const contentElements = Array.from(panel.children).filter(
      (child) => child.nodeType === Node.ELEMENT_NODE
    );
    // If there is only one, use it directly; else, use array
    const contentCell = contentElements.length === 1 ? contentElements[0] : contentElements;
    rows.push([label, contentCell]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabsRoot with block table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
