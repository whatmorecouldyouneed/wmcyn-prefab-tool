# 🛠 wmcyn-prefab-tool

> yo bro you make websites??

this is for that.

---

## 🚀 what is it

`wmcyn-prefab-tool` is an internal command line utility built for authorized developers working within the **whatmorecouldyouneed** organization.

it lets you spin up fully functional, deployment-ready web or mobile projects with just a few prompts. it’s like having a jumpstart button for drops, sites, campaigns, and creative ideas.

every project created with this tool:

- lives in the official **wmcyn** github org
- supports **next.js (app router)**, **react native**, or **vanilla html/css**
- deploys automatically via **github actions**
- includes **firebase** mailing list functionality
- optionally integrates **shopify** for storefronts
- optionally wires up **dns** / domain config
- ships with a clean `/` homepage and optional `/shop`

---

## 🔐 who can use this

this tool is **only for developers with write access** to the `whatmorecouldyouneed` github org.

you’ll be prompted to authorize your github account. if you're not in the org, it won’t let you scaffold anything.

---

## 🧰 how to use

```bash
npx wmcyn-init
```

then follow the prompts

once confirmed, it will:

- scaffold your project  
- wire up firebase + shopify  
- generate `.env.production.example`  
- drop in a working deploy pipeline  
- push everything to a new repo in the org

