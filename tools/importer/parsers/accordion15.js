/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the intro section (title, byline, intro paragraph, hero image, intro image, breadcrumb)
  function extractIntroSection(element) {
    const intro = [];
    // Breadcrumb
    const breadcrumb = element.querySelector('.breadcrumb');
    if (breadcrumb) intro.push(breadcrumb.cloneNode(true));
    // Hero image (first .image in main column)
    const mainImage = element.querySelector('main .image img');
    if (mainImage) {
      const imageDiv = mainImage.closest('.image');
      if (imageDiv) intro.push(imageDiv.cloneNode(true));
    }
    // Article title
    const h1 = element.querySelector('h1.cmp-title__text');
    if (h1) intro.push(h1.cloneNode(true));
    // Byline
    const byline = element.querySelector('h4.cmp-title__text');
    if (byline) intro.push(byline.cloneNode(true));
    // Intro paragraph (first p in .cmp-contentfragment__elements)
    const introPara = element.querySelector('.cmp-contentfragment__elements > div > p');
    if (introPara) intro.push(introPara.cloneNode(true));
    // Intro image (with caption, first .cmp-contentfragment__elements .image)
    const introImg = element.querySelector('.cmp-contentfragment__elements .image');
    if (introImg) intro.push(introImg.cloneNode(true));
    return intro;
  }

  // Helper: Extract accordion items (h2 + content) from the contentfragment
  function getAccordionItems(root) {
    const items = [];
    const headings = Array.from(root.querySelectorAll('h2'));
    headings.forEach((heading) => {
      let contentNodes = [];
      let node = heading.nextSibling;
      while (node && !(node.nodeType === 1 && node.tagName === 'H2')) {
        if (node.nodeType === 1 || node.nodeType === 3) {
          if (node.nodeType === 1 && node.tagName === 'DIV') {
            const img = node.querySelector('img');
            if (img) {
              contentNodes.push(node.cloneNode(true));
            }
          } else {
            contentNodes.push(node.cloneNode(true));
          }
        }
        node = node.nextSibling;
      }
      contentNodes = contentNodes.filter(n => {
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        if (n.nodeType === 1 && n.tagName === 'DIV' && n.querySelector('img')) return true;
        if (n.nodeType === 1 && n.tagName === 'P') return n.textContent.trim().length > 0;
        return n.nodeType === 1;
      });
      items.push({
        title: heading.cloneNode(true),
        content: contentNodes.length === 1 ? contentNodes[0] : contentNodes
      });
    });
    return items;
  }

  // Find the main contentfragment article (where the accordion content lives)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  let accordionRoot = null;
  if (contentFragment) {
    accordionRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  } else {
    accordionRoot = element;
  }

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Accordion (accordion15)']);
  // First row: intro section (title, byline, intro para, hero image, intro image, breadcrumb)
  const introSection = extractIntroSection(element);
  if (introSection.length) {
    rows.push([
      'San Diego Surf Spots',
      introSection.length === 1 ? introSection[0] : introSection
    ]);
  }
  // Each accordion item as a row: [title, content]
  const accordionItems = getAccordionItems(accordionRoot);
  accordionItems.forEach(item => {
    rows.push([item.title, item.content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
