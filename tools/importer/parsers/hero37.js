/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first image in the hero area
  function findHeroImage(root) {
    // Look for the first .image block with an img inside
    const img = root.querySelector('.image img');
    return img ? img.cloneNode(true) : '';
  }

  // Helper to find the main title (h1) in the hero area
  function findHeroTitle(root) {
    // Look for the first h1 in the hero area
    const h1 = root.querySelector('h1');
    return h1 ? h1.cloneNode(true) : '';
  }

  // Helper to find the subheading (author/byline) in the hero area
  function findHeroSubheading(root) {
    // Try h4 (author)
    const h4 = root.querySelector('h4');
    if (h4) return h4.cloneNode(true);
    // Try byline in experiencefragment
    const byline = root.querySelector('.cmp-byline__name');
    if (byline) return byline.cloneNode(true);
    return '';
  }

  // Helper to find a call-to-action in the hero area (not present in this example, but for generality)
  function findHeroCTA(root) {
    // Look for a button or link styled as a CTA in the hero area
    // Try download link
    const download = root.querySelector('.cmp-download__action');
    if (download) return download.cloneNode(true);
    return '';
  }

  // Helper to find the first main content paragraph (for subheading if no byline)
  function findHeroIntro(root) {
    // Look for the first article/contentfragment paragraph
    const mainP = root.querySelector('article .cmp-contentfragment__elements p');
    return mainP ? mainP.cloneNode(true) : '';
  }

  // Helper to find all text content in the hero area (for flexibility)
  function findAllHeroText(root) {
    // Find h1, h4, byline, and the first contentfragment paragraph
    const nodes = [];
    const h1 = root.querySelector('h1');
    if (h1) nodes.push(h1.cloneNode(true));
    const h4 = root.querySelector('h4');
    if (h4) nodes.push(h4.cloneNode(true));
    const byline = root.querySelector('.cmp-byline__name');
    if (byline) nodes.push(byline.cloneNode(true));
    // Add occupations if present
    const occ = root.querySelector('.cmp-byline__occupations');
    if (occ) nodes.push(occ.cloneNode(true));
    // Add first intro paragraph
    const intro = root.querySelector('article .cmp-contentfragment__elements p');
    if (intro) nodes.push(intro.cloneNode(true));
    return nodes;
  }

  // 1. Header row
  const headerRow = ['Hero (hero37)'];

  // 2. Background image row
  const heroImage = findHeroImage(element);
  const imageRow = [heroImage];

  // 3. Content row: all relevant hero text and CTA
  const heroTextNodes = findAllHeroText(element);
  const cta = findHeroCTA(element);
  if (cta) heroTextNodes.push(cta);
  const contentRow = [heroTextNodes.length ? heroTextNodes : ''];

  // Compose the table
  const tableCells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
