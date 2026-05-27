#!/usr/bin/env node
/**
 * Build script — assembles docs/ from _templates/ + src/ + build.config.json
 *
 * Usage:  node scripts/build.js
 *         node scripts/build.js --dry-run   (print to stdout, no writes)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT     = path.resolve(__dirname, '..');
const DRY_RUN  = process.argv.includes('--dry-run');

// ─── helpers ────────────────────────────────────────────────────────────────

function read(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
	if (DRY_RUN) {
		console.log(`\n──── ${filePath} ────`);
		console.log(content);
		return;
	}
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, content, 'utf8');
	console.log(`  built  ${path.relative(ROOT, filePath)}`);
}

/**
 * Apply {{ROOT}} substitution throughout a string.
 * root is "." for top-level pages, ".." for project pages.
 */
function applyRoot(template, root) {
	return template.replaceAll('{{ROOT}}', root);
}

/**
 * Add aria-current="page" to the nav link matching navActive,
 * then strip all data-nav="..." attributes from the output.
 */
function applyNavActive(navbarHtml, navActive) {
	let html = navbarHtml;

	if (navActive) {
		// Add aria-current="page" to the matching <a>
		html = html.replace(
			new RegExp(`(<a\\s[^>]*data-nav="${navActive}"[^>]*)(>)`, 'g'),
			'$1 aria-current="page"$2'
		);
	}

	// Strip all data-nav attributes
	html = html.replace(/\s*data-nav="[^"]*"/g, '');

	return html;
}

// ─── main ───────────────────────────────────────────────────────────────────

const configPath = path.join(ROOT, 'build.config.json');
const config     = JSON.parse(read(configPath));

const layoutTpl  = read(path.join(ROOT, '_templates', 'layout.html'));
const navbarTpl  = read(path.join(ROOT, '_templates', 'navbar.html'));
const footerTpl  = read(path.join(ROOT, '_templates', 'footer.html'));

console.log(`Building ${config.pages.length} pages…`);

for (const page of config.pages) {
	const srcPath = path.join(ROOT, page.src);
	const outPath = path.join(ROOT, page.out);

	if (!fs.existsSync(srcPath)) {
		console.error(`  ERROR  src file missing: ${page.src}`);
		process.exitCode = 1;
		continue;
	}

	const content = read(srcPath);

	// Resolve root-relative paths in all fragments
	const root     = page.root;
	const navbar   = applyNavActive(applyRoot(navbarTpl, root), page.navActive);
	const footer   = page.footer ? applyRoot(footerTpl, root) : '';
	const extraCss = page.extraCss || '';

	// Assemble page from layout template
	let html = layoutTpl
		.replace('{{TITLE}}',       page.title)
		.replace('{{DESCRIPTION}}', page.description)
		.replace('{{EXTRA_CSS}}',   extraCss)
		.replace('{{NAVBAR}}',      navbar)
		.replace('{{CONTENT}}',     content)
		.replace('{{FOOTER}}',      footer);

	// Apply root to remaining placeholders (CSS, favicon paths in layout)
	html = applyRoot(html, root);

	// Clean up blank lines left by empty FOOTER / EXTRA_CSS substitutions
	html = html.replace(/(\n\t\t\n){2,}/g, '\n\t\t\n');
	html = html.replace(/(\n\n){3,}/g, '\n\n');

	write(outPath, html);
}

console.log('Done.');
