/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab labels and tab contents
  function getTabsData(tabsElement) {
    const tabsData = [];
    // Get tab labels
    const tabLabels = Array.from(tabsElement.querySelectorAll('.cmp-tabs__tablist > li'));
    // Get tab panels
    const tabPanels = Array.from(tabsElement.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
    // Defensive: ensure labels and panels match
    for (let i = 0; i < tabLabels.length; i++) {
      const label = tabLabels[i]?.textContent?.trim() || '';
      const panel = tabPanels[i];
      let tabContent = null;
      if (panel) {
        // Find the main contentfragment/article inside the panel
        const cf = panel.querySelector('article.cmp-contentfragment');
        if (cf) {
          // For Overview, include image, h3, and description
          if (label.toLowerCase() === 'overview') {
            // Get h3 title
            const h3 = cf.querySelector('.cmp-contentfragment__elements h3');
            // Get image
            const imgDiv = cf.querySelector('.cmp-image');
            // Get description paragraph (the first <p> after h3)
            let descP = null;
            if (h3) {
              descP = h3.parentElement.querySelector('p');
            }
            // Compose content
            const contentArr = [];
            if (h3) contentArr.push(h3);
            if (imgDiv) contentArr.push(imgDiv);
            if (descP) contentArr.push(descP);
            tabContent = document.createElement('div');
            contentArr.forEach(el => {
              if (el) tabContent.appendChild(el);
            });
          } else if (label.toLowerCase() === 'itinerary') {
            // For Itinerary, include all winery sections
            const winerySections = document.createElement('div');
            const elementsDiv = cf.querySelector('.cmp-contentfragment__elements');
            if (elementsDiv) {
              // Find all h3s and their following <p>
              const h3s = elementsDiv.querySelectorAll('h3');
              h3s.forEach(h3 => {
                // Find next <p> sibling
                let p = h3.nextElementSibling;
                while (p && p.tagName !== 'P') {
                  p = p.nextElementSibling;
                }
                if (p) {
                  winerySections.appendChild(h3);
                  winerySections.appendChild(p);
                }
              });
            }
            tabContent = winerySections;
          } else if (label.toLowerCase() === 'what to bring') {
            // For What to Bring, include the <ul>
            const elementsDiv = cf.querySelector('.cmp-contentfragment__elements');
            const ul = elementsDiv ? elementsDiv.querySelector('ul') : null;
            if (ul) {
              tabContent = ul;
            } else {
              tabContent = document.createElement('div');
            }
          } else {
            // Fallback: use all content inside panel
            tabContent = panel;
          }
        } else {
          tabContent = panel;
        }
      } else {
        tabContent = document.createElement('div');
      }
      tabsData.push([label, tabContent]);
    }
    return tabsData;
  }

  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // Get tab data
  const tabsData = getTabsData(tabsBlock);
  tabsData.forEach(([label, content]) => {
    rows.push([label, content]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
