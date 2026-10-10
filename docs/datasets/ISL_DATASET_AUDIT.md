# SANKET — Indian Sign Language (ISL) Dataset Audit

**Audit Date:** October 4, 2026  
**Auditor:** Computer-Vision & Sign-Language Dataset Research Team  
**Scope:** Evaluation of candidate external datasets for SANKET's 34 municipal ISL counter signs (`lib/isl-signs.ts`).

---

## 1. Candidate Dataset Evaluations

### Dataset A: Indian Sign Language (ISL) Character-Level Dataset
- **Kaggle Identifier:** `prathumarikeri/indian-sign-language-isl`
- **Author:** Prathum Arikeri
- **Licence:** CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0 International)
- **Scope & Classes:** 26 character classes (English manual alphabet A–Z).
- **Format:** Static JPEG/PNG images of isolated fingerspelled handshapes.
- **Evaluation vs. SANKET 34 Municipal Signs:**
  - SANKET municipal signs are whole-concept, word-level civic gestures (e.g., *Namaste*, *Drinking Water*, *Utility Bill*, *Property Tax*, *Application Form*, *Certificate*, *Police*, *Hospital*).
  - None of SANKET's 34 municipal signs are isolated single-letter fingerspelling.
  - **Verdict:** **SEMANTIC MISMATCH (0/34 Matched)**. Mapping alphabet letter handshapes to municipal words would violate sign semantics and mislead deaf citizens.

---

### Dataset B: ISL-CSLTR (Continuous Sign Language Translation and Recognition)
- **Primary Repository:** Mendeley Data (DOI: [10.17632/kcmpdxky7p.1](https://doi.org/10.17632/kcmpdxky7p.1)), discussed on Kaggle via `drblack00`.
- **Authors:** Elakkiya R. and Natarajan B.
- **Licence:** CC BY 4.0 (Creative Commons Attribution 4.0 International)
- **Scope & Classes:** 700 video clips, 18,863 sentence frames, and 1,036 word-level images across 131 sentence-level classes.
- **Format:** Continuous video recordings and frame extractions with native signers from centers in Andhra Pradesh and student volunteers.
- **Evaluation vs. SANKET 34 Municipal Signs:**
  - Contains candidate high-level concepts (e.g., *Hospital*, *Drink*, *Eat*, *Police*, *Water*).
  - **Regional Dialect & Validation Risk:** Signs were recorded primarily in Andhra Pradesh / Tamil Nadu; ISL has notable regional lexical variations. Signs must be validated against the national standardized vocabulary defined by the Indian Sign Language Research and Training Centre (ISLRTC, New Delhi) before being presented as authoritative civic signage.
  - **Redistribution & Isolation:** Video clips in ISL-CSLTR are predominantly sentence-level continuous streams; extracting isolated, clean loops requires manual temporal segmentation and deaf reviewer certification.
  - **Environment Status:** External download blocked by network/credential limits.
  - **Verdict:** **CANDIDATE_MATCH with HUMAN_REVIEW_REQUIRED**. No unverified frames should be bundled without per-sign expert review.

---

### Dataset C: Indian Sign Language MediaPipe Holistic Landmarks (e.g., INCLUDE / Kaggle derivatives)
- **Reference Sources:** AI4Bharat INCLUDE dataset (263 word classes, CC BY-SA 4.0) and Kaggle user landmark extractions.
- **Format:** NumPy `.npy` arrays or CSV tables of 1,629 floating-point spatial landmark coordinates (face, pose, hands) per video frame.
- **Evaluation vs. SANKET 34 Municipal Signs:**
  - Spatial coordinate tables are machine-learning intermediate feature vectors, not visual assets (photos, illustrations, or video loops).
  - Citizens cannot inspect landmark numerical coordinates on a counter service card.
  - **Verdict:** **INCOMPATIBLE ASSET FORMAT**. Landmark arrays cannot serve as visual instructional aids on citizen sign cards.

---

## 2. SANKET 34-Sign Inventory & Dataset Match Matrix

| Sign ID | Canonical Label | Category | Intended Municipal Meaning | Candidate Source | Match Status | Current Asset State | Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `isl-namaste` | Namaste | Greetings | Traditional Indian greeting / Welcome | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-thank-you` | Thank You | Greetings | Expression of gratitude / Dhanyavad | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-sorry` | Sorry | Greetings | Apology / Excuse me / Maaf kijiye | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-please` | Please | Greetings | Polite request / Kripaya | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-yes` | Yes | Basic | Affirmation / Agreement / Haan | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-no` | No | Basic | Negation / Disagreement / Nahi | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-wait` | Wait | Basic | Please wait / Hold on / Rukiye | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-help` | Help | Basic | Request for assistance / Madad | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-understand` | I Understand | Basic | Comprehension confirmed / Samajh gaya | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-dont-understand` | I Do Not Understand | Basic | Did not understand / Samajh nahi aaya | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-toilet` | Toilet / Restroom | Basic | Washroom facility | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-water` | Drinking Water | Services | Drinking water facility / Paani | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-tax` | Property / Municipal Tax | Services | Municipal tax / Assessment | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-bill` | Utility Bill | Services | Water or electricity bill verification | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-payment` | Fee Payment | Services | Counter fee deposit / Challan | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-bank` | Bank / Treasury | Services | Challan deposit / Treasury | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-certificate` | Certificate | Documents | Birth/death/domicile certificate | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-form` | Application Form | Documents | Municipal service application | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-document` | Supporting Document | Documents | Official identity/residence paper | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-name` | Full Name | Documents | Applicant name on record | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-address` | Residential Address | Documents | Proof of address / Residence | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-phone` | Phone / Mobile | Civic | Contact phone / OTP verification | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-number` | Token Number | Civic | Queue token / Serial number | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-date` | Calendar Date | Civic | Hearing date / Deadline | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-time` | Clock Time | Civic | Counter office hours / Waiting time | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-office` | Government Office | Civic | Municipal department / Cabin | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-complaint` | Public Grievance | Civic | Grievance registration / Complaint | Municipal Corpus | `MISSING_ASSET` | Placeholder Active | Custom civic video recording |
| `isl-hospital` | Hospital / Health Center | Civic | Municipal health center | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-police` | Police / Security | Civic | Police counter / Verification | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-school` | School / Education | Civic | Municipal school / Education | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-emergency` | Emergency Assistance | Civic | Critical / Urgent counter attention | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-drink` | Drink | Daily Life | Thirsty / Need water or beverage | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-eat` | Food / Eat | Daily Life | Meal break / Canteen | ISLRTC / ISL-CSLTR | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |
| `isl-sick` | Unwell / Sick | Daily Life | Feeling unwell / Medical attention | ISLRTC | `CANDIDATE_MATCH` | Placeholder Active | Licensed ISLRTC video clip |

---

## 3. Summary Statistics

- **Total ISL Signs in Corpus:** 34
- **Verified Authentic Visuals Bundled:** 0 (0.0%)
- **Candidate Matches in Research Datasets:** 26 (76.5%)
- **Civic-Specific Signs Missing from Standard Datasets:** 8 (23.5%) — *Tax, Bill, Payment, Certificate, Form, Document, Number, Complaint*.
- **Active Transparent Placeholders:** 34 (100.0%)
- **Broken Asset Links:** 0 (0.0%)
- **Linguistic Review Status:** Independent expert validation by certified deaf ISL instructors is pending.
