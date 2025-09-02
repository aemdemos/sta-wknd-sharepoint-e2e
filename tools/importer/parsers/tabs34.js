/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLis = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLis.map(li => li.textContent.trim());

  // Get all tabpanel elements in order
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare tab contents (one cell per tab content, matching the tab label order)
  const tabContents = tabPanels.map(tabPanel => {
    if (tabPanel) {
      // Grab all non-empty child nodes (elements or text)
      const children = Array.from(tabPanel.childNodes).filter(
        n => !(n.nodeType === 3 && n.textContent.trim() === '') && !(n.nodeType === 8)
      );
      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        return wrapper;
      } else {
        return '';
      }
    }
    return '';
  });

  // Compose the block table as per the markdown example
  // Row 1: header (single column)
  // Row 2: labels (each label in a column)
  // Row 3: content (each tab's content in a matching column)
  const rows = [];
  rows.push(['Tabs (tabs34)']);
  rows.push(tabLabels);
  rows.push(tabContents);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original tabs block with the new block
  tabsRoot.replaceWith(block);
}
