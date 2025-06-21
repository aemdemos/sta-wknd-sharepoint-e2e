/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Hero'];

  // IMAGE ROW: Get first main hero image (not byline, not author)
  let heroImage = '';
  const images = element.querySelectorAll('img');
  for (const img of images) {
    const cmpImage = img.closest('.cmp-image');
    if (cmpImage && !cmpImage.closest('.cmp-byline') && !cmpImage.closest('.byline')) {
      heroImage = cmpImage;
      break;
    }
  }

  // CONTENT ROW: All content that is part of the hero (heading, author, intro)
  // 1. Get all immediate children of main content that are not nav/breadcrumb/sidebar/byline/list
  const contentParts = [];
  // Get the main container that has heading, author, and main article content
  // Typical structure: .cmp-container > .title/.contentfragment
  // 1. Main heading block
  const mainTitle = element.querySelector('.title .cmp-title h1');
  if (mainTitle) {
    const mainTitleParent = mainTitle.closest('.title');
    if (mainTitleParent) contentParts.push(mainTitleParent);
  }

  // 2. Author/byline under heading (still in hero area, h4)
  const author = element.querySelector('.title .cmp-title h4');
  if (author) {
    const authorParent = author.closest('.title');
    // Only push if not already in contentParts
    if (authorParent && !contentParts.includes(authorParent)) {
      contentParts.push(authorParent);
    }
  }

  // 3. Main intro/lede text, usually first <article> with .cmp-contentfragment/.contentfragment
  // This contains the h3 (section title) and the text paragraphs
  let cf = element.querySelector('article.cmp-contentfragment, .cmp-contentfragment');
  if (cf) {
    contentParts.push(cf);
  } else {
    // fallback: find main content area with lots of paragraphs
    const paragraphs = element.querySelectorAll('p');
    if (paragraphs.length) {
      // Group all paragraphs before the first non-empty h2/h3/h4 (not in byline/title)
      for (let i = 0; i < paragraphs.length; i++) {
        contentParts.push(paragraphs[i]);
      }
    }
  }

  // Compose the rows
  const rows = [
    headerRow,
    [heroImage || ''],
    [contentParts.length ? contentParts : '']
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
