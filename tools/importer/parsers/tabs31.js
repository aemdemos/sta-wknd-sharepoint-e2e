/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tablist = tabs.querySelector('[role="tablist"]');
  if (!tablist) return;
  const tabLabelEls = Array.from(tablist.children).filter(el => el.textContent && el.textContent.trim());
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab content panels in DOM order
  const tabpanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Table: header is exactly as required by requirements
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];
  
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabpanels[i];
    let tabContent;
    if (panel) {
      // Find only non-empty nodes
      const contentNodes = Array.from(panel.childNodes).filter(n =>
        !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '')
      );
      if (contentNodes.length === 1) {
        tabContent = contentNodes[0];
      } else if (contentNodes.length > 1) {
        // Use a document fragment to keep references, not clones
        const frag = document.createDocumentFragment();
        contentNodes.forEach(n => frag.appendChild(n));
        tabContent = frag;
      } else {
        tabContent = '';
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
