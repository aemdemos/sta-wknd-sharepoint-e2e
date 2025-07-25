/* global WebImporter */
export default function parse(element, { document }) {
  // --- Find the hero image (first significant .cmp-image img) ---
  let heroImg = null;
  const allImages = element.querySelectorAll('.cmp-image img');
  if (allImages.length > 0) {
    // Use the first .cmp-image img as the hero image
    heroImg = allImages[0];
  }

  // --- Find the hero text content (heading, subheading, author, intro) ---
  // Strategy: Find all title blocks before the main body content, and any byline/intro paragraph
  // We'll only grab the main heading (h1), subheading/byline (h4), and the first paragraph of intro
  const heroTextElements = [];

  // 1. Main title (h1)
  const mainTitle = element.querySelector('.cmp-title h1');
  if (mainTitle) heroTextElements.push(mainTitle);

  // 2. Byline/author (h4)
  const byline = element.querySelector('.cmp-title h4');
  if (byline) heroTextElements.push(byline);

  // 3. Look for an intro paragraph in the first article.contentfragment
  let introPara = null;
  const mainArticle = element.querySelector('article.contentfragment');
  if (mainArticle) {
    // Find the first p that is not inside a blockquote or deep nested grid, prioritizing direct content
    introPara = mainArticle.querySelector('.cmp-contentfragment__elements > div > p, .cmp-contentfragment__elements > p');
    if (!introPara) {
      // fallback: first p anywhere in cmp-contentfragment__elements
      const cfEls = mainArticle.querySelector('.cmp-contentfragment__elements');
      if (cfEls) {
        introPara = cfEls.querySelector('p');
      }
    }
  }
  if (introPara) heroTextElements.push(introPara);

  // Fallback: in case introPara wasn't found, grab the first p after the heading
  if (!introPara) {
    // Find all .cmp-title h1/h4 and get the next p sibling in DOM
    let found = false;
    for (const node of element.querySelectorAll('.cmp-title h1, .cmp-title h4')) {
      let next = node.nextElementSibling;
      while (next) {
        if (next.tagName === 'P') {
          heroTextElements.push(next);
          found = true;
          break;
        }
        next = next.nextElementSibling;
      }
      if (found) break;
    }
  }

  // As a last fallback: if NOTHING found, grab all h1/h4/p in DOM order before the first article.contentfragment
  if (heroTextElements.length === 0) {
    const blockNodes = [];
    let stop = false;
    for (const node of element.querySelectorAll('h1, h4, p')) {
      if (node.closest('article.contentfragment')) { stop = true; break; }
      blockNodes.push(node);
    }
    if (blockNodes.length) {
      heroTextElements.push(...blockNodes);
    }
  }

  // --- Compose the block table ---
  // Row 1: strictly the header name, as in the example
  // Row 2: hero image (if present)
  // Row 3: array of hero text elements (existing element references only)
  const cells = [
    ['Hero (hero19)'],
    [heroImg ? heroImg : ''],
    [heroTextElements.filter(Boolean)]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
