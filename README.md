# Bill Saathi (பில் சாத்தி)
### An Agentic, Vernacular GST Evidence Management and Accountant-Handoff Assistant for Micro-Enterprises
**Tech4Bharat 2026 | Theme 3: MSME Finance & Compliance | Problem Statement 3.1**

> *"From scattered bills to a continuous, traceable and accountant-ready GST evidence trail."*

---

## 🚀 Live Demo & Quick Start

The application is completely self-contained, runs locally without requiring external API keys, and persists state in the browser's `localStorage`.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
http://localhost:3000/
```

To compile production-optimized build:
```bash
npm run build
```

---

## 🎯 The Core Problem (Official Tech4Bharat PS 3.1)

Micro-enterprise owners (such as small grocery and spice traders in Tamil Nadu) receive purchase bills through crumpled paper slips, faded thermal receipts, WhatsApp photos, and forwarded messages.

* **₹1,500 – ₹3,000** spent per GST filing through accountants.
* **15 – 20 hours per month** lost to tracking down missing paperwork and receipts.
* **8 – 12% of annual profits** consumed by compliance friction and overhead.

> **Key Insight:** Small business owners do not struggle with the statutory math of filing a GST return; they struggle with **collecting, verifying, and resolving evidence** *before* handing it over to their accountant.

---

## 💡 What Makes Bill Saathi Different: The 3 Core Moats

### 1. Persistent Cross-Period Evidence Ledger (Technical Moat)
In traditional accounting apps, an invoice is either entered into the current month or discarded. When an August purchase invoice is discovered in October, accountants must perform tedious manual historical reconciliations.
* **Bill Saathi immutably binds the original transaction period (`AUG-2026`)** while allowing active tracking and resolution in the current period (`OCT-2026`).
* Explore the live **August ➔ September ➔ October lifecycle case study** (Kaveri Traders, Inv #KAV-2026-881) in the **Evidence Ledger** tab.

### 2. Multi-Tier Non-Destructive Overwrite Architecture
* Extracted values from OCR are permanently preserved in their raw form alongside confidence scores.
* Owner corrections (`ownerValue`) and Chartered Accountant adjustments (`accountantValue`) are layered non-destructively.
* Zero data is overwritten or lost; an immutable SHA-256 styled event trail records every edit.

### 3. Vernacular Tamil-English Agentic Clarification Loop
* 5-Stage Autonomous Loop: `DETECT ➔ DECIDE ➔ PREPARE ➔ APPROVAL ➔ RECORD`.
* Generates respectful, colloquial Tamil WhatsApp messages for local suppliers (e.g., asking for an unsmudged invoice copy or valid GSTIN) alongside formal English records for the CA.
* Human-in-the-loop: Trader approves drafts before simulated dispatch.

---

## 📋 Complete 10-Module Application Architecture

| # | Module | Purpose |
|---|---|---|
| 1 | **Dashboard** | Real-time computed evidence health, turnover metrics, pending actions, and active cross-period cases. |
| 2 | **Invoice Directory** | Searchable multi-format bill registry with side-by-side raw OCR vs verified values. |
| 3 | **Bill Upload & Intake** | Drag-and-drop document upload with confidence-scored extraction badged as synthetic data. |
| 4 | **Cross-Period Ledger ★** | The core differentiator: immutable period binding across August, September, and October. |
| 5 | **Autonomous Agent Resolution** | Interactive resolution workflows: unreadable bills, missing supplier GSTINs, duplicate checks, and late invoices. |
| 6 | **Supplier Clarifications** | Vernacular dual-language messaging hub with Tamil WhatsApp drafts & response tracking. |
| 7 | **Accountant Portal** | Dedicated Chartered Accountant review desk for field verification and direct client query management. |
| 8 | **Evidence Pack Generator** | Generates a 10-point accountant-ready dossier and exports a real client-side PDF complete with statutory watermark. |
| 9 | **Audit Timeline** | Append-only chronological event log capturing every actor (Trader, Agent, CA, Supplier). |
| 10 | **Settings & Evaluation Matrix** | Business profile management, benchmark demo data reset, and transparent actual vs. simulated disclosure matrix. |

---

## ⚖️ Transparent Capability Disclosure Matrix

| Capability Area | Prototype Status | Technical Detail |
|---|---|---|
| **Cross-Period Ledger** | **IMPLEMENTED** | Immutable origin binding across August ➔ October reporting cycles. |
| **Non-Destructive Overwrite** | **IMPLEMENTED** | Multi-tier preservation of raw OCR, owner edits, and CA adjustments. |
| **Vernacular Tamil Interface** | **IMPLEMENTED** | Dual-language toggle with natural, idiomatic Tamil business terminology. |
| **Client-Side PDF Pack Generator** | **IMPLEMENTED** | Real PDF export using `jspdf` and `jspdf-autotable` with statutory watermarks. |
| **Supplier WhatsApp Dispatch** | **SIMULATED** | Simulated in-browser sandbox; ready for WhatsApp Cloud API webhook connection. |
| **Direct GSTN Portal Filing** | **EXCLUDED** | By design. Final filing remains the professional domain of the licensed CA. |
| **Automatic ITC Final Entitlement** | **EXCLUDED** | Statutory Section 16 qualifications require professional CA discretion. |

---

## 🧑‍⚖️ 3-Minute Hackathon Demonstration Route

1. **Launch the Demo Tour**: Click the glowing **"Judge Walkthrough Tour"** pill in the bottom right corner of the screen.
2. **Step 1 — Dashboard**: Review computed health metrics (zero hardcoded values).
3. **Step 2 — Intake & Confidence Scoring**: Go to **Upload & Process** to inspect confidence tiers (Green 95%+, Amber 70-94%, Red <70%).
4. **Step 3 — Non-Destructive Overwrites**: In **Invoice Records**, click any bill (e.g. `INV-2026-0922`) to view the 3-column value inspector.
5. **Step 4 — The Technical Moat**: Go to **Evidence Ledger** to explore the August ➔ September ➔ October cross-period case study.
6. **Step 5 — Vernacular Clarifications**: Open **Supplier Clarifications** to see the automated Tamil WhatsApp message for Kaveri Traders.
7. **Step 6 — Accountant Handoff**: Open **Handoff Packs** and click **"Download Official PDF Pack"** to generate the real 10-point audit dossier!

---

*Built with ❤️ for Tamil Nadu's Micro-Enterprises | Tech4Bharat 2026*
