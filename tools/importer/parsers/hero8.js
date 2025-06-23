/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main heading (h1)
  const h1 = element.querySelector('h1');

  // Find the Overview tab panel (active)
  let overviewTabPanel = null;
  const tabs = element.querySelector('.cmp-tabs');
  if (tabs) {
    // The tab panel with class 'cmp-tabs__tabpanel--active' or first .cmp-tabs__tabpanel
    overviewTabPanel = tabs.querySelector('.cmp-tabs__tabpanel--active') || tabs.querySelector('.cmp-tabs__tabpanel');
  }

  // Find the content fragment elements inside the overview
  let overviewContentParent = null;
  if (overviewTabPanel) {
    const article = overviewTabPanel.querySelector('article');
    if (article) {
      // Prefer .cmp-contentfragment__elements, fallback to article
      overviewContentParent = article.querySelector('.cmp-contentfragment__elements') || article;
    } else {
      overviewContentParent = overviewTabPanel;
    }
  }

  // Collect all relevant nodes under Overview content fragment: headings, paragraphs, lists, and images (in order)
  let contentNodes = [];
  if (overviewContentParent) {
    // Get all direct children, but also allow for images inside nested divs
    Array.from(overviewContentParent.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (["h1","h2","h3","h4","h5","h6","p","ul","ol"].includes(tag)) {
          contentNodes.push(node);
        } else if (tag === 'div') {
          // if the div contains a .cmp-image or <img>
          const cmpImages = node.querySelectorAll('.cmp-image');
          if (cmpImages.length > 0) {
            cmpImages.forEach(imgDiv => {
              // Use the .cmp-image div as-is (for resilient referencing)
              contentNodes.push(imgDiv);
            });
          } else {
            // also add direct imgs in the div (if not inside .cmp-image)
            const imgs = node.querySelectorAll('img');
            imgs.forEach(img => {
              // Only push the img if not already inside a .cmp-image
              if (!img.closest('.cmp-image')) {
                contentNodes.push(img);
              }
            });
          }
        }
      }
    });
  }

  // Determine the hero image: first .cmp-image (or img) in contentNodes
  let heroImg = '';
  for (const n of contentNodes) {
    if (n.nodeType === Node.ELEMENT_NODE && (n.classList.contains('cmp-image') || n.tagName.toLowerCase() === 'img')) {
      heroImg = n.classList.contains('cmp-image') ? n.querySelector('img') || n : n;
      break;
    }
  }

  // Remove the hero img from contentNodes so it's not duplicated in text row
  if (heroImg) {
    contentNodes = contentNodes.filter(n => {
      // Remove node if it's the hero image or .cmp-image div containing that img
      if (n === heroImg) return false;
      if (n.classList && n.classList.contains('cmp-image') && n.contains(heroImg)) return false;
      return true;
    });
  }

  // Compose the final rows according to block spec and markdown example
  // Header row
  const headerRow = ['Hero'];
  // Second row: hero image (may be empty)
  const imageRow = [heroImg || ''];
  // Third row: h1 (heading) and all the content nodes from Overview tab
  const contentRow = [];
  if (h1) contentRow.push(h1);
  if (contentNodes.length) contentRow.push(...contentNodes);
  // If both are empty, put empty string
  const finalContentRow = contentRow.length ? [contentRow] : [''];

  const cells = [
    headerRow,
    imageRow,
    finalContentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
