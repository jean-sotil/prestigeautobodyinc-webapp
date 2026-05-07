# n8n — Prompt optimizado para generación de Blog Posts (Payload CMS)

Este archivo contiene el **System Prompt** listo para pegar en el nodo **AI Agent** de n8n. Está alineado 1:1 con el schema de la colección `blog-posts` de Payload CMS en este repo (`src/payload/collections/BlogPosts.ts`) y con los locales configurados (`en`, `es`).

---

## 1. Contexto del schema (referencia)

Campos de la colección `blog-posts`:

| Campo              | Tipo                          | Requerido | Localizado | Notas                                         |
| ------------------ | ----------------------------- | --------- | ---------- | --------------------------------------------- |
| `title`            | text                          | ✅        | ✅         | Título del post                               |
| `slug`             | text                          | ✅        | ❌         | Único, kebab-case, sin acentos                |
| `excerpt`          | textarea                      | ✅        | ✅         | Resumen 140–180 caracteres                    |
| `content`          | richText (Lexical)            | ✅        | ✅         | Markdown → convertir a Lexical antes del POST |
| `featuredImage`    | upload → `media`              | ❌        | ✅         | ID del media asset                            |
| `author`           | relationship → `team-members` | ✅        | ❌         | ID del team member                            |
| `meta.title`       | text                          | ❌        | ✅         | 50–60 caracteres                              |
| `meta.description` | textarea                      | ❌        | ✅         | 140–160 caracteres                            |
| `meta.ogImage`     | upload → `media`              | ❌        | ✅         | ID del media asset                            |
| `status`           | select                        | ❌        | ❌         | `draft` \| `published` \| `archived`          |
| `publishedAt`      | date (ISO8601)                | ❌        | ❌         |                                               |
| `tags`             | array `{ tag: text }`         | ❌        | ✅         | 3–7 tags                                      |

Locales: `en` (default), `es`. Fallback activo.

---

## 2. System Prompt (copiar/pegar en el nodo AI Agent)

```text
You are an expert automotive content strategist and bilingual (EN/ES) SEO copywriter for Prestige Auto Body Inc, a collision repair and auto body shop. Your job is to produce a complete, production-ready blog post that maps exactly to the Payload CMS `blog-posts` collection schema.

# INPUT
You will receive a JSON object with any subset of these keys (fields not provided must be inferred):
{
  "topic": "string — main subject of the article",
  "keywords": ["string", "..."] ,
  "targetAudience": "string (e.g., 'vehicle owners in NJ after a collision')",
  "tone": "string (default: 'professional, reassuring, expert')",
  "wordCount": number (default: 900),
  "authorId": "string — Payload team-members document ID",
  "featuredImageId": "string — Payload media document ID (optional)",
  "ogImageId": "string — Payload media document ID (optional)",
  "publish": boolean (default: false),
  "publishedAt": "ISO8601 string (optional)"
}

# BRAND & DOMAIN RULES
- Brand voice: trustworthy, expert, empathetic, plain-spoken. Never salesy.
- Domain: auto body repair, collision repair, paint refinishing, frame straightening, dent removal, detailing, insurance claims, OEM vs aftermarket parts, ADAS calibration, rental cars, and customer education.
- Never invent prices, warranties, legal advice, or insurance coverage specifics. Use language like "typically", "in most cases", "check with your insurer".
- Never claim certifications the shop may not hold. Speak generically about industry standards (I-CAR, ASE, OEM procedures) unless the input explicitly confirms them.
- US English for `en`. Neutral Latin American Spanish for `es` (no voseo, no regionalisms).

# SEO RULES
- Primary keyword appears in: `title`, `meta.title`, first 100 words of `content`, at least one H2, and `slug`.
- `title`: 55–65 chars, compelling, includes primary keyword naturally.
- `meta.title`: 50–60 chars, may differ slightly from `title` for CTR.
- `meta.description`: 140–160 chars, includes primary keyword + value proposition + implicit CTA.
- `excerpt`: 140–180 chars, human-friendly hook, no keyword stuffing.
- `slug`: lowercase kebab-case, ASCII only, 3–7 words, no stop words if avoidable, no dates. Same slug for both locales.
- `tags`: 3–7 short tags, singular form, lowercase. Localize them per locale.

# CONTENT STRUCTURE (for the `content` field, in Markdown)
Produce a coherent article of roughly the requested word count (±15%), organized as:
1. Opening hook (2–4 sentences) — relatable scenario or statistic.
2. `## ` Why this matters / what the reader will learn.
3. 3–6 `## ` H2 sections covering the topic in depth. Use `### ` H3 where helpful.
4. Use bullet lists, numbered steps, and short paragraphs (max 4 sentences). Add 1–2 pull-quote style callouts via blockquotes (`> `) when natural.
5. Include a "Common mistakes" or "What to ask your shop" practical section.
6. `## ` Closing section with clear next step (e.g., "request a free estimate"). Never include phone numbers, emails, or URLs — the CMS layout handles CTAs.
7. No external links unless the input provides them. No images inside content (featured image is separate).

# OUTPUT — STRICT JSON ONLY
Return ONE JSON object. No prose, no code fences, no commentary. Exactly this shape:

{
  "title": { "en": "...", "es": "..." },
  "slug": "kebab-case-slug",
  "excerpt": { "en": "...", "es": "..." },
  "content": { "en": "# ...markdown...", "es": "# ...markdown..." },
  "featuredImage": "<featuredImageId or null>",
  "author": "<authorId>",
  "meta": {
    "title":       { "en": "...", "es": "..." },
    "description": { "en": "...", "es": "..." },
    "ogImage": "<ogImageId or null>"
  },
  "status": "draft" | "published",
  "publishedAt": "<ISO8601 or null>",
  "tags": {
    "en": [ { "tag": "..." }, { "tag": "..." } ],
    "es": [ { "tag": "..." }, { "tag": "..." } ]
  }
}

# RULES FOR THE OUTPUT
- `status` = "published" only if input `publish === true`; otherwise "draft".
- `publishedAt` = input value if provided, else current ISO8601 timestamp when `publish === true`, else null.
- `author` MUST be the provided `authorId` as a string. If missing, return the literal string "MISSING_AUTHOR_ID" — do not invent one.
- `featuredImage` / `meta.ogImage` = provided ID string or null. Never invent IDs.
- The `content` field holds Markdown STRINGS per locale. The n8n workflow will convert them to Lexical JSON before POSTing to Payload.
- The `es` version is a full, native translation — not a literal one. Adapt idioms and examples for a Spanish-speaking US Hispanic reader.
- Both locales must have equivalent semantic content and similar length (±20%).
- Output MUST be valid JSON parseable by `JSON.parse`. No trailing commas. No comments.
```

---

## 3. Ejemplo de input para el nodo (prueba rápida)

```json
{
  "topic": "What to do in the first 24 hours after a car accident",
  "keywords": ["after car accident", "collision repair", "insurance claim"],
  "targetAudience": "drivers in New Jersey after a minor collision",
  "wordCount": 900,
  "authorId": "665f0a1b2c3d4e5f6a7b8c9d",
  "featuredImageId": null,
  "publish": false
}
```

---

## 4. Integración con Payload CMS API — instrucciones completas para n8n

### 4.1 Prerequisitos en Payload (una sola vez)

**Habilitar API Keys en la colección `users`.** Abre `src/payload/collections/Users.ts` y cambia:

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true, // ← agregar esto
  },
  // ...resto igual
};
```

Regenera tipos (`bun payload generate:types`) y reinicia el servidor. En el admin (`/admin`), edita el usuario que usará n8n (ideal: un usuario dedicado con rol `content-editor` o `super-admin`), marca **Enable API Key**, genera la key y cópiala — solo se muestra una vez.

Variables de entorno necesarias en n8n:

- `PAYLOAD_URL` → `https://tu-dominio.com` (sin barra final)
- `PAYLOAD_API_KEY` → la API key generada arriba

### 4.2 Autenticación (header común a TODAS las requests)

Payload acepta dos esquemas:

| Método                             | Header                                           | Cuándo usar                              |
| ---------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| **API Key** (recomendado para n8n) | `Authorization: users API-Key <PAYLOAD_API_KEY>` | Workflows server-to-server               |
| Session cookie (JWT)               | `Authorization: JWT <token>`                     | Login previo via `POST /api/users/login` |

En el nodo HTTP Request de n8n: **Authentication** = `Generic Credential Type` → `Header Auth` → Name: `Authorization`, Value: `users API-Key {{$env.PAYLOAD_API_KEY}}`.

### 4.3 Endpoints REST que usarás

Base URL: `{{$env.PAYLOAD_URL}}/api`

| Acción                               | Método   | Path              | Query params relevantes                      |
| ------------------------------------ | -------- | ----------------- | -------------------------------------------- |
| Subir media                          | `POST`   | `/media`          | — (multipart/form-data)                      |
| Verificar slug único                 | `GET`    | `/blog-posts`     | `where[slug][equals]=<slug>&limit=1&depth=0` |
| Crear blog post (locale por defecto) | `POST`   | `/blog-posts`     | `locale=en&draft=true`                       |
| Actualizar por ID (segundo locale)   | `PATCH`  | `/blog-posts/:id` | `locale=es`                                  |
| Publicar (cambiar status)            | `PATCH`  | `/blog-posts/:id` | `draft=false`                                |
| Leer por ID                          | `GET`    | `/blog-posts/:id` | `locale=en&depth=1`                          |
| Borrar                               | `DELETE` | `/blog-posts/:id` | —                                            |

Docs oficiales: Payload REST API (usa nombre de colección en kebab-plural = `blog-posts`).

### 4.4 Flujo completo del workflow (orden de nodos en n8n)

```
┌──────────────┐   ┌──────────────┐   ┌─────────────────┐
│ Trigger      │ → │ Set topic &  │ → │ AI Agent        │
│ (cron/manual)│   │ keywords     │   │ (system prompt  │
└──────────────┘   └──────────────┘   │  §2 de este MD) │
                                      └────────┬────────┘
                                               ↓
┌──────────────┐   ┌──────────────┐   ┌─────────────────┐
│ HTTP: POST   │ ← │ Code:        │ ← │ Code:           │
│ /api/media   │   │ generar      │   │ JSON.parse +    │
│ (si hace     │   │ slug único   │   │ validar schema  │
│  falta img)  │   │ (ver 4.8)    │   └─────────────────┘
└──────┬───────┘   └──────┬───────┘
       ↓                  ↓
┌──────────────────────────────────┐
│ Code: Markdown → Lexical JSON    │  (content.en y content.es)
│ usa `@payloadcms/richtext-lexical`│
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ HTTP: POST /api/blog-posts       │  locale=en, body = payload EN completo
│ ?locale=en&draft=true            │  → guarda {{id}} del response
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ HTTP: PATCH /api/blog-posts/{id} │  locale=es, body = solo campos ES
│ ?locale=es                       │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ IF publish === true:             │
│ HTTP PATCH con                   │
│ {status:"published",             │
│  publishedAt:"<ISO>"}            │
│ ?draft=false                     │
└──────────────────────────────────┘
```

### 4.5 Config del nodo HTTP — POST `/media` (imagen destacada)

Solo necesario si `featuredImageId` no vino en el input y quieres subir una imagen generada.

```
Method:        POST
URL:           {{$env.PAYLOAD_URL}}/api/media
Authentication: Header Auth (Authorization: users API-Key {{$env.PAYLOAD_API_KEY}})
Send Body:     ON
Body Content Type: Form-Data (multipart)
Body Parameters:
  - Name: file        | Type: n8n Binary File | Input Data Field Name: data
  - Name: alt         | Type: Text            | Value: {{ $json.altText }}
```

Response devuelve `{ doc: { id: "...", url: "...", filename: "..." } }`. Extrae `doc.id` y úsalo como `featuredImage` en el POST del blog.

### 4.6 Config del nodo HTTP — POST `/blog-posts` (crear en locale `en`)

```
Method:        POST
URL:           {{$env.PAYLOAD_URL}}/api/blog-posts
Authentication: Header Auth
Query Parameters:
  - locale: en
  - draft:  true          (siempre crear como draft, luego publicar aparte)
Send Headers:  ON
  - Content-Type: application/json
Send Body:     ON
Body Content Type: JSON
Specify Body:  Using JSON
JSON Body:
```

```json
{
  "title":      "{{ $json.title.en }}",
  "slug":       "{{ $json.slug }}",
  "excerpt":    "{{ $json.excerpt.en }}",
  "content":    {{ JSON.stringify($json.contentLexical.en) }},
  "featuredImage": "{{ $json.featuredImage }}",
  "author":     "{{ $json.author }}",
  "meta": {
    "title":       "{{ $json.meta.title.en }}",
    "description": "{{ $json.meta.description.en }}",
    "ogImage":     "{{ $json.meta.ogImage }}"
  },
  "status":      "draft",
  "tags":        {{ JSON.stringify($json.tags.en) }}
}
```

Response: `{ doc: { id, ... }, message: "..." }`. Guarda `$json.doc.id`.

### 4.7 Config del nodo HTTP — PATCH `/blog-posts/:id` (locale `es`)

```
Method:        PATCH
URL:           {{$env.PAYLOAD_URL}}/api/blog-posts/{{ $json.doc.id }}
Authentication: Header Auth
Query Parameters:
  - locale: es
  - draft:  true
JSON Body:
```

```json
{
  "title":   "{{ $('AI Agent').item.json.title.es }}",
  "excerpt": "{{ $('AI Agent').item.json.excerpt.es }}",
  "content": {{ JSON.stringify($('AI Agent').item.json.contentLexical.es) }},
  "meta": {
    "title":       "{{ $('AI Agent').item.json.meta.title.es }}",
    "description": "{{ $('AI Agent').item.json.meta.description.es }}"
  },
  "tags":    {{ JSON.stringify($('AI Agent').item.json.tags.es) }}
}
```

> ⚠️ **No reenvíes `slug`, `author`, `status`, ni `publishedAt`** en el PATCH de locale secundario — esos campos NO son localizados y sobreescribirías valores ya correctos. Solo campos con `localized: true` (ver tabla §1).

### 4.8 Code node — generar slug único (antes del POST)

```js
// Input: $json.slug propuesto por el AI Agent
const base = $json.slug;
const url = `${$env.PAYLOAD_URL}/api/blog-posts?where[slug][like]=${encodeURIComponent(base)}&limit=100&depth=0`;

const res = await this.helpers.httpRequest({
  method: 'GET',
  url,
  headers: { Authorization: `users API-Key ${$env.PAYLOAD_API_KEY}` },
  json: true,
});

const existing = new Set((res.docs || []).map((d) => d.slug));
let slug = base;
let i = 2;
while (existing.has(slug)) {
  slug = `${base}-${i++}`;
}

return [{ json: { ...$json, slug } }];
```

### 4.9 Code node — Markdown → Lexical JSON

Payload guarda `content` en formato Lexical (árbol JSON), no Markdown. Opciones:

**Opción A — paquete oficial (recomendado):**

```js
// Instalar en el entorno n8n: npm i @payloadcms/richtext-lexical marked
const {
  convertMarkdownToLexical,
} = require('@payloadcms/richtext-lexical/markdown');
const { defaultEditorConfig } = require('@payloadcms/richtext-lexical');

const en = convertMarkdownToLexical({
  editorConfig: defaultEditorConfig,
  markdown: $json.content.en,
});
const es = convertMarkdownToLexical({
  editorConfig: defaultEditorConfig,
  markdown: $json.content.es,
});

return [{ json: { ...$json, contentLexical: { en, es } } }];
```

**Opción B — sin paquete, Lexical mínimo (fallback):** envía un root con un solo `paragraph` por línea del markdown. Menos fiel, pero funciona:

```js
function mdToLexical(md) {
  const blocks = md.split(/\n\n+/).map((p) => ({
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', version: 1, text: p, format: 0 }],
  }));
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: blocks,
    },
  };
}
return [
  {
    json: {
      ...$json,
      contentLexical: {
        en: mdToLexical($json.content.en),
        es: mdToLexical($json.content.es),
      },
    },
  },
];
```

### 4.10 Publicar (después de revisión)

Si `publish === true` en el input original, añade un nodo final:

```
Method: PATCH
URL:    {{$env.PAYLOAD_URL}}/api/blog-posts/{{ $json.doc.id }}
Query:  draft=false
Body:
```

```json
{ "status": "published", "publishedAt": "{{ $now.toISO() }}" }
```

### 4.11 Manejo de errores

- **401 Unauthorized** → API Key mal formada. El header debe ser EXACTAMENTE `users API-Key <key>` (con espacio, el slug `users` y `API-Key` con guion).
- **403 Forbidden** → el usuario dueño de la API Key no tiene permiso de `create`/`update` en `blog-posts`. Revisa `access` en la colección.
- **400 ValidationError** con `data.errors[]` → campo requerido faltante o tipo incorrecto. Usualmente `content` en formato equivocado (Markdown crudo en vez de Lexical).
- **404** → ID de relación (`author`, `featuredImage`) no existe.
- **409/duplicate key** → `slug` ya existe. Ejecuta el paso §4.8.

Agrega un nodo **IF** después de cada HTTP con `{{ $json.errors }}` `is not empty` → branch de error → notificación Slack/email.

---

## 5. Trending topics del nicho (auto body / collision repair)

Agrupados por intención de búsqueda. Úsalos como valor del campo `topic` en el input del AI Agent o como input de un nodo "pick random topic" en n8n.

### A. Educativos (top-of-funnel, alto volumen de búsqueda)

- Qué hacer en las primeras 24 horas después de un accidente de auto.
- Cómo leer un estimado de reparación de carrocería línea por línea.
- OEM vs aftermarket vs recycled parts: ¿cuál elegir y cuándo?
- Diferencia entre paintless dent repair (PDR) y reparación tradicional.
- Cómo se recalibra el sistema ADAS después de reemplazar un parabrisas.
- Señales de daño estructural oculto tras una colisión "menor".
- Total loss: cómo se calcula y qué hacer si no estás de acuerdo.
- Diminished value claim: qué es y cómo reclamarlo en NJ/NY.
- Cuánto dura típicamente una reparación de carrocería y de qué depende.
- Cómo proteger la pintura nueva en los primeros 30/60/90 días.

### B. Seguros y proceso de reclamo (comercial, alta conversión)

- Derechos del consumidor: elegir el taller de reparación (right to choose).
- Direct Repair Program (DRP) vs taller independiente: pros y contras.
- Qué cubre collision, comprehensive y liability — con ejemplos reales.
- Supplements: por qué tu estimado inicial casi nunca es el final.
- Deductible: qué es, cuándo se paga y cómo funciona en una tercera parte culpable.
- Rental car coverage durante la reparación: límites y trampas comunes.
- Cómo documentar el accidente en la escena para acelerar el claim.
- Qué hacer si el ajustador subestima el daño.

### C. Estacionales (calendario editorial)

- **Invierno (Nov–Feb):** daño por sal en carrocería, óxido, baches, accidentes en nieve/hielo.
- **Primavera (Mar–May):** granizo (hail damage), polen y savia en la pintura, detailing post-invierno.
- **Verano (Jun–Ago):** fade de pintura por UV, daño en plásticos por calor, road trips.
- **Otoño (Sep–Oct):** ciervos/animales en la carretera, lluvias, preparación para invierno.
- **Festivos:** reparaciones rápidas antes de Thanksgiving/Christmas, DUI spikes.

### D. Tendencias 2025–2026 (EVs, tecnología, regulación)

- Reparación de carrocería en EVs: Tesla, Rivian, Lucid — certificaciones requeridas.
- Battery pack safety durante collision repair.
- Aluminum vs steel body repair: por qué importa el taller certificado.
- ADAS calibration: static vs dynamic, por qué no es opcional.
- Paint matching con cámaras y espectrofotómetros vs ojo humano.
- Lightweight materials (carbon fiber, aluminum, UHSS) en vehículos modernos.
- Impacto del right-to-repair en dueños de autos.

### E. Local / geo (SEO local para NJ/NY area)

- Mejor taller de collision repair en [ciudad]: qué buscar.
- Reparación de carrocería cerca de ti: preguntas para filtrar talleres.
- Guía de inspección estatal de NJ después de una reparación.
- Qué hacer tras un hit-and-run en [área metropolitana].

### F. Comparativas y listicles (alto CTR)

- 7 señales de que necesitas un body shop, no un mechanic.
- 5 mitos sobre la reparación de pintura que te cuestan dinero.
- Before & after: 10 restauraciones que parecían pérdida total.
- Top 10 preguntas que debes hacerle a un estimador.

---

## 6. Keywords del nicho (para input `keywords[]` y SEO)

### Primary keywords (high intent)

`collision repair`, `auto body shop`, `car accident repair`, `auto body repair near me`, `dent repair`, `paintless dent repair`, `car paint repair`, `bumper repair`, `frame repair`, `fender repair`, `auto body estimate`, `free collision estimate`, `certified collision center`.

### Long-tail / question keywords (zero-click, AI Overviews)

`how long does collision repair take`, `how much does it cost to fix a dented bumper`, `do I have to use the insurance's body shop`, `what is diminished value claim`, `will insurance total my car if frame is bent`, `how to tell if car has frame damage`, `is paintless dent repair worth it`, `OEM parts vs aftermarket collision`, `ADAS calibration after windshield replacement`, `what is a supplement in auto body repair`.

### Insurance-related

`direct repair program`, `DRP body shop`, `right to choose repair shop`, `deductible collision claim`, `third party claim body shop`, `rental car during repair`, `total loss threshold`, `actual cash value ACV`, `supplement estimate`, `betterment charges`.

### Services (match a `services` collection del sitio)

`paint refinishing`, `frame straightening`, `unibody repair`, `aluminum body repair`, `EV collision repair`, `Tesla certified body shop`, `hail damage repair`, `glass replacement`, `headlight restoration`, `auto detailing`, `ceramic coating`, `paint correction`, `clear coat repair`.

### Geo modifiers (combinar con primary)

`[city] collision repair`, `[city] auto body shop`, `body shop near [neighborhood]`, `NJ auto body`, `best collision center [county]`, `[zip] dent repair`.

### Spanish / ES locale (para el segundo locale del post)

`taller de hojalatería y pintura`, `reparación de colisiones`, `taller de carrocería`, `reparación de abolladuras`, `pintura automotriz`, `reparación de defensa`, `enderezado de chasis`, `reparación después de accidente`, `taller certificado`, `estimado gratis de carrocería`, `reclamo de seguro por accidente`, `pérdida total auto`, `valor disminuido`, `reparación de auto eléctrico`.

### Entities & modifiers útiles (E-E-A-T)

I-CAR, ASE, OEM, ADAS, PDR, R&I (remove & install), tear-down, blend panel, tri-coat, basecoat/clearcoat, PPG, Axalta, Sikkens, BASF, Chief frame machine, Car-O-Liner, measuring system, pre-scan / post-scan, OEM repair procedures.

---

## 7. Checklist antes de activar el workflow

- [ ] `useAPIKey: true` agregado en `src/payload/collections/Users.ts` y tipos regenerados.
- [ ] Usuario dedicado para n8n creado en `/admin` con API Key habilitada y rol `content-editor` (o `super-admin`).
- [ ] Variables `PAYLOAD_URL` y `PAYLOAD_API_KEY` configuradas en credenciales de n8n.
- [ ] `authorId` válido (existente en `team-members`) — cachearlo en un nodo Set.
- [ ] Paquete `@payloadcms/richtext-lexical` disponible en el entorno del nodo Code (o usar fallback §4.9 B).
- [ ] Validación de JSON en el nodo posterior al AI Agent (fail-fast si el modelo devuelve texto extra).
- [ ] Nodo de slug único implementado (§4.8).
- [ ] Probar el workflow end-to-end con `publish: false` antes de activar el trigger recurrente.
- [ ] Nodo de manejo de errores (§4.11) con notificación externa configurado.
