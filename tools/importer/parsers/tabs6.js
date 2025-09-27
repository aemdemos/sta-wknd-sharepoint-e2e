/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to trim and normalize text
  function cleanText(text) {
    return text ? text.trim().replace(/\s+/g, ' ') : '';
  }

  // Find the tabs block root (the main .tabs.panelcontainer)
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map((li) => cleanText(li.textContent));

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: ensure label/panel count matches
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs6)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Extract the main content inside the tabpanel
    // Use the .contentfragment if present, else all children
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: create a fragment with all children
      const frag = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      tabContent = frag;
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(table);
}
