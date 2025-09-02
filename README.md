# promptpolishai
#Hackathon

# PromptPolish.ai

Polish rough prompts into clear, powerful instructions — faster, cleaner, and more creative.

[Watch the Demo](https://youtu.be/u9wrvPEnudI?si=1OSX3HJbUl4cDp_C)]


## Features

* Paste a messy prompt → get a polished version instantly
* Styles: **Formal** & **Fun** (Free); **Persuasive, Concise, Creative** (Premium)
* One-click **Copy**
* **History** of polished prompts
* **Pricing** page with plans; **About** page with mission & story
*  Fully responsive, modern UI (dark gradient theme)

---

## Project Structure

```
root/
├─ index.html         # Home (the tool)
├─ pricing.html       # Plans & FAQs
├─ about.html         # Story, mission, why us
├─ style.css          # Global styles
├─ script.js          # App logic (polish, history, copy)
├─ .gitignore         # ignore node_modules, .env, etc
└─ README.md
```


## 🛠️ Getting Started

1. **Clone** the repo:

   ```bash
   git clone https://github.com/Mhykey/promptpolishai.git
   ```
2. **Run locally** (pick one):

   * Double-click `index.html` to open in your browser, **or**
   * Use a local server (recommended for assets):

     ```bash
     # with Python
     python -m http.server 5500
     # then visit http://localhost:5500
     ```

---

## How To Use

1. Paste your rough prompt into the textarea.
2. Pick a style (Formal/Fun are free; premium styles are greyed until upgrade).
3. Click **Generate** → see your polished prompt.
4. Click **Copy** to copy the result.
5. Your recent results appear in **History**; subscribing unlocks more.

---

## Pricing (Summary)

* **Free**: 5 polishes/day, Formal & Fun styles
* **Pro — \₦499/mo**: Unlimited polishes, all styles, saved history, priority support
* **Team — \₦999/mo**: Everything in Pro + up to 5 members & shared workspace

See full details in **`pricing.html`** (features table + FAQs).

---

```
---

## Environment & Safety

* No secrets committed. `.env` (if any) is **ignored** by `.gitignore`.
* Static site; no server required.

---

## Contributing

PRs welcome. Please open an issue for discussion first.

---

