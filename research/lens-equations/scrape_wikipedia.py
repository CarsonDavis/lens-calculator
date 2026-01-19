"""
Scrape Wikipedia pages with proper equation extraction.

Wikipedia renders equations as images with LaTeX in the alt attribute.
This scraper extracts the full content with equations properly formatted.
"""

from playwright.sync_api import sync_playwright


def scrape_wikipedia_page(url: str) -> dict:
    """
    Scrape a Wikipedia page, extracting text content and equations.

    Returns:
        dict with 'title', 'content' (with equations inline), and 'equations' list
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded")

        # Get title
        title = page.query_selector("h1#firstHeading").inner_text()

        # Get main content
        content_div = page.query_selector("div.mw-content-ltr")

        # Extract all equations with their alt text
        equations = []
        math_images = page.query_selector_all("img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display")
        for img in math_images:
            alt = img.get_attribute("alt")
            if alt:
                equations.append(alt)

        # Remove navboxes, footer content, and other junk before extracting
        page.evaluate("""
            () => {
                // Remove navigation boxes
                document.querySelectorAll('.navbox, .navbox-styles, .mw-authority-control').forEach(el => el.remove());
                // Remove categories
                document.querySelectorAll('#catlinks, .catlinks').forEach(el => el.remove());
                // Remove "See also" and everything after in many cases
                document.querySelectorAll('.portalbox, .portal, .sistersitebox').forEach(el => el.remove());
                // Remove edit links
                document.querySelectorAll('.mw-editsection').forEach(el => el.remove());
                // Remove hidden elements
                document.querySelectorAll('.mw-hidden-catlinks, .noprint').forEach(el => el.remove());
            }
        """)

        # Build content with equations properly formatted
        content_parts = []

        # Get all paragraphs, headings, lists, and tables from the content
        elements = content_div.query_selector_all("p, h2, h3, h4, ul, ol, table.wikitable, dl")

        # Sections to stop at (we don't want these in the output)
        stop_sections = {"See also", "Notes", "References", "External links", "Further reading", "Bibliography"}
        should_stop = False

        for elem in elements:
            if should_stop:
                break

            # Skip elements inside reference/notes sections or after See also
            is_in_refs = elem.evaluate("""
                (el) => {
                    // Check if element is after a "See also" or similar section heading
                    const stopIds = ['See_also', 'References', 'Notes', 'External_links', 'Further_reading', 'Bibliography'];
                    for (const id of stopIds) {
                        const heading = document.getElementById(id);
                        if (heading) {
                            // Check if this element comes after the heading in document order
                            if (heading.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
                                return true;
                            }
                        }
                    }

                    let parent = el;
                    while (parent) {
                        if (parent.classList && (
                            parent.classList.contains('reflist') ||
                            parent.classList.contains('references') ||
                            parent.classList.contains('mw-references-wrap')
                        )) {
                            return true;
                        }
                        parent = parent.parentElement;
                    }
                    return false;
                }
            """)
            if is_in_refs:
                continue

            tag_name = elem.evaluate("el => el.tagName.toLowerCase()")

            if tag_name in ("h2", "h3", "h4"):
                # Extract heading text - try mw-headline first, then fall back to full text
                heading_text = elem.query_selector(".mw-headline")
                if heading_text:
                    heading_str = heading_text.inner_text().strip()
                else:
                    heading_str = elem.inner_text().strip()
                    # Remove [edit] suffix if present
                    if heading_str.endswith("[edit]"):
                        heading_str = heading_str[:-6].strip()

                # Stop if we hit a section we don't want
                heading_lower = heading_str.lower()
                if (heading_str in stop_sections or
                    "reference" in heading_lower or
                    "external link" in heading_lower or
                    "further reading" in heading_lower or
                    "bibliography" in heading_lower or
                    "cited" in heading_lower or
                    "citation" in heading_lower or
                    "note" in heading_lower or
                    "see also" in heading_lower):
                    should_stop = True
                    continue

                level = int(tag_name[1])
                prefix = "#" * level
                content_parts.append(f"\n{prefix} {heading_str}\n")

            elif tag_name == "p":
                # Process paragraph, replacing math images with their alt text
                text = process_element_with_math(elem)
                if text.strip():
                    content_parts.append(text + "\n")

            elif tag_name in ("ul", "ol"):
                # Process list items
                items = elem.query_selector_all("li")
                for item in items:
                    text = process_element_with_math(item)
                    if text.strip():
                        content_parts.append(f"- {text}\n")
                content_parts.append("\n")

            elif tag_name == "dl":
                # Definition lists (often used for indented content)
                dds = elem.query_selector_all("dd")
                for dd in dds:
                    text = process_element_with_math(dd)
                    if text.strip():
                        content_parts.append(f"  {text}\n")

            elif tag_name == "table":
                # Process tables
                content_parts.append(process_table(elem))

        browser.close()

        return {
            "title": title,
            "url": url,
            "content": "".join(content_parts),
            "equations": equations,
        }


def process_element_with_math(elem) -> str:
    """
    Process an element, replacing math images with their LaTeX alt text.
    Skips MathML elements to avoid duplicate equation text.
    """
    # Use JavaScript to walk the DOM and extract text with math
    result = elem.evaluate("""
        (el) => {
            let text = '';
            function walk(node) {
                if (node.nodeType === 3) {  // Text node
                    text += node.textContent;
                } else if (node.nodeType === 1) {  // Element node
                    const tagName = node.tagName.toUpperCase();

                    // Skip MathML elements entirely - we get equations from img alt text
                    if (tagName === 'MATH' || tagName === 'ANNOTATION' ||
                        tagName === 'SEMANTICS' || tagName === 'MROW' ||
                        tagName === 'MI' || tagName === 'MO' || tagName === 'MN' ||
                        tagName === 'MFRAC' || tagName === 'MSUP' || tagName === 'MSUB' ||
                        tagName === 'MTEXT' || tagName === 'MSPACE' || tagName === 'MSTYLE' ||
                        tagName === 'MTABLE' || tagName === 'MTR' || tagName === 'MTD' ||
                        tagName === 'MOVER' || tagName === 'MUNDER' || tagName === 'MUNDEROVER' ||
                        tagName === 'MENCLOSE' || tagName === 'MPADDED' || tagName === 'MPHANTOM' ||
                        tagName === 'MROOT' || tagName === 'MSQRT' || tagName === 'MFENCED') {
                        return;  // Skip MathML elements
                    }

                    // Skip the entire <span class="mwe-math-element"> wrapper
                    if (node.classList && node.classList.contains('mwe-math-element')) {
                        // Only get the img alt text from this element
                        const img = node.querySelector('img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display');
                        if (img) {
                            const alt = img.getAttribute('alt') || '';
                            const isDisplay = img.classList.contains('mwe-math-fallback-image-display');
                            if (isDisplay) {
                                text += '\\n$$' + alt + '$$\\n';
                            } else {
                                text += '$' + alt + '$';
                            }
                        }
                        return;
                    }

                    if (tagName === 'IMG' &&
                        (node.classList.contains('mwe-math-fallback-image-inline') ||
                         node.classList.contains('mwe-math-fallback-image-display'))) {
                        // Math image - use alt text wrapped in $ or $$
                        const alt = node.getAttribute('alt') || '';
                        const isDisplay = node.classList.contains('mwe-math-fallback-image-display');
                        if (isDisplay) {
                            text += '\\n$$' + alt + '$$\\n';
                        } else {
                            text += '$' + alt + '$';
                        }
                    } else if (tagName === 'SUP' && node.classList.contains('reference')) {
                        // Skip reference numbers like [1], [2]
                    } else if (tagName === 'STYLE' || tagName === 'SCRIPT') {
                        // Skip style and script tags
                    } else {
                        for (const child of node.childNodes) {
                            walk(child);
                        }
                    }
                }
            }
            walk(el);
            return text;
        }
    """)

    return result


def process_table(table_elem) -> str:
    """Process a wikitable into markdown format, handling rowspan/colspan."""
    lines = []

    # Get caption if present
    caption = table_elem.query_selector("caption")
    if caption:
        lines.append(f"\n**{caption.inner_text()}**\n")

    # Use JavaScript to properly extract table data with rowspan/colspan handling
    table_data = table_elem.evaluate("""
        (table) => {
            const rows = table.querySelectorAll('tr');
            const result = [];
            const rowspanTracker = {};  // Track cells that span into future rows

            for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
                const row = rows[rowIdx];
                const cells = row.querySelectorAll('th, td');
                const rowData = [];
                let cellIdx = 0;
                let colIdx = 0;

                while (cellIdx < cells.length || rowspanTracker[rowIdx + '_' + colIdx]) {
                    // Check if there's a rowspan cell covering this position
                    if (rowspanTracker[rowIdx + '_' + colIdx]) {
                        rowData.push(rowspanTracker[rowIdx + '_' + colIdx]);
                        colIdx++;
                        continue;
                    }

                    if (cellIdx >= cells.length) break;

                    const cell = cells[cellIdx];
                    const rowspan = parseInt(cell.getAttribute('rowspan') || '1');
                    const colspan = parseInt(cell.getAttribute('colspan') || '1');

                    // Get cell text, handling math images
                    let text = '';
                    const walker = document.createTreeWalker(cell, NodeFilter.SHOW_ALL);
                    let node;
                    while (node = walker.nextNode()) {
                        if (node.nodeType === 3) {  // Text
                            text += node.textContent;
                        } else if (node.nodeType === 1 && node.tagName === 'IMG' &&
                                   (node.classList.contains('mwe-math-fallback-image-inline') ||
                                    node.classList.contains('mwe-math-fallback-image-display'))) {
                            text += '$' + (node.getAttribute('alt') || '') + '$';
                        }
                    }
                    text = text.replace(/\\s+/g, ' ').trim();

                    // Add to current row
                    for (let c = 0; c < colspan; c++) {
                        rowData.push(text);
                        // Track rowspans for future rows
                        if (rowspan > 1) {
                            for (let r = 1; r < rowspan; r++) {
                                rowspanTracker[(rowIdx + r) + '_' + (colIdx + c)] = text;
                            }
                        }
                        colIdx++;
                    }
                    cellIdx++;
                }

                if (rowData.length > 0) {
                    result.push({
                        cells: rowData,
                        isHeader: row.querySelector('th') !== null && row.querySelector('td') === null
                    });
                }
            }
            return result;
        }
    """)

    if not table_data:
        return ""

    header_done = False
    for row in table_data:
        cells = row['cells']
        if cells:
            lines.append("| " + " | ".join(cells) + " |")

            # Add header separator after header row
            if not header_done and row['isHeader']:
                lines.append("|" + "|".join(["---"] * len(cells)) + "|")
                header_done = True

    lines.append("")
    return "\n".join(lines)


def scrape_and_save(url: str, output_path: str):
    """Scrape a Wikipedia page and save to markdown file."""
    print(f"Scraping: {url}")
    result = scrape_wikipedia_page(url)

    # Format output
    output = f"# {result['title']}\n\n"
    output += f"Source: {result['url']}\n\n"
    output += "---\n\n"
    output += result['content']

    # Add equations summary at the end
    if result['equations']:
        output += "\n---\n\n## All Equations\n\n"
        for i, eq in enumerate(result['equations'], 1):
            output += f"{i}. `{eq}`\n\n"

    with open(output_path, 'w') as f:
        f.write(output)

    print(f"Saved to: {output_path}")
    print(f"Found {len(result['equations'])} equations")


if __name__ == "__main__":
    import sys

    pages = [
        ("https://en.wikipedia.org/wiki/Depth_of_field", "depth_of_field.md"),
        ("https://en.wikipedia.org/wiki/Circle_of_confusion", "circle_of_confusion.md"),
    ]

    for url, filename in pages:
        scrape_and_save(url, filename)
