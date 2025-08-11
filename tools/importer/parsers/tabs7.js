/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Extract tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 2. Extract tab panel content, referencing the existing main content block
  //    Each tabpanel is a .cmp-tabs__tabpanel, the content of interest is usually the <article>
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabContents = tabPanels.map(panel => {
    // Use the first article if present, else the panel itself
    const article = panel.querySelector('article');
    return article || panel;
  });

  // Only keep as many tabs as there are labels (prevents mismatch)
  const labelCount = tabLabels.length;
  const contentCount = tabContents.length;
  const tabCount = Math.min(labelCount, contentCount);

  // 3. Construct table rows
  // First row: only the block name
  const headerRow = ['Tabs (tabs7)'];
  // Second row: tab labels
  const labelRow = tabLabels.slice(0, tabCount);
  // Third row: tab contents (reference elements)
  const contentRow = tabContents.slice(0, tabCount);

  // The structure is as follows:
  // [ ["Tabs (tabs7)", <empty>, ... ], [tab1, tab2, tab3], [content1, content2, content3] ]
  // But per the markdown example, first row is header, then each row is a tab: [label, content]
  // So, let's build as:
  // [ ['Tabs (tabs7)'] ]
  // [ [label1, content1] ]
  // [ [label2, content2] ]
  // ...
  const cells = [ [ 'Tabs (tabs7)' ] ];
  for (let i = 0; i < tabCount; i++) {
    cells.push([tabLabels[i], tabContents[i]]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
