# KaamSetu — Founder Ka Jameeni Kaam (Step-by-Step)

**Ye file sirf aapke liye hai.**  
AI agent code likhega. Neeche wale steps aapko khud karne hain — copy karke ek-ek follow karo.

**Status track karo:** Har step complete hone par `[ ]` ko `[x]` kar dena.

---

## Pehle Samajh Lo — Aapka Asli Kaam Kya Hai

KaamSetu ek app se zyada ek **operations business** hai. App sirf record rakhega aur control dega. Asli kaam — workers dhundhna, verify karna, customer ko handle karna, dispatch karna, payment confirm karna — **ye sab aap karenge**.

App bina aapke = kuch nahi.  
Aap bina app ke = WhatsApp pe chala sakte ho, lekin scale nahi hoga.

**Dono milkar chalenge tab hi goal poora hoga.**

---

# PHASE 0 — Shuru Karne Se Pehle (1-2 Din)

## Step 0.1 — Launch City Lock Karo

Ye sabse important decision hai. Socho, likho, final karo.

```
[x] Apni launch city ka naam likho: ____ORAI DISTRICT JALAUN UP
[x] Ek area/cluster choose karo (3-5 km radius): Indra Nagar _______________________
[x] Kyon ye city? (aap wahan ho / workers available / demand hai): all tree conditions mate hai
```

**Example:** "Meerut — Shastri Nagar + nearby colonies"

---

## Step 0.2 — Sirf 5 Categories Choose Karo (Zyada Mat Rakho)

PRD ke hisaab se MVP mein maximum 5 categories. Inme se choose karo:

```
[x] Category 1: Plumber          → quote_required · visit charge ₹99
[x] Category 2: Electrician      → quote_required · visit charge ₹99
[x] Category 3: Helper Labour    → daily_wage · half-day / full-day · visit ₹0
[x] Category 4: Painter          → quote_required · visit charge ₹99
[x] Category 5: Fridge / AC      → quote_required · visit charge ₹99
```

**Pricing baad mein edit hogi** — Sprint 4 admin Settings se `standard_visit_charge` change kar sakoge.

---

## Step 0.3 — Localities List Banao

App mein customer locality dropdown ke liye ye chahiye.

```
[x] Locality 1: Indira Nagar
[x] Locality 2: Rath Road
[x] Locality 3: Rajendra Nagar
[x] Locality 4: Civil Lines
[x] Locality 5: Patel Nagar
[x] Locality 6: Tulsi Nagar
[x] Locality 7: Sardar Patel Nagar
[x] Locality 8: Konch Bus Stand Area
[x] Locality 9: Station Road Area
[x] Locality 10: Kalpi Road Area
```

Full list synced in `docs/LAUNCH-CONFIG.md`.

---

# PHASE 1 — Accounts Banao (1 Din)

## Step 1.1 — Supabase Account

```
[ ] https://supabase.com pe jao
[ ] Free account banao (GitHub se login easy hai)
[ ] "New Project" click karo
[ ] Project name: kaamsetu (ya kaamsetu-prod)
[ ] Database password strong rakho — NOTEPAD mein save karo
[ ] Region: apne users ke najdeek (Singapore / Mumbai agar available)
[ ] Project create hone do (2-3 minute lagte hain)
```

**Project ready hone ke baad ye copy karo:**

```
[ ] Project URL: _______________________
[ ] anon public key: _______________________
[ ] service_role key: _______________________  (YE KISI KO MAT DO, SIRF SERVER KE LIYE)
```

Agent ko URL + anon key chahiye hogi. Service role key sirf Vercel env mein jayegi.

---

## Step 1.2 — Vercel Account + GitHub Link (Detail Guide)

**Vercel kya hai?** Ye app ko internet pe live rakhta hai — jaise Supabase database hai, Vercel website host karta hai. Free tier beta ke liye kaafi hai.

### Part A — Pehli baar Vercel account

```
[ ] Browser mein kholo: https://vercel.com
[ ] Top-right "Sign Up" click karo
[ ] "Continue with GitHub" choose karo (aapka repo GitHub pe hai)
[ ] GitHub permission allow karo
```

### Part B — Project import karo

```
[ ] Vercel dashboard pe "Add New..." ya "Add New Project" dabao
[ ] List mein apna repo dikhega: rajavikramaditya/kaamsetu
[ ] Uske saamne "Import" click karo
[ ] Framework: Next.js (automatic detect hoga — change mat karo)
[ ] Root Directory: ./ (default rakho)
[ ] Build Command / Output: default rakho
```

**Important:** Deploy se PEHLE neeche scroll karo — wahi pe env variables add karni hain.

### Part C — Environment Variables KAHAN paste karni hain

Deploy button se **pehle**, same page pe neeche section dikhega:

```text
Environment Variables
```

Wahan **3 rows** add karo — har row mein **Key** (naam) aur **Value** (value):

| Key (copy-paste exact) | Value kahan se |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Apni `.env.local` se — `https://hdpilxkplygjxvjytvxu.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key — `.env.local` wali anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key — jo abhi `.env.local` mein daali |

Har variable add karne ka tareeka:
```
1. Left box (Key): NEXT_PUBLIC_SUPABASE_URL likho
2. Right box (Value): https://hdpilxkplygjxvjytvxu.supabase.co paste karo
3. "Add" ya "+" button dabao
4. Teeno variables ke liye repeat karo
```

Environment dropdown mein **Production, Preview, Development** teeno select rakho (default theek hai).

### Part D — Deploy

```
[ ] "Deploy" button dabao
[ ] 2-3 minute wait karo — build chalega
[ ] Success pe confetti 🎉 — "Visit" click karo
[ ] Live URL copy karo (jaise: https://kaamsetu-xxxxx.vercel.app)
[ ] Live URL yahan likho: _______________________
[ ] Health check kholo: https://TUMHARI-URL.vercel.app/api/health
```

### Agar pehle se deploy ho chuka ho — variables baad mein add karna ho

```
[ ] https://vercel.com/dashboard
[ ] Apna "kaamsetu" project click karo
[ ] Top menu: Settings
[ ] Left sidebar: Environment Variables
[ ] Har key add karo → Save
[ ] Deployments tab → latest deploy → ... menu → Redeploy
```

Bina redeploy ke naye variables kaam nahi karte.

```
[ ] https://vercel.com pe jao
[ ] GitHub se login
[ ] kaamsetu repo import
[ ] Environment Variables (3) add — deploy se pehle ya Settings se
[ ] Deploy + live URL note karo
```

---

## Step 1.3 — Domain (Optional Abhi, Recommended Baad Mein)

```
[ ] Domain socho: kaamsetu.in / kaamsetu.com / jo available ho
[ ] GoDaddy / Namecheap / Google Domains se kharido (~₹500-1200/saal)
[ ] Vercel dashboard → Domains → apna domain add karo
[ ] DNS settings Vercel ke instructions follow karo
```

Abhi Vercel ka free `.vercel.app` URL bhi chalega beta ke liye.

---

# PHASE 2 — Business Setup (2-5 Din, Parallel Chala Sakte Ho)

## Step 2.1 — WhatsApp Business Setup

Ye bahut important hai — MVP mein WhatsApp manual channel hai.

```
[ ] Alag business SIM lelo (Airtel/Jio — ₹200-300/month)
[ ] Us number pe WhatsApp Business app install karo (Play Store se, FREE)
[ ] Business profile banao:
      - Business name: KaamSetu
      - Category: Local Services
      - Description: "Local Work. Trusted People. — [aapki city]"
      - Address: aapka local address
[ ] Profile photo / logo lagao (simple bhi chalega)
[ ] Quick replies set karo:
      "Namaste! KaamSetu se bol rahe hain. Aapko kis service ki zaroorat hai?"
      "Aapka request note ho gaya. Thodi der mein worker assign hoga."
[ ] Business number note karo: +91 _______________________
```

**Ye number app mein "WhatsApp Help" button pe lagega.**

---

## Step 2.2 — Business Entity (Legal)

Shuruat mein simple rakho:

```
[ ] Decide karo: Proprietorship (sabse simple) / LLP / Pvt Ltd
[ ] Agar proprietorship:
      - Local CA se baat karo
      - GST agar chahiye to register (~₹2000-5000 CA fees)
      - Shuruat mein GST optional hai agar turnover kam hai
[ ] Business bank account khulwao (current account)
[ ] Business naam final: _______________________
```

**Beta phase mein proprietorship + personal account bhi chal jata hai**, lekin Razorpay ke liye business proof chahiye hoga.

---

## Step 2.3 — Razorpay (Jab Online Payment Chahiye Ho)

MVP mein mostly cash/UPI manual hai. Razorpay baad mein bhi chalega.

```
[ ] https://razorpay.com pe merchant account apply karo
[ ] Documents ready rakho: PAN, Aadhaar, bank details, business proof
[ ] Approval 2-7 din lag sakta hai
[ ] Payment Links manually bana sakte ho dashboard se (API integration MVP mein nahi hai)
```

**Abhi skip kar sakte ho** — pehle 10-20 cash jobs kar lo, phir Razorpay setup karo.

---

## Step 2.4 — Legal Pages (Privacy + Terms)

Customer ka phone number collect hoga — DPDP law ke liye privacy policy chahiye.

```
[ ] Privacy Policy likhwao / template use karo (TermsFeed, GetTerms — free templates)
[ ] Terms of Service page
[ ] Grievance Officer naam + email + phone mention karo
[ ] Ye pages agent app mein add karega — aap content doge
```

**Minimum content jo chahiye:**
- Kaun sa data collect karte ho (naam, phone, address, photos)
- Kyon collect karte ho (service delivery)
- Kitne din rakhte ho
- Complaint kaise karein (email / phone)

---

# PHASE 3 — Worker Network Banao (1-2 Hafte, Sabse Mushkil Hissa)

## Step 3.1 — Pehle 5 Workers Khud Dhundho

App se pehle bhi workers chahiye. Aap personally jaante ho aise log.

```
[ ] Worker 1: Naam _______ Category _______ Phone _______ Trust level (1-5) _______
[ ] Worker 2: Naam _______ Category _______ Phone _______ Trust level (1-5) _______
[ ] Worker 3: Naam _______ Category _______ Phone _______ Trust level (1-5) _______
[ ] Worker 4: Naam _______ Category _______ Phone _______ Trust level (1-5) _______
[ ] Worker 5: Naam _______ Category _______ Phone _______ Trust level (1-5) _______
```

**Kaise dhundho:**
- Apne colony ke electrician/plumber se baat karo
- Local hardware/electrical shop wale se pucho
- WhatsApp groups mein post karo (colony groups)
- Pehle wale customers/workers se referral lo

---

## Step 3.2 — Har Worker Se Ye Baat Karo (Script)

Copy-paste karke use karo:

```
"Namaste [naam] bhai,

Main [aapka naam] hoon. Main ek local service platform bana raha hoon 
jiska naam KaamSetu hai — 'Local Work. Trusted People.'

Simple si baat hai:
- Customer request karega app/WhatsApp se
- Main aapko job offer bhejunga phone pe
- Aap accept/decline kar sakte ho
- Kaam karo, payment lo (cash ya UPI)
- Koi lead fee nahi, koi subscription nahi shuruat mein

Aapko bas ek simple app pe apna profile banana hoga aur 
aadhaar/photo upload karna hoga verification ke liye.

Pehle 2-3 mahine beta hai — kam jobs honge, lekin regular kaam 
milne lagega to achha hoga.

Interested ho to batao, main aapka account setup kar dunga."
```

```
[ ] Worker 1 se baat ho gayi — haan / nahi
[ ] Worker 2 se baat ho gayi — haan / nahi
[ ] Worker 3 se baat ho gayi — haan / nahi
[ ] Worker 4 se baat ho gayi — haan / nahi
[ ] Worker 5 se baat ho gayi — haan / nahi
```

---

## Step 3.3 — Worker KYC Manual Verify Karo

App upload karega, aap verify karoge.

Har worker ke liye:

```
[ ] Aadhaar photo dekha — clear hai / match karta hai
[ ] Selfie dekha — same person lagta hai
[ ] Phone number verify kiya — call karke
[ ] Uska kaam dekha — reference se ya sample job se
[ ] Approve / Reject decision liya
[ ] Admin panel se approve kiya (jab app ready ho)
```

**Reject mat karo bina reason ke** — worker ko batao kya missing hai.

---

## Step 3.4 — 20 Workers Tak Pahuncho (Beta Target)

```
[ ] Total approved workers: ___ / 20
```

**Timeline:** 5 workers = 3-5 din (agar aap actively dhundho). 20 workers = 2-3 hafte realistic hai.

---

# PHASE 4 — Beta Customers Lao (App Ready Hone Ke Baad)

## Step 4.1 — Invite Codes Banao

Closed beta hai — bina invite code ke koi request nahi kar sakta.

```
[ ] Admin panel se invite codes generate karo (jab app ready ho)
[ ] Code 1: _______ → kisko diya: _______
[ ] Code 2: _______ → kisko diya: _______
[ ] Code 3: _______ → kisko diya: _______
[ ] (10-20 codes shuruat ke liye kaafi hain)
```

**Kisko do:**
- Apne friends/family jo actually service chahiye
- Colony ke log jinhe electrician/plumber chahiye
- WhatsApp pe mat daalo publicly — invite-only hai

---

## Step 4.2 — Pehla Job Script (Customer Ke Liye)

```
"KaamSetu pe request kaise karein:

1. Link kholo: [aapki app URL]
2. Invite code dalo: [code]
3. Apna kaam describe karo + photo dalo
4. Submit karo — aapko tracking link milega
5. Worker assign hone pe aapko call/WhatsApp aayega
6. Kaam hone ke baad payment karo (cash ya UPI)
7. Rating do app pe

Koi problem ho to is number pe WhatsApp karo: [business number]"
```

---

# PHASE 5 — Roz Ka Founder Kaam (App Live Hone Ke Baad)

Ye har din karna padega. Checklist bana lo:

## Subah (15-20 minute)

```
[ ] Admin dashboard kholo — naye requests dekho
[ ] Pending worker approvals dekho
[ ] Kal ke incomplete jobs check karo
[ ] Complaints dekho — koi open hai?
```

## Din Bhar (Har Naye Request Pe)

```
[ ] Request padho — category, locality, urgency samjho
[ ] Pricing decide karo (fixed template ya manual quote)
[ ] Suitable worker shortlist karo (category + availability + trust/responsiveness; show customer locality to worker before accept/decline)
[ ] Dispatch offer bhejo — EK worker ko EK offer (serial rule)
[ ] Worker ne accept nahi kiya? → next worker ko bhejo
[ ] Worker assign ho gaya? → customer ko WhatsApp/call se batao
```

## Job Complete Hone Pe

```
[ ] Worker se confirm karo — kaam ho gaya?
[ ] Customer se payment confirm karo — kitna, cash ya UPI
[ ] Admin panel mein payment record karo
[ ] Customer se rating mangwao (tracking link se)
[ ] Agar complaint aaya → same day respond karo
```

## Raat (10 minute)

```
[ ] Aaj kitne requests aaye: ___
[ ] Kitne jobs complete hue: ___
[ ] Kitne pending hain: ___
[ ] Koi worker issue: ___
[ ] Kal ke liye kya plan hai: ___
```

---

# PHASE 6 — Pricing Decide Karo (Ek Baar, Phir Admin Se Edit)

Beta values locked. **Baad mein admin panel → Settings → Categories** se edit kar sakte ho.

## Standard visit charge (quote categories)

```
[x] Plumber:        ₹99
[x] Electrician:    ₹99
[x] Painter:        ₹99
[x] Fridge/AC:      ₹99
[x] Helper Labour:  ₹0  (daily wage — half-day / full-day alag se)
```

## Quote jobs

```
[x] Site visit fee = standard_visit_charge (upar wali table)
[x] Final quote founder manually enter karega admin panel se
```

## Daily Wage / Helper

```
[ ] Half day rate: ₹_____  (admin settings se set karo Sprint 4 ke baad)
[ ] Full day rate: ₹_____  (admin settings se set karo Sprint 4 ke baad)
[ ] Platform service fee: 5% (hirer se — baad mein configure)
```

## Customer Assurance Fee

```
[ ] Har completed job pe: ₹19-29 (support + trust — Sprint 4 settings)
```

**Tip:** Local market se pucho pehle. Urban Company / local rates dekho. Bahut zyada mat rakho shuruat mein.

---

# PHASE 7 — Beta Success Check (Target)

Ye sab ho jaye to beta successful:

```
[ ] 20 workers onboard aur approved
[ ] 20 jobs complete (end-to-end — request se rating tak)
[ ] 5 repeat customers (dusri baar request kiya)
[ ] 0 critical security issue
[ ] Aap roz ka ops flow bina confusion ke chala pa rahe ho
```

---

# Quick Reference — Agent Ko Kya Dena Hai

Jab agent pooche, ye ready rakho:

| Item | Status |
|---|---|
| Launch city name | `[x]` Orai District, Jalaun UP |
| Launch cluster | `[x]` Indra Nagar |
| 5 categories + pricing mode | `[x]` + visit charges — LAUNCH-CONFIG |
| Localities list | `[x]` 10 areas — see LAUNCH-CONFIG |
| Supabase URL + keys | `[x]` ready |
| Vercel deployed URL | `[x]` kaamsetu-green.vercel.app |
| WhatsApp business number | `[ ] pending` |
| Price templates | `[x]` beta visit charges (admin editable later) |
| Privacy policy text | `[ ] pending` |

---

# Agar Atak Jao To

| Problem | Kya karo |
|---|---|
| Worker nahi mil raha | Hardware shop, local contractor se pucho; payment time pe do |
| Customer request nahi aa raha | 10 logon ko personally invite karo; pehla job free/discounted do |
| Worker accept nahi kar raha | Rate check karo; phone karke personally bolo |
| Payment dispute | Customer aur worker dono ki baat suno; admin notes mein likho |
| App mein bug | Agent ko batao — screenshot + steps to reproduce do |
| Legal confusion | CA se 1 baar consult karo (~₹1000-2000) |

---

**Last updated:** 2026-06-16 (founder: city + categories locked)  
**Related files:** `docs/PROJECT-STATUS.md` · `docs/LAUNCH-CONFIG.md` · `AGENTS.md`
