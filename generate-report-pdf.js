// generate-report-pdf.js
// Generates a professional PDF from TD-1 test results using Playwright

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Collect screenshots (if any) and convert to data URIs so the PDF embeds them
const screenshotsDir = path.join(__dirname, 'test-results', 'screenshots');
let imagesHtml = '';
if (fs.existsSync(screenshotsDir)) {
  const files = fs.readdirSync(screenshotsDir).filter(f => /\.(png|jpe?g|gif)$/i.test(f)).sort();
  for (const file of files) {
    try {
      const filePath = path.join(screenshotsDir, file);
      const data = fs.readFileSync(filePath);
      const base64 = data.toString('base64');
      const mime = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      imagesHtml += `<div style="page-break-inside: avoid; margin-bottom:12px;"><div style="font-weight:700;margin-bottom:6px;">${file}</div><img src="data:${mime};base64,${base64}" style="max-width:100%;height:auto;border:1px solid #e5e7eb;border-radius:6px;"></div>`;
    } catch (e) {
      // ignore read errors for individual images
    }
  }
}

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>TD-1 Checkout Process — Test Execution Report</title>
<style>
  /* ── Fonts & Reset ─────────────────────────────────────── */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    color: #1a1a2e;
    background: #ffffff;
    line-height: 1.55;
  }

  /* ── Page Layout ────────────────────────────────────────── */
  .page { padding: 40px 48px 48px; max-width: 900px; margin: 0 auto; }

  /* ── Cover Header ───────────────────────────────────────── */
  .cover-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
    color: #fff;
    border-radius: 10px;
    padding: 36px 40px 32px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .cover-header::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .cover-header .badge {
    display: inline-block;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    font-size: 8.5pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 14px;
    margin-bottom: 14px;
    color: #a8d8ea;
  }
  .cover-header h1 {
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .cover-header .subtitle {
    font-size: 11pt;
    color: rgba(255,255,255,0.75);
    margin-bottom: 24px;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .meta-item {
    background: rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 10px 14px;
  }
  .meta-item .label {
    font-size: 7.5pt;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 3px;
    font-weight: 600;
  }
  .meta-item .value {
    font-size: 9.5pt;
    color: #fff;
    font-weight: 500;
  }
  .meta-item .value a { color: #a8d8ea; text-decoration: none; }

  /* ── Status Banner ──────────────────────────────────────── */
  .status-banner {
    background: #e8f5e9;
    border-left: 5px solid #2e7d32;
    border-radius: 6px;
    padding: 14px 20px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .status-banner .icon {
    font-size: 22pt;
    line-height: 1;
  }
  .status-banner .text strong {
    display: block;
    font-size: 12pt;
    color: #1b5e20;
    font-weight: 700;
  }
  .status-banner .text span {
    font-size: 9.5pt;
    color: #388e3c;
  }

  /* ── KPI Cards ──────────────────────────────────────────── */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }
  .kpi-card {
    background: #f8f9ff;
    border: 1px solid #e3e8f0;
    border-radius: 8px;
    padding: 16px 14px 14px;
    text-align: center;
  }
  .kpi-card .num {
    font-size: 22pt;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }
  .kpi-card .lbl {
    font-size: 8pt;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  .kpi-card.green .num { color: #16a34a; }
  .kpi-card.blue  .num { color: #2563eb; }
  .kpi-card.gray  .num { color: #374151; }
  .kpi-card.amber .num { color: #d97706; }

  /* ── Section Headers ────────────────────────────────────── */
  .section {
    margin-bottom: 32px;
    page-break-inside: avoid;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  }
  .section-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px; height: 26px;
    background: #1a1a2e;
    color: #fff;
    border-radius: 6px;
    font-size: 9pt;
    font-weight: 700;
    flex-shrink: 0;
  }
  .section-title {
    font-size: 13pt;
    font-weight: 700;
    color: #1a1a2e;
  }

  /* ── Tables ─────────────────────────────────────────────── */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    margin-bottom: 16px;
  }
  thead tr {
    background: #1a1a2e;
    color: #fff;
  }
  thead th {
    padding: 9px 12px;
    font-weight: 600;
    text-align: left;
    letter-spacing: 0.3px;
    font-size: 8.5pt;
  }
  tbody tr:nth-child(even) { background: #f8f9ff; }
  tbody tr:nth-child(odd)  { background: #ffffff; }
  tbody tr:hover { background: #eef2ff; }
  tbody td {
    padding: 8px 12px;
    border-bottom: 1px solid #e9ecef;
    vertical-align: top;
  }
  .col-status-pass  { color: #16a34a; font-weight: 600; }
  .col-status-fail  { color: #dc2626; font-weight: 600; }
  .col-status-heal  { color: #d97706; font-weight: 600; }
  .col-metric       { font-weight: 600; color: #1a1a2e; }
  .col-bold         { font-weight: 700; background: #f0f4ff !important; }

  /* ── Sub-section (AC labels) ─────────────────────────────── */
  .ac-section { margin-bottom: 20px; }
  .ac-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .ac-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #dbeafe;
    color: #1d4ed8;
    border-radius: 4px;
    padding: 3px 10px;
    font-size: 8.5pt;
    font-weight: 700;
    white-space: nowrap;
  }
  .ac-badge.pass { background: #dcfce7; color: #16a34a; }
  .ac-title { font-weight: 600; font-size: 10.5pt; color: #1a1a2e; }

  /* ── Defects ─────────────────────────────────────────────── */
  .defect-card {
    border: 1.5px solid #fed7aa;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 14px;
  }
  .defect-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff7ed;
    padding: 10px 16px;
    border-bottom: 1px solid #fed7aa;
  }
  .defect-id { font-weight: 700; color: #c2410c; font-size: 10pt; }
  .defect-badge {
    font-size: 7.5pt; font-weight: 700;
    padding: 3px 10px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge-resolved { background: #dcfce7; color: #15803d; }
  .badge-info     { background: #dbeafe; color: #1d4ed8; }
  .defect-body { padding: 12px 16px; }
  .defect-row { display: flex; gap: 8px; margin-bottom: 6px; font-size: 9.5pt; }
  .defect-label { width: 120px; font-weight: 600; color: #6b7280; flex-shrink: 0; }
  .defect-value { color: #1a1a2e; }

  /* ── Coverage grid ─────────────────────────────────-------- */
  .coverage-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }
  .cov-card {
    border: 2px solid #22c55e;
    border-radius: 8px;
    padding: 12px 10px;
    text-align: center;
    background: #f0fdf4;
  }
  .cov-ac { font-size: 9pt; font-weight: 700; color: #166534; margin-bottom: 4px; }
  .cov-check { font-size: 16pt; line-height: 1; }
  .cov-label { font-size: 7.5pt; color: #15803d; margin-top: 4px; font-weight: 600; }

  /* ── Browser badges ─────────────────────────────────------ */
  .browser-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .browser-card {
    flex: 1;
    border-radius: 8px;
    padding: 14px;
    text-align: center;
    border: 1px solid #e3e8f0;
    background: #f8f9ff;
  }
  .browser-card .b-name { font-size: 9pt; font-weight: 700; color: #374151; margin-bottom: 6px; }
  .browser-card .b-count { font-size: 20pt; font-weight: 700; color: #16a34a; line-height: 1; }
  .browser-card .b-label { font-size: 8pt; color: #6b7280; margin-top: 2px; }

  /* ── Recommendations ─────────────────────────────────---- */
  .rec-list { list-style: none; }
  .rec-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
