/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root in this element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements inside the tablist)
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children);

  // Get tab panels (in the order in the markup)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // The table header row: block name and variant
  const rows = [['Tabs (tabs25)']];

  // Edge case: no tab labels or panels
  if (tabLabels.length === 0 || tabPanels.length === 0) {
    // At a minimum, replace with an empty block
    const block = WebImporter.DOMUtils.createTable(rows, document);
    tabsRoot.replaceWith(block);
    return;
  }

  // For each tab, create a row: [label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const labelLi = tabLabels[i];
    const labelText = labelLi.textContent.trim();
    // Use the actual label element from the DOM where possible, otherwise create a <span>
    let labelNode;
    if (labelLi.childNodes.length === 1 && labelLi.childNodes[0].nodeType === 3) {
      // If label is plain text, wrap in <strong> for tab header style
      labelNode = document.createElement('strong');
      labelNode.textContent = labelText;
    } else {
      // If it contains other elements, use them all
      labelNode = document.createElement('span');
      labelNode.append(...Array.from(labelLi.childNodes));
    }

    // Get the corresponding tab content
    const panel = tabPanels[i];
    // Some tabs may not have a content panel
    let contentNode;
    if (panel) {
      // Use a wrapper div to contain all panel children (preserving original elements)
      contentNode = document.createElement('div');
      // Only append if there are actual children
      Array.from(panel.childNodes).forEach((child) => {
        // Reference original element; do not clone
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim().length)) {
          contentNode.appendChild(child);
        }
      });
    } else {
      // Fallback: empty
      contentNode = document.createElement('div');
    }
    rows.push([labelNode, contentNode]);
  }

  // Create the final block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(block);
}
