/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main heading: prefer h1, fallback to first h2/h3 inside the left or center content
  let heroHeading = element.querySelector('h1');
  if (!heroHeading) {
    heroHeading = element.querySelector('h2, h3');
  }

  // Find the most prominent image: Prefer first tabpanel's first <img>
  let heroImage = null;
  const tabPanel = element.querySelector('.cmp-tabs__tabpanel');
  if (tabPanel) {
    heroImage = tabPanel.querySelector('img');
  }
  if (!heroImage) {
    heroImage = element.querySelector('img');
  }

  // Gather all meaningful elements/text from the Overview tabpanel except heading and image
  let heroTextContent = [];
  if (tabPanel) {
    // Try to get content from .cmp-contentfragment__elements (which bundles text in AEM Content Fragments)
    let cfElements = tabPanel.querySelector('.cmp-contentfragment__elements');
    if (!cfElements) cfElements = tabPanel;
    // Get all blocks that are not just layout grid wrappers or empty
    let blocks = Array.from(cfElements.childNodes).filter(node => {
      // Node is element
      if (node.nodeType === 1) {
        // skip grid/layout wrappers
        if (node.classList && Array.from(node.classList).some(c => c.startsWith('aem-Grid'))) return false;
        // skip image wrappers
        if (heroImage && (node === heroImage || node.contains(heroImage))) return false;
        // skip heading if already in heroHeading
        if (heroHeading && node === heroHeading) return false;
        // skip if node is empty
        if (!node.textContent.trim() && !node.querySelector('img, p, ul, ol, h2, h3, h4, h5, h6')) return false;
        return true;
      } else if (node.nodeType === 3) {
        // text node: must not be empty
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    // If blocks found, use them. Else, use all <p>, <ul>, <ol>, <h2>, <h3>, <h4>, <h5>, <h6> in tabPanel (except heading)
    if (blocks.length) {
      heroTextContent = blocks;
    } else {
      const all = Array.from(tabPanel.querySelectorAll('p, ul, ol, h2, h3, h4, h5, h6')).filter(el => {
        if (heroHeading && heroHeading.isSameNode(el)) return false;
        return true;
      });
      heroTextContent = all;
    }
  }

  // Compose the third row: heading (if present), then all heroTextContent
  const row3content = [];
  if (heroHeading) row3content.push(heroHeading);
  if (heroTextContent.length) row3content.push(...heroTextContent);

  // Always create the Hero table per example
  const cells = [
    ['Hero'],
    [heroImage ? heroImage : ''],
    [row3content.length ? row3content : ''],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
