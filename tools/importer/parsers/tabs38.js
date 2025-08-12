/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab component inside the provided element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels from the tablist (li[role="tab"])
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // Header row should exactly match: Tabs (tabs38)
  const cells = [['Tabs (tabs38)']];

  // For each tab label, find its matching tabpanel and extract its content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find corresponding tabpanel
    let panelEl = null;
    const ariaControls = tabLabels[i].getAttribute('aria-controls');
    if (ariaControls) {
      panelEl = tabsEl.querySelector(`#${ariaControls}`);
    } else {
      // Fallback: by index
      panelEl = tabPanels[i];
    }

    // Prepare content: reference existing content elements
    let tabContent = '';
    if (panelEl) {
      // For robustness, collect all child nodes (preserves structure: headings, paragraphs, images, lists)
      // Remove empty text nodes
      const fragment = document.createDocumentFragment();
      Array.from(panelEl.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        fragment.appendChild(node);
      });
      tabContent = fragment;
    }
    cells.push([label, tabContent]);
  }

  // Create the block table using the helper
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with block table
  element.replaceWith(block);
}
