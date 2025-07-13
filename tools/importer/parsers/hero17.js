/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero17) block: prominent image, a headline, optional subheading, and intro text
  // 1. Find the first prominent image (background image for hero)
  let heroImg = null;
  // Look for the first image at the top of the block
  const allImages = element.querySelectorAll('.cmp-image');
  for (const imgDiv of allImages) {
    const img = imgDiv.querySelector('img');
    if (img && imgDiv.offsetTop < 400) { // Heuristic: at top of block
      heroImg = imgDiv;
      break;
    }
  }

  // 2. Gather all hero content (title, byline, and all intro content above the first main content section)
  //    The hero is usually at the very top, so get all elements after the image up to (not including) the first h2 or main article
  const heroContent = [];
  // Find all top-level children
  const children = Array.from(element.children);
  let startCollect = false;
  let stopCollect = false;
  for (const child of children) {
    // Skip the image if it's first
    if (heroImg && (child === heroImg || child.contains(heroImg))) {
      startCollect = true;
      continue;
    }
    if (!startCollect) continue;
    // Stop collection at first h2 or article.cmp-contentfragment
    if (
      child.querySelector('h2') ||
      child.classList.contains('cmp-contentfragment') ||
      child.querySelector('.cmp-contentfragment') ||
      child.classList.contains('experiencefragment')
    ) {
      stopCollect = true;
      break;
    }
    // For .title blocks, grab headings only
    if (child.classList.contains('title')) {
      const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) heroContent.push(heading);
    } else if (child.classList.contains('breadcrumb')) {
      continue; // skip breadcrumbs
    } else {
      // Add the entire child
      heroContent.push(child);
    }
  }
  // If nothing was collected, fallback to main heading and byline if available
  if (heroContent.length === 0) {
    const h1 = element.querySelector('h1');
    if (h1) heroContent.push(h1);
    const h4 = element.querySelector('h4');
    if (h4) heroContent.push(h4);
    // Also try to include the top intro paragraph if present
    const firstP = element.querySelector('p');
    if (firstP) heroContent.push(firstP);
  }

  // Remove any empty elements from heroContent
  const filteredHeroContent = heroContent.filter(el => {
    if (!el) return false;
    if (typeof el === 'string') return el.trim().length > 0;
    if (el.textContent && el.textContent.trim().length > 0) return true;
    if (el.querySelector && el.querySelector('*')) return true;
    return false;
  });

  // 3. Build the block table cells
  const cells = [
    ['Hero (hero17)'],
    [heroImg ? heroImg : ''],
    [filteredHeroContent.length ? filteredHeroContent : '']
  ];

  // 4. Create the block and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
