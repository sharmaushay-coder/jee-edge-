# Deploy JEE Edge to GitHub Pages (free HTTPS)

This gives you an installable PWA at `https://<your-username>.github.io/<repo>/`, with
offline practice after the first visit. GitHub Pages serves HTTPS automatically.

> The workflow file is already in this project at `.github/workflows/deploy.yml`.
> Nothing is pushed until you run the commands below.

## 0. What gets published

The whole `jee-edge` folder is the site, including:

- `public/pdfs/*.pdf` — the three source PDFs (~119 MB total; each file is under GitHub's 100 MB limit)
- `public/vendor/*` — pdf.js, so the app works without a CDN
- `src/data/questions.json` — the 2,340-question bank

If you do not want the copyrighted PDFs public, keep the repository **private**
(GitHub Pages on a private repo requires GitHub Pro) or do not deploy.

## 1. Create the repository and push

Run these from **inside** the `jee-edge` folder (not its parent):

```bash
cd "C:\Users\HP\OneDrive\Desktop\ayush yoyo\jee-edge"

git init
git add .
git commit -m "JEE Edge — local-first JEE Main CBT practice"
git branch -M main

# create an empty repo named jee-edge on github.com first, then:
git remote add origin https://github.com/<your-username>/jee-edge.git
git push -u origin main
```

If Git asks for credentials, use a **Personal Access Token** as the password
(GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens,
repository access: `jee-edge`, permission: Contents = Read and write).

## 2. Turn on Pages

1. Open the repository on GitHub.
2. **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the **Actions** tab → **Deploy JEE Edge to GitHub Pages** → it should be running
   (or press **Run workflow**).

The first deploy takes 2–5 minutes because of the PDFs. When it finishes, the URL is:

```
https://<your-username>.github.io/jee-edge/
```

## 3. Install on the Android tablet

1. Open the URL in **Chrome** on the tablet (online, once).
2. Wait for the page to finish loading.
3. Chrome menu (⋮) → **Install app** (or **Add to Home screen**).
4. Open each subject once — Physics, Chemistry, Mathematics — so its PDF is cached by the
   service worker. The first question of a subject downloads its PDF (31–46 MB).
5. Test offline: turn on airplane mode, open the installed app, and practise.

Notes:

- The app shell (UI, question bank, analytics) is precached automatically.
- PDFs are cached on first use, not during install, to avoid a 119 MB install.
- Chrome may evict cached PDFs if the device is very low on storage. Reopen the subject
  once while online to restore them.
- Your progress lives in the browser's IndexedDB for that site. It survives app updates and
  redeploys. Use **Settings → Export backup** before clearing browser data.

## 4. Updating the app

```bash
git add .
git commit -m "Update JEE Edge"
git push
```

The workflow rebuilds and redeploys. The site origin does not change, so saved attempts,
mocks and bookmarks are kept. The service worker updates on the next launch.

## 5. AI keys on the tablet

Open **AI Assistant** on the tablet and enter your Gemini or OpenAI key there. Keys are stored
per browser/device and are never part of the deployment.

## Troubleshooting

| Problem | Fix |
|---|---|
| Actions fails at `bun install` | Re-run the workflow; check the log for the failing package. |
| Pages shows 404 | Settings → Pages → Source must be **GitHub Actions**, and the workflow must have completed successfully. |
| App opens but questions are blank | The PDF request failed; check that `public/pdfs/*.pdf` is in the repo and the deploy artifact includes `pdfs/`. |
| Install app option missing | The site must be served over HTTPS (GitHub Pages is) and the service worker must have registered; reload once. |
| Offline shows a question but not its image | That subject's PDF was not opened while online yet. Open the subject once online. |
| Push rejected for file size | Each PDF is under 100 MB; if GitHub still objects, use Git LFS (`git lfs track "public/pdfs/*.pdf"`). |
