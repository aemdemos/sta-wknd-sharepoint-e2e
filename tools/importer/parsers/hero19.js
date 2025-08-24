/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as required
  const headerRow = ['Hero (hero19)'];

  // 2. Row 2: Find the background image (the main hero image, not author, not sidebar)
  let heroImg = null;
  const mainImages = Array.from(element.querySelectorAll('img'));
  for (const img of mainImages) {
    // Skip if image is inside a byline/aside/author block
    let p = img.parentElement;
    let skip = false;
    while (p && p !== element) {
      if (p.classList && (p.classList.contains('byline') || p.classList.contains('cmp-byline'))) {
        skip = true;
        break;
      }
      if (p.tagName === 'ASIDE') {
        skip = true;
        break;
      }
      p = p.parentElement;
    }
    if (!skip) {
      heroImg = img;
      break;
    }
  }
  const row2 = [heroImg ? heroImg : ''];

  // 3. Row 3: Collect the main title, subheading/byline, and the first introductory paragraph
  // - Title: h1
  // - Subtitle: first h4 not in sidebar or byline
  // - Intro paragraph: first p (not in quote/byline/sidebar)

  function isInSidebarOrByline(node) {
    while (node && node !== element) {
      if (node.classList && (
            node.classList.contains('byline') ||
            node.classList.contains('cmp-byline') ||
            node.classList.contains('cmp-list') ||
            node.classList.contains('cmp-separator')
          )) return true;
      if (node.tagName === 'ASIDE') return true;
      node = node.parentElement;
    }
    return false;
  }

  // Title
  let heroTitle = element.querySelector('h1');

  // Subtitle
  let heroSubheading = null;
  const allH4s = element.querySelectorAll('h4');
  for (const h4 of allH4s) {
    if (!isInSidebarOrByline(h4)) {
      heroSubheading = h4;
      break;
    }
  }

  // Intro paragraph: the first <p> not in sidebar, byline, quote, or blockquote
  let introPara = null;
  const allPs = element.querySelectorAll('p');
  for (const p of allPs) {
    let parent = p.parentElement;
    let skip = false;
    while (parent && parent !== element) {
      if (parent.tagName === 'BLOCKQUOTE') { skip = true; break; }
      if (parent.classList && (
        parent.classList.contains('byline') ||
        parent.classList.contains('cmp-byline') ||
        parent.classList.contains('cmp-list') ||
        parent.classList.contains('cmp-separator') ||
        parent.classList.contains('cmp-text'))) {
        skip = true;
        break;
      }
      if (parent.tagName === 'ASIDE') {
        skip = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (!skip) {
      introPara = p;
      break;
    }
  }

  // Compose third row cell
  const row3cell = [];
  if (heroTitle) row3cell.push(heroTitle);
  if (heroSubheading) {
    if (row3cell.length) row3cell.push(document.createElement('br'));
    row3cell.push(heroSubheading);
  }
  if (introPara) {
    if (row3cell.length) row3cell.push(document.createElement('br'));
    row3cell.push(introPara);
  }
  if (!row3cell.length) row3cell.push('');

  // 4. Build and replace
  const cells = [headerRow, row2, [row3cell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
