/* global WebImporter */
export default function parse(element, { document }) {
  // Find Hero Title (h1)
  let heroTitle = element.querySelector('h1');
  // Find the Overview tabpanel (the first tabpanel)
  let overviewPanel = element.querySelector('.cmp-tabs__tabpanel');
  // Within Overview, find all main content nodes in DOM order
  let heroImage = null;
  let textContent = [];

  if (overviewPanel) {
    // Find the main contentfragment in the overview panel
    const cfArticle = overviewPanel.querySelector('article');
    let contentRoot = cfArticle ? cfArticle : overviewPanel;

    // Collect all elements that are direct children of cmp-contentfragment__elements
    let cfElements = contentRoot.querySelector('.cmp-contentfragment__elements');
    let topNodes = cfElements ? Array.from(cfElements.children) : Array.from(contentRoot.children);

    // Go through each node and collect images and all textual content in DOM order
    for (const node of topNodes) {
      // Check if the node or any of its descendants is an img
      if (!heroImage) {
        let img = node.querySelector && node.querySelector('img');
        if (img) heroImage = img;
      }
      // If the node is a heading, p, or div with text, add it
      if (node.matches && node.matches('h1,h2,h3,h4,h5,h6,p,ul,ol')) {
        textContent.push(node);
      } else if (node.tagName === 'DIV' && node.textContent && node.textContent.trim().length > 0 && node.children.length === 0) {
        textContent.push(node);
      } else {
        // If it has descendants that are p,ul,ol, add them
        if (node.querySelectorAll) {
          node.querySelectorAll('p,ul,ol').forEach(el => {
            textContent.push(el);
          });
        }
      }
    }
  }

  // Insert the h1 at the top of textContent if it exists and is not in textContent
  if (heroTitle && !textContent.includes(heroTitle)) {
    textContent.unshift(heroTitle);
  }

  // Clean up textContent: remove empty and duplicate nodes, preserve order
  const seen = new Set();
  textContent = textContent.filter(el => {
    if (!el) return false;
    if (typeof el === 'string') return el.trim().length > 0;
    if (!el.textContent || !el.textContent.trim()) return false;
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });

  // Compose the Hero block table
  const tableRows = [
    ['Hero'],
    [heroImage || ''],
    [textContent.length ? textContent : '']
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
