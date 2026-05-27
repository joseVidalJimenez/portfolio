#!/usr/bin/env node
/**
 * One-time migration script.
 * Reads each docs/ page, extracts the page-specific body content
 * (between end of navbar block and start of footer / end of body),
 * and writes it to the corresponding src/ file.
 *
 * Run once:  node scripts/migrate-src.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const configPath = path.join(ROOT, 'build.config.json');
const config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Markers used to locate the page-specific region in each docs/ file.
// The navbar block ends with the closing </div> of .navbar-layout > .navbar
// Then comes whatever page content follows.
// The footer begins with '<div class="footer">' and everything after is boilerplate.
const NAVBAR_END_MARKER  = '</div>\n\t\t</div>\n\t</div>\n';  // end of .navbar > .navbar-layout > .navbar-menu-last > </div></div></div>
const FOOTER_START_MARKER = '\t\t<div class="footer">';
const BODY_END_MARKER     = '\t</body>';

for (const page of config.pages) {
	const docsPath = path.join(ROOT, page.out);

	if (!fs.existsSync(docsPath)) {
		console.error(`  SKIP (not found): ${page.out}`);
		continue;
	}

	const full = fs.readFileSync(docsPath, 'utf8');
	const lines = full.split('\n');

	// Find line index of the closing tag of the .navbar block.
	// The navbar ends with: </div>\n\t\t</div>\n\t</div>
	// We search for the line containing just "\t</div>" that follows
	// the navbar-menu closing div chain.

	let navbarEndLine = -1;
	let inNavbar = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('class="navbar"')) {
			inNavbar = true;
		}
		if (inNavbar && lines[i].trim() === '</div>' && i > 0) {
			// Look for the pattern: </div>\n\t\t</div>\n\t</div>
			// which is: navbar-menu, navbar-layout, navbar
			if (
				lines[i].trim()   === '</div>' &&
				lines[i+1] !== undefined && lines[i+1].trim() === '</div>' &&
				lines[i+2] !== undefined && lines[i+2].trim() === '</div>'
			) {
				// Verify we're in the right spot by checking the line after is blank or content
				navbarEndLine = i + 2;  // the outermost </div> of .navbar
				break;
			}
		}
	}

	if (navbarEndLine === -1) {
		console.error(`  ERROR  Could not find navbar end in: ${page.out}`);
		process.exitCode = 1;
		continue;
	}

	// Content starts after navbar end line
	let contentStartLine = navbarEndLine + 1;
	// Skip blank lines
	while (contentStartLine < lines.length && lines[contentStartLine].trim() === '') {
		contentStartLine++;
	}

	// Find content end: first line that starts the footer (or </body> if no footer)
	let contentEndLine = -1;
	for (let i = contentStartLine; i < lines.length; i++) {
		if (lines[i].includes('<div class="footer">') || lines[i].trim() === '</body>') {
			contentEndLine = i;
			break;
		}
	}

	if (contentEndLine === -1) {
		console.error(`  ERROR  Could not find content end in: ${page.out}`);
		process.exitCode = 1;
		continue;
	}

	// Trim trailing blank lines from content
	let endIdx = contentEndLine - 1;
	while (endIdx >= contentStartLine && lines[endIdx].trim() === '') {
		endIdx--;
	}

	const contentLines = lines.slice(contentStartLine, endIdx + 1);
	const content = contentLines.join('\n') + '\n';

	const srcPath = path.join(ROOT, page.src);
	fs.mkdirSync(path.dirname(srcPath), { recursive: true });
	fs.writeFileSync(srcPath, content, 'utf8');
	console.log(`  extracted  ${page.src}  (lines ${contentStartLine+1}–${endIdx+1})`);
}

console.log('Migration done.');
