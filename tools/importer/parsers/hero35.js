/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Overview tabpanel (the main hero section content)
  const tabPanels = element.querySelectorAll('.cmp-tabs__tabpanel');
  let overviewPanel = null;
  for (const panel of tabPanels) {
    const dataLayer = panel.getAttribute('data-cmp-data-layer') || '';
    if (dataLayer.includes('Overview')) {
      overviewPanel = panel;
      break;
    }
  }
  if (!overviewPanel && tabPanels.length > 0) {
    overviewPanel = tabPanels[0];
  }

  // The overviewPanel should contain a .contentfragment > article
  let cf = overviewPanel ? overviewPanel.querySelector('article.cmp-contentfragment') : null;
  if (!cf) cf = overviewPanel || element;

  // Find the first <img> (background/hero image)
  let imageEl = cf.querySelector('img');

  // Collect all block-level content: headings, paragraphs, and lists, in DOM order at any depth
  const blockTags = ['H1','H2','H3','H4','H5','H6','P','UL','OL'];
  const textBlocks = [];
  function collectBlocks(node) {
    if (blockTags.includes(node.tagName)) {
      textBlocks.push(node);
    } else {
      // Only traverse element children
      Array.from(node.children).forEach(collectBlocks);
    }
  }
  collectBlocks(cf);
  // Remove any image-only elements
  const filteredBlocks = textBlocks.filter(el => {
    if (el.tagName === 'P' && el.querySelector('img')) {
      // Paragraph that contains only an image
      return false;
    }
    return true;
  });

  // Build the table for the Hero block as per the example
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [filteredBlocks.length ? filteredBlocks : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
