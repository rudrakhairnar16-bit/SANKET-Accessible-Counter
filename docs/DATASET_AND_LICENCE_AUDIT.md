# SANKET — Sign-Language Dataset, Provenance & Licensing Audit

**Audit Date:** October 10, 2026  
**Auditor:** Senior Engineer, QA Lead & Dataset Research Team  
**Scope:** Complete evaluation of candidate external datasets, current repository metadata, provenance, licensing, and one-handed linguistic analysis for SANKET Public Service Counter.

---

## 1. Executive Summary & Inventory Audit Re-run

A complete automated and static audit of the sign metadata was executed using `scripts/audit-sign-assets.mjs`.

### Verified Metrics:
| Language Profile | Total Metadata Entries | Configured Visual References | Missing Visual References | Broken Local Disk References | Expert Linguistic Review Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Indian Sign Language (ISL)** | 34 | 0 | 34 | 0 | Pending qualified ISLRTC/community review |
| **American Sign Language (ASL)** | 36 | 32 | 4 | 0 | Pending qualified ASL/community review |
| **Total Signs** | **70** | **32** | **38** | **0** | **Pending independent field validation** |

### Key Linguistic and Architectural Principles:
1. **ISL and ASL are Distinct Languages:** The system maintains strict separation. ASL fingerspelling or signs are never substituted for Indian Sign Language concepts.
2. **Alphabet Handshapes Never Substituted for Concept Signs:** Alphabet handshapes (e.g., ASL or ISL letter handshapes) are never used to represent complex words or civic concepts (*Tax*, *Certificate*, *Hospital*, *Bill*).
3. **No Unlicensed or Ambiguous Bundling:** The repository does not bundle unverified local media archives. Remote references configured for ASL point to documented public-domain and CC BY-SA resources on Wikimedia Commons, with full provenance documented in `public/data-manifests/asl-assets.json`.
4. **Placeholder Transparency:** When an authentic visual asset is not confirmed and independently reviewed, the interface displays an honest placeholder state with explicit disclaimers (*"Authentic visual unavailable · Reference and expert validation pending"*).

---

## 2. External Dataset Investigation & Candidate Evaluation

### Candidate 1: Indian Sign Language (ISL) Character-Level Dataset
- **Source / Repository:** Kaggle (`prathumarikeri/indian-sign-language-isl`)
- **Author:** Prathum Arikeri
- **Licence:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **Task Covered:** Character-level static fingerspelling (English alphabet A–Z)
- **Classes / Scope:** 26 isolated character handshapes
- **File Format & Size:** JPEG/PNG images (~50 MB)
- **Evaluation vs. SANKET Municipal Vocabulary:**
  - SANKET's 34 municipal ISL signs represent whole civic words and concepts (*Namaste*, *Property Tax*, *Utility Bill*, *Application Form*, *Certificate*, *Police*, *Drinking Water*).
  - **Linguistic Fit:** **0% match for municipal concept signs**.
  - **Decision:** **REJECTED for municipal concept signs**. Using single-letter handshapes to represent whole civic concepts violates sign language grammar.

### Candidate 2: ISL-CSLTR (Continuous Sign Language Translation and Recognition)
- **Source / Repository:** Mendeley Data (DOI: [10.17632/kcmpdxky7p.1](https://doi.org/10.17632/kcmpdxky7p.1))
- **Authors:** Elakkiya R. & Natarajan B.
- **Licence:** Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Task Covered:** Continuous sentence signing and word-level extractions
- **Classes / Scope:** 700 video clips, 18,863 sentence frames, 131 sentence classes
- **File Format & Size:** MP4 video recordings, frame extractions (several GBs)
- **Evaluation vs. SANKET Municipal Vocabulary:**
  - Contains candidate everyday signs (*Hospital*, *Drink*, *Eat*, *Police*, *Water*).
  - **Dialect & Standardization Consideration:** Recorded primarily in southern regional centers (Andhra Pradesh / Tamil Nadu). In India, civic signage must align with the national standardized lexicon published by the Indian Sign Language Research and Training Centre (ISLRTC, New Delhi).
  - **Temporal Isolation:** Continuous sentences require manual temporal segmentation and Deaf community validation to extract clean loops without co-articulation distortion.
  - **Decision:** **CANDIDATE RESOURCE FOR FUTURE CURATION (HUMAN REVIEW REQUIRED)**. No unverified clips bundled in this release.

### Candidate 3: AI4Bharat INCLUDE / MediaPipe Landmark Coordinates
- **Source / Repository:** AI4Bharat INCLUDE / GitHub / Kaggle derivatives
- **Licence:** CC BY-SA 4.0
- **Task Covered:** Machine learning landmark feature extraction
- **Format:** NumPy `.npy` arrays or CSV tables of 1,629 3D floating-point landmark coordinates
- **Evaluation vs. SANKET Municipal Vocabulary:**
  - Numerical landmark vectors are feature vectors for neural network classifiers, not human-visible educational visual references.
  - **Decision:** **INCOMPATIBLE FORMAT FOR CITIZEN UI**. Cannot be presented to citizens as visual sign demonstration cards.

### Candidate 4: ASL Alphabet Dataset
- **Source / Repository:** Kaggle (`grassknoted/asl-alphabet`, DOI: `10.34740/KAGGLE/DSV/29550`)
- **Author:** Akash Nagaraj
- **Licence:** GNU General Public License v2.0 (GPL-2.0)
- **Task Covered:** Isolated fingerspelling A–Z
- **Classes / Scope:** 29 classes (A–Z, space, del, nothing), ~87,000 raw webcam frames (1.1 GB)
- **Evaluation vs. SANKET Vocabulary:**
  - Covers manual alphabet letters (A–Z), but contains zero counter basic vocabulary (*Hello*, *Yes*, *No*, *Please*, *Thank You*, *Sorry*, *Understand*, *Water*, *Toilet*, *Help*).
  - GPL-2.0 copyleft creates distribution constraints if bundled directly into an MIT/Apache web package.
  - Raw webcam images contain domestic backgrounds and uneven lighting, inferior to high-contrast vector illustrations for public counter terminals.
  - **Decision:** **NOT BUNDLED**. Standard public-domain vector diagrams from Wikimedia Commons used instead.

### Candidate 5: Wikimedia Commons ASL Manual Alphabet & Educational Illustrations
- **Source / Repository:** Wikimedia Commons (`Category:ASL_letters`, `Category:American_Sign_Language`)
- **Licence:** Public Domain (wpclipart) / CC BY-SA 3.0 / CC BY-SA 4.0
- **Task Covered:** High-contrast scalable vector graphics (SVG) of manual alphabet handshapes and clear photo references
- **Classes / Scope:** A–Z fingerspelling + basic greetings/responses
- **Evaluation vs. SANKET Vocabulary:**
  - 26 letters (A–Z) verified as single-handed manual alphabet representations.
  - 6 common conversational counter signs (*Hello*, *Yes*, *No*, *Please*, *Thank You*, *Understand*) have documented licensed references.
  - 4 signs (*Sorry*, *Water*, *Toilet*, *Help*) remain pending verified visual assets.
  - **Decision:** **ADOPTED AS DOCUMENTED REMOTE REFERENCES**. Full provenance tracked in `public/data-manifests/asl-assets.json`.

---

## 3. One-Handed Sign Priority & Linguistic Accessibility Analysis

During prior hackathon review, a reviewer suggested exploring whether one-handed signs could be prioritised to benefit users with hand-mobility limitations.

### Linguistic Findings:
1. **Linguistic Authenticity First:**
   - Sign languages are natural, fully developed human languages with fixed phonological and morphological parameters (handshape, location, movement, orientation, and non-manual expressions).
   - In ISL, many civic concepts are inherently two-handed (*Namaste*, *Form*, *Document*, *Certificate*, *Tax*, *Bill*, *Payment*, *Complaint*).
   - **Crucial Rule:** Two-handed signs must **never** be arbitrarily altered into improvised "one-handed" versions. Doing so corrupts the language, creates incomprehensible signs, and disrespects Deaf linguistic heritage.
2. **Where One-Handed Signs Naturally Apply:**
   - **ASL Manual Alphabet (A–Z):** Naturally 100% single-handed (all 26 letters use one dominant hand).
   - **ASL Basic Signs:** 9 of 10 counter basics (*Hello*, *Yes*, *No*, *Please*, *Thank You*, *Sorry*, *Understand*, *Water*, *Toilet*) are naturally single-handed. *Help* is two-handed (closed fist lifted on flat palm).
   - **ISL Single-Handed Signs:** Certain signs (*Wait*, *Eat*, *Drink*, *Sick*, *Phone*) can be produced with one hand in natural ISL usage.
3. **Multi-Modal Accessibility for Motor/Mobility Disabilities:**
   - Rather than degrading sign language grammar, true accessibility is achieved through **user choice and multi-modal support**:
     - Large touch targets and high-contrast modes for motor and visual ease.
     - Direct text typing for citizens who cannot or prefer not to sign.
     - Staff quick phrases and text-to-speech for rapid, fatigue-free communication.
     - Clear visual indicators (`☝️ 1 Hand` / `👐 2 Hands` badges) so signers can anticipate physical demands.

---

## 4. Reproducible Download & Manual Review Procedure for Future Integration

When new licensed visual assets are acquired for production deployment:

### Step 1: Verification Against Official Lexicons
- **For ISL:** Verify against ISLRTC (Indian Sign Language Research and Training Centre) official dictionary resources (http://www.islrtc.nic.in/).
- **For ASL:** Verify against Gallaudet University / RID / Handspeak lexicons.

### Step 2: Quality & Licensing Verification
- Confirm explicit commercial/public redistribution license (CC BY, CC0, Public Domain, or custom government license).
- Ensure high-resolution SVG or neutral-background WebP/MP4 format.

### Step 3: Registration in SANKET Manifests
1. Place asset in `public/sign-assets/<language>/`.
2. Update metadata in `lib/<language>-signs.ts` and `public/data-manifests/<language>-assets.json`.
3. Re-run `npm run audit:assets` to verify zero broken paths.
4. Record signer and reviewer certification credentials in `docs/SIGN_ASSET_REVIEW_REGISTER.csv`.
