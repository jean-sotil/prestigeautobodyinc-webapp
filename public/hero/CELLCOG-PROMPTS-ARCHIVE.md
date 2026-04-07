# CellCog Prompts Archive

All hero images were generated using CellCog AI (`chat_mode="agent"`, 4K resolution).

## Generation Details

| Page               | CellCog Chat ID          | Credits |
| ------------------ | ------------------------ | ------- |
| Homepage           | 69d43f4bc180d402449e21f0 | ~34     |
| Collision Repair   | 69d43f4ec180d402449e21f2 | ~34     |
| Auto Body Services | 69d43f51c180d402449e21f4 | ~34     |
| Paint Solutions    | 69d53283469504c80c705fb8 | ~34     |
| Insurance Claims   | 69d43f56c180d402449e21f8 | ~34     |
| 24/7 Towing        | 69d43f59c180d402449e21fa | ~34     |
| Lifetime Warranty  | 69d43f5cc180d402449e21fc | ~34     |

## Prompt Files

Each page's CellCog prompt is stored in its respective directory:

- `homepage/cellcog-prompt.md`
- `collision-repair/cellcog-prompt.md`
- `auto-body-services/cellcog-prompt.md`
- `paint-solutions/cellcog-prompt.md`
- `insurance-claims/cellcog-prompt.md`
- `towing-24-7/cellcog-prompt.md`
- `lifetime-warranty/cellcog-prompt.md`

## Common Parameters

- **Resolution:** 6336×2688 (4K ultra-wide)
- **Aspect Ratio:** 12:5 (closest supported: ~21:9)
- **Style:** Photorealistic commercial photography
- **Format:** PNG (originals)
- **Text overlays:** None (handled via HTML/CSS layer)

## Brand Consistency Rules

- **Color palette:** Deep charcoal, metallic silver, warm amber accents, rich black
- **Lighting:** Dramatic warm studio lighting with soft highlights
- **Mood:** Premium, professional, trustworthy, confident
- **No logos burned into images** — added via website HTML/CSS

## Regeneration

To regenerate any image, use the prompt from its `cellcog-prompt.md` file:

```python
from cellcog import CellCogClient
client = CellCogClient()
result = client.create_chat(
    prompt=open("public/hero/{slug}/cellcog-prompt.md").read(),
    notify_session_key="agent:main:main",
    task_label="hero-{slug}-regen",
    chat_mode="agent"
)
```
