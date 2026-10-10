# SANKET — American Sign Language (ASL) Dataset Audit

**Audit Date:** October 4, 2026  
**Auditor:** Computer-Vision & Sign-Language Dataset Research Team  
**Scope:** Evaluation of candidate external datasets for SANKET's 36 ASL sign entries (`lib/asl-signs.ts`).

---

## 1. Candidate Dataset Evaluations

### Dataset A: ASL Alphabet
- **Kaggle DOI / Identifier:** `10.34740/KAGGLE/DSV/29550` (`grassknoted/asl-alphabet`)
- **Author:** Akash Nagaraj
- **Licence:** GNU General Public License v2.0 (GPL-2.0)
- **Scope & Classes:** 29 classes total (26 letters A–Z, plus auxiliary classes `space`, `del`, `nothing`).
- **Data Volume:** ~87,000 raw webcam frames (approx. 1.1 GB uncompressed).
- **Evaluation vs. SANKET 36 ASL Signs:**
  - **Fingerspelling (A–Z):** The 26 letters represent `CANDIDATE_MATCH` for fingerspelled manual alphabet letters.
  - **Counter Basics:** The 10 essential service counter concepts (*Hello*, *Yes*, *No*, *Please*, *Thank You*, *Sorry*, *I Understand*, *Water*, *Toilet*, *Help*) are **completely absent** from this dataset. An alphabet dataset cannot teach conversational vocabulary.
  - **Licensing Considerations:** GPL-2.0 is a strong copyleft licence. Distributing images extracted from GPL-2.0 corpora within a civic client terminal requires legal review to ensure licensing compatibility with MIT/Apache project distribution.
  - **Format Suitability:** Raw webcam crops contain arbitrary domestic lighting and background artifacts. Educational civic terminals require standardized, high-contrast, curated vector (SVG) or clear neutral-background illustrations rather than raw training frames.
  - **Verdict:** **CANDIDATE_MATCH for A–Z fingerspelling; INSUFFICIENT for Counter Basics; LICENCE_REVIEW_REQUIRED**.

---

### Dataset B: ASL Lexicon / Educational Public Domain Illustrations (e.g. Wikimedia / Gallaudet Resources)
- **Sources:** Wikimedia Commons `Category:ASL_letters` and Gallaudet University ASL resources.
- **Licence:** Public Domain / CC0 / CC-BY.
- **Format:** Scalable Vector Graphics (SVG) and clean line-art diagrams.
- **Evaluation vs. SANKET 36 ASL Signs:**
  - Provides neutral, standardized representations of manual alphabet letters A–Z and standard single-hand configurations.
  - Vocabulary signs (*Help*, *Please*, *Thank You*) require curated motion arrows/animations to represent non-manual markers and directional movement.
  - **Verdict:** **RECOMMENDED TARGET ARCHITECTURE FOR FUTURE VISUAL INTEGRATION**.

---

## 2. SANKET 36-Sign Inventory & Match Matrix

| Sign ID | Canonical Label | Category | Hand Count | Single-Handed | Candidate Source | Match Status | Current Asset State | Action Required |
| :--- | :--- | :--- | :-: | :-: | :--- | :--- | :--- | :--- |
| `asl-a` | Letter A | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-b` | Letter B | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-c` | Letter C | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-d` | Letter D | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-e` | Letter E | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-f` | Letter F | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-g` | Letter G | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-h` | Letter H | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-i` | Letter I | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-j` | Letter J | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate motion SVG/GIF |
| `asl-k` | Letter K | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-l` | Letter L | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-m` | Letter M | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-n` | Letter N | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-o` | Letter O | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-p` | Letter P | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-q` | Letter Q | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-r` | Letter R | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-s` | Letter S | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-t` | Letter T | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-u` | Letter U | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-v` | Letter V | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-w` | Letter W | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-x` | Letter X | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-y` | Letter Y | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate verified SVG/PNG |
| `asl-z` | Letter Z | Fingerspelling (A-Z) | 1 | Yes | ASL Alphabet / Wikimedia | `CANDIDATE_MATCH` | Placeholder Active | Curate motion SVG/GIF |
| `asl-hello` | Hello | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-yes` | Yes | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-no` | No | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-please` | Please | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-thank-you` | Thank You | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-sorry` | Sorry | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-understand` | I Understand | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-water` | Water | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-toilet` | Toilet / Restroom | Counter Basics | 1 | Yes | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |
| `asl-help` | Help | Counter Basics | 2 | No | ASL Lexicon | `CANDIDATE_MATCH` | Placeholder Active | ASL dictionary video |

---

## 3. Summary Statistics

- **Total ASL Signs in Corpus:** 36 (26 alphabet + 10 counter basics)
- **Single-Handed Signs:** 35 (97.2%)
- **Two-Handed Signs:** 1 (2.8%) — *`asl-help`*
- **Verified Authentic Visuals Bundled:** 0 (0.0%)
- **Candidate Matches in Alphabet Datasets:** 26 (72.2%)
- **Vocabulary Signs Missing from Alphabet Datasets:** 10 (27.8%)
- **Active Transparent Placeholders:** 36 (100.0%)
- **Broken Asset Links:** 0 (0.0%)
- **Linguistic Review Status:** Independent validation by certified ASL instructors pending.
