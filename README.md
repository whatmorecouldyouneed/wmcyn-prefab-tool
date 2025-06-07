# 🛠 wmcyn-prefab-tool

> yo bro you make websites??

## 🚀 what is it

`wmcyn-prefab-tool` is an internal command line utility built for authorized developers working within the **whatmorecouldyouneed** organization.

it lets you spin up fully functional, deployment-ready web or mobile projects with just a few prompts. it's like having a jumpstart button for drops, sites, campaigns, and creative ideas.

every project created with this tool:

- lives in the official **wmcyn** github org
- supports **next.js (app router)**, **react native**, or **vanilla html/css**
- deploys automatically via **github actions**
- includes **firebase** mailing list functionality
- optionally integrates **shopify** for storefronts
- optionally wires up **dns** / domain config
- optionally includes **jest** + **react testing library** setup
- ships with a clean `/` homepage and optional `/shop`

## 🔐 who can use this

this tool is **only for developers with write access** to the `whatmorecouldyouneed` github org.

you'll be prompted to authorize your github account. if you're not in the org, it won't let you scaffold anything.

## ✅ requirements
- node.js 18+

- access to the whatmorecouldyouneed github organization

- a firebase project (for mailing list + auth)

- shopify storefront api credentials (if using shopify)

- optional domain or dns provider details

## 🧰 how to use

```bash
npx wmcyn-init
```

then follow the prompts

## 📦 output shoud include

- firebase mailing list form + firestore integration  
- optional shopify `/shop` page with default product query  
- clean `/` homepage  
- `.env.production.example` file  
- preconfigured github actions workflow  
- support for `next export` + github pages deploy (via `gh-pages` branch)  
- optional jest + react testing library setup with example tests

## 🚢 deployment

the generated project includes a working deploy pipeline via github actions:

- installs deps  
- injects firebase + shopify secrets from the github repo  
- builds the site using `next export`  
- deploys to the `gh-pages` branch automatically on push to `main`  

you'll need to set your secrets manually in github before deploying.

## 🔥 firebase required env

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```
these are the keys used to connect to firebase + store email signups in a `mailingList` firestore collection.

## 🛍️ optional shopify env

```env
NEXT_PUBLIC_SHOPIFY_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
```

## 📈 next up

- 🧠 cms options  
