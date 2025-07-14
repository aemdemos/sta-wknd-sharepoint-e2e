/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the first large hero image (.cmp-image) at the top
  function getHeroImageBlock(el) {
    // Search for a .cmp-image inside an .image that is a direct child of the main container
    const directImage = el.querySelector(':scope > div > .image .cmp-image');
    if (directImage) return directImage;
    // Fallback: first .cmp-image anywhere under this element
    const fallbackImg = el.querySelector('.cmp-image');
    return fallbackImg || '';
  }

  // 2. Gather all title and intro text (headline, subheading/byline, and first content p)
  function getHeroTextBlock(el) {
    // Find the first .cmp-title h1 as Title
    let mainTitle = null;
    let subheading = null;
    let cfIntroPara = null;
    // Title and subheading (e.g. author) in .cmp-title__text
    const cmpTitles = el.querySelectorAll('.cmp-title__text');
    cmpTitles.forEach(t => {
      if (!mainTitle && t.tagName === 'H1') mainTitle = t;
      else if (!subheading && t.tagName.match(/^H[2-6]$/)) subheading = t;
    });
    // Find first <p> in main article content (e.g. inside .cmp-contentfragment__elements)
    const cf = el.querySelector('.cmp-contentfragment__elements');
    if (cf) {
      cfIntroPara = cf.querySelector('p');
    }
    // Compose content in document order: H1, subheading, intro paragraph
    const content = [];
    if (mainTitle) content.push(mainTitle);
    if (subheading) content.push(subheading);
    if (cfIntroPara) content.push(cfIntroPara);
    // If all are missing, fallback: first h1 and first p anywhere
    if (!content.length) {
      const h1 = el.querySelector('h1');
      if (h1) content.push(h1);
      const p = el.querySelector('p');
      if (p) content.push(p);
    }
    // If any content was found, return as array
    if (content.length) return content;
    // Fallback: return empty string
    return '';
  }

  // Structure per example: header, image row, text row
  const headerRow = ['Hero (hero35)'];
  const imageBlock = getHeroImageBlock(element) || '';
  const textBlock = getHeroTextBlock(element) || '';
  const cells = [
    headerRow,
    [imageBlock],
    [textBlock]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
