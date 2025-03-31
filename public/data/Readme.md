# Readme 
After getting the final paperswithcode_dataset.csv, we need to do following cleaning.

- Deleted Column : subtask
- Cleaned column: year 
- Added column: benchmark_cnt
- Added column: associated_task_cnt

## Formula to create columns 
associated_task_cnt & 
benchmark_cnt

```
=LEN(D3) - LEN(SUBSTITUTE(D3, ",", ""))+IF(D3<>"",1,0)
```

## Prompt for app 
```
Create a clean and modern React-based web application named "AI Benchmark Explorer".

The app should display benchmark datasets scraped from Papers With Code in a searchable and filterable table or grid format.

Each dataset includes:
- dataset_name
- subtask
- task
- associated_tasks
- modalities
- languages
- area
- benchmark_urls
- license
- homepage_url
- pwc_url
- description
- year_published

Requirements:
1. Provide a search bar to filter datasets by name or keyword.
2. Add multi-select filters for:
   - Task
   - Modalities
   - Area
   - Year Published
3. Clicking on a dataset opens a modal or side panel showing detailed info and external links (homepage, pwc_url, etc.).
4. Responsive layout with clean UI using Tailwind CSS or Chakra UI.
5. Include a placeholder dataset for now; I will replace it with real data later.

Optional:
- Add basic dark mode support.
- Use local state (no backend needed).


```

## Further improvement in functionality

- benchmark_urls column has comma separated values, it has suffix of complete url. prefix that with https://paperswithcode.com/sota/ to create benchmarkurl. And show the benchmark url active link on detail page. 

Final link will be like this: https://paperswithcode.com/sota/unsupervised-anomaly-detection-on
 

- in the grid show two more colums benchmark_cnt, associated_task_cnt. I have updated the table.


## Steps of Application Deployment on Netlify


### Step 1: Deploy to Netlify from GitHub

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Log in and click **“Add new site” > “Import an existing project”**
3. Choose **GitHub**, then:
   - Authorize Netlify if prompted.
   - Select your repo: `AI-Benchmark-Explorer`
4. **Configure the deploy settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Click **“Deploy site”**

Netlify will now build and deploy your site. You’ll get a temporary URL like:
```
https://ai-benchmark-explorer.netlify.app
```

---

### Step 2: Add Custom Domain (`explorer.dasarpai.com`)

#### In Netlify:

1. Go to your deployed site → **Site settings** → **Domains**.
2. Click **"Add custom domain"**.
3. Enter:  
   ```
   explorer.dasarpai.com
   ```
4. Click **"Verify"** → Then **Add domain**.
5. You'll now see DNS instructions.

---

### Step 3: Update DNS in Your Domain Provider

**Because my main domain is alread registered on netlify therefore this step not required.**

Go to wherever `dasarpai.com` is registered (Namecheap, GoDaddy, Cloudflare, etc.), and:

1. **Add a new DNS record**:
   - **Type**: `CNAME`
   - **Name/Host**: `explorer`
   - **Value/Target**: your Netlify site domain (e.g. `ai-benchmark-explorer.netlify.app`)
   - TTL: Auto or 30 mins

📌 If your provider doesn’t support `CNAME` for subdomains, use `A record` pointing to Netlify’s IP:
```
75.2.60.5
```

---

### Step 4: Wait for DNS Propagation

It may take a few minutes to a couple of hours (usually ~10 mins).

Once ready, visiting:
```
https://explorer.dasarpai.com
```
...should load your app!


## Alternative Deployment on Replit 
https://replit.com/@harithapliyal/AI-Benchmark-Explorer

https://a2e31705-a736-42c9-ac38-0df21b60226d-00-18crhccwgdpto.pike.replit.dev/


## Three ways before me to choose the deployement 
I **can host multiple apps under one domain like `dasarpai.com/ai-benchmark-explorer`**, but Netlify **doesn’t natively support subfolder-based apps** across separate deploys — it's more suited to **subdomain** or **single-app-per-site** setups.

Here are **3 ways** to achieve my goal depending on my setup:

---

### **Option 1: Integrate the new app into my existing site's codebase**
If my main site is a static site (like Jekyll, Hugo, or React), you can:
- Create a folder like `/ai-benchmark-explorer/` inside my project.
- Place the built React app there.
- Deploy as usual — users will access it at `dasarpai.com/ai-benchmark-explorer`.

🔧 You’ll need to:
- Set the `homepage` in `package.json` of my React app:
  ```json
  "homepage": "/ai-benchmark-explorer"
  ```
- Build the React app: `npm run build`
- Move the `build/` folder into my main website's repo at the correct path.

---

### **Option 2: Use a Subdomain (Recommended for Clean Separation)**
Instead of `/ai-benchmark-explorer`, you could use:
- `explorer.dasarpai.com`
- `benchmarks.dasarpai.com`

With Netlify, this is **much easier and more maintainable**. You can:
1. Create a new site on Netlify.
2. Deploy my React app there.
3. In my domain DNS (wherever `dasarpai.com` is managed), add a CNAME:
   ```
   explorer.dasarpai.com → my-new-site-name.netlify.app
   ```
4. In Netlify domain settings, set `explorer.dasarpai.com` as the custom domain.

---

### **Option 3: Set Up a Reverse Proxy (Advanced, Not Recommended for Netlify)**
If you're hosting with Nginx/Apache (not Netlify), you could reverse proxy:
- `dasarpai.com/ai-benchmark-explorer → explorer.dasarpai.com`

But Netlify doesn’t give you full control of the server to do this.

---

### Recommended Approach for Netlify:
If you want clean isolation, fast deploys, and maintainability:
- **Go with a subdomain** like `explorer.dasarpai.com`.
- You can still link to it from `dasarpai.com/ai-benchmark-explorer` using a redirect or menu item.



## Multiple Deployement Platform / hosting options 

### Frontend (React) — Free Hosting Options
These are great for static frontend apps like React:

1. **Netlify**
   - ✅ Super easy for React apps (just connect GitHub).
   - ✅ Free tier includes CI/CD, custom domain, HTTPS.
   - 🔧 Auto-build on git push.
   - 🌐 [https://netlify.com](https://netlify.com)

2. **Vercel**
   - ✅ Also very easy for React (especially Next.js).
   - ✅ Free for personal and hobby projects.
   - 🔧 Built-in CI/CD.
   - 🌐 [https://vercel.com](https://vercel.com)

3. **GitHub Pages**
   - ✅ Great if your React app is static (e.g., using `create-react-app`).
   - 🔧 Needs a bit of configuration (e.g., `homepage` in `package.json`).
   - 🌐 [https://pages.github.com](https://pages.github.com)

---

### Backend (Flask) — Free Hosting Options
Flask needs a server (dynamic backend), so here are your best free options:

1. **Render (free web service)**
   - ✅ Supports Flask easily.
   - ✅ Free tier with 750 hours/month.
   - 🔧 Deploy via GitHub integration.
   - 🌐 [https://render.com](https://render.com)

2. **Railway**
   - ✅ Easy deployment of Flask via GitHub.
   - ✅ Has a generous free tier.
   - 🔧 You can add PostgreSQL or other DBs if needed.
   - 🌐 [https://railway.app](https://railway.app)

3. **Replit**
   - ✅ Quick Flask hosting for prototyping.
   - 🟡 Limited customization and performance.
   - 🌐 [https://replit.com](https://replit.com)

4. **Fly.io**
   - ✅ Good for global Flask apps (Docker-based).
   - ✅ Free allowance for small apps.
   - 🔧 Requires Docker knowledge.
   - 🌐 [https://fly.io](https://fly.io)

---

### 🔹 Option: Use **Streamlit or Gradio** Instead of React + Flask
If your app is more like a dashboard or data explorer, you can skip frontend/backend separation entirely:

- **Streamlit Cloud**
  - ✅ Perfect for data-focused apps (your dataset, filters, charts, etc.)
  - ✅ Free hosting at [https://streamlit.io/cloud](https://streamlit.io/cloud)
  - 🔧 Python-only, no need for React or Flask.

- **Hugging Face Spaces (Gradio or Streamlit)**
  - ✅ Awesome if you want to showcase AI apps.
  - ✅ Free GPU/CPU support.
  - 🌐 [https://huggingface.co/spaces](https://huggingface.co/spaces)

---

### ✅ Recommendation (Simple and Free Stack)
If you want the easiest deployment path:
- **Frontend:** React hosted on **Netlify** or **Vercel**.
- **Backend:** Flask hosted on **Render**.
- Or use **Streamlit** hosted on **Streamlit Cloud** if your app is dashboard-style.

Let me know which route you're leaning toward, and I can help scaffold the project structure for you.
