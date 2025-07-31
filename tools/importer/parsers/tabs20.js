/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Tab labels: li[role="tab"] inside .cmp-tabs__tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Tab panels: .cmp-tabs__tabpanel (order should match tab labels)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row exactly as specified
  const headerRow = ['Tabs (tabs20)'];

  // Build tab rows: each has label, content
  const rows = tabLabels.map((labelEl, i) => {
    const label = labelEl.textContent.trim();
    const panel = tabPanels[i];
    let content;
    if (panel) {
      if (panel.childElementCount === 1) {
        content = panel.firstElementChild;
      } else {
        // Use all children and text nodes
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(node => frag.appendChild(node));
        content = frag;
      }
    } else {
      content = '';
    }
    return [label, content];
  });
  
  const cells = [headerRow, ...rows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the whole tabs div (with class="tabs") with the table
  const tabsWrapper = tabs.closest('.tabs');
  if (tabsWrapper) {
    tabsWrapper.replaceWith(table);
  } else {
    // fallback to just replacing the tabs element
    tabs.replaceWith(table);
  }
}
