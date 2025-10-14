/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build rows: header, then one row per tab (label, content)
  const rows = [];
  rows.push(['Tabs (tabs34)']);

  for (let i = 0; i < numTabs; i++) {
    const label = tabLabels[i]?.textContent?.trim() || `Tab ${i + 1}`;
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Only keep relevant tab content: headings, images, paragraphs, lists
      const fragment = document.createElement('div');
      Array.from(panel.children).forEach((child) => {
        // Accept only semantic content elements
        if ([
          'H1','H2','H3','H4','H5','H6',
          'IMG','PICTURE','FIGURE',
          'P','UL','OL','LI','TABLE','BLOCKQUOTE','HR','BR','EM','STRONG','B','I','SPAN','A',
        ].includes(child.tagName)) {
          fragment.appendChild(child.cloneNode(true));
        } else if (child.querySelector('h1,h2,h3,h4,h5,h6,p,ul,ol,img,picture,figure,table,blockquote,hr,br,em,strong,b,i,span,a')) {
          // If it's a div or other wrapper, extract its semantic children
          Array.from(child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,ul,ol,img,picture,figure,table,blockquote,hr,br,em,strong,b,i,span,a')).forEach((el) => {
            fragment.appendChild(el.cloneNode(true));
          });
        }
      });
      content = fragment;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
