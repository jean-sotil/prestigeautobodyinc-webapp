# Proposed Spanish slugs for the 15 untranslated ES blog posts

Needs owner approval before the CMS change. The same slugs are used by the 301s in `next.config.ts` (`ES_UNTRANSLATED_SLUG_MAP`).
Spanish titles are the live `<title>` of `/es/blog/<english-slug>`.

| English slug                               | Spanish title                                                                     | Proposed Spanish slug                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| protect-car-paint-from-sun-damage          | Protege la Pintura de tu Auto del Sol                                             | proteger-pintura-auto-dano-solar                        |
| document-car-accident-insurance-claim      | Cómo Documentar un Accidente de Auto: Guía de 7 Pasos                             | como-documentar-accidente-auto-seguro                   |
| ev-collision-repair-specialist             | Reparación de Colisiones de VE: Por Qué Su Tesla Necesita un Taller Especializado | reparacion-colisiones-vehiculos-electricos-especialista |
| rental-car-coverage-during-repairs-guide   | Guía de Cobertura de Auto de Alquiler para Reparaciones                           | guia-cobertura-auto-alquiler-durante-reparaciones       |
| minor-collision-hidden-damage-inspection   | ¿Choque Leve? El Daño Oculto Requiere Inspección Profesional                      | choque-leve-dano-oculto-inspeccion-profesional          |
| hail-damage-repair-guide                   | Guía Experta de Reparación de Daños por Granizo                                   | guia-reparacion-danos-por-granizo                       |
| car-paint-repair-myths                     | 5 Mitos de Reparación de Pintura                                                  | mitos-reparacion-pintura-auto                           |
| adas-recalibration-windshield-replacement  | Recalibración ADAS Tras Reemplazo de Parabrisas                                   | recalibracion-adas-reemplazo-parabrisas                 |
| collision-vs-comprehensive-insurance-guide | Seguro de Colisión vs. Cobertura Amplia                                           | seguro-colision-vs-cobertura-amplia                     |
| how-to-read-auto-body-estimate             | Cómo Leer un Estimado de Carrocería                                               | como-leer-estimado-carroceria                           |
| aluminum-vs-steel-body-repair              | Reparación de Aluminio vs. Acero                                                  | reparacion-carroceria-aluminio-vs-acero                 |
| adas-recalibration-after-collision         | Recalibración de ADAS Después de Colisión                                         | recalibracion-adas-despues-de-colision                  |
| what-is-car-insurance-deductible           | Deducible del seguro de auto: Explicado                                           | que-es-deducible-seguro-auto                            |
| what-to-do-after-car-accident              | Después de un Accidente de Auto: Lista de Pasos para las 24 Horas                 | que-hacer-despues-de-accidente-auto                     |
| right-to-choose-auto-body-shop             | Su Derecho a Elegir Taller de Reparación                                          | derecho-a-elegir-taller-carroceria                      |

## Deploy ordering (important)

The 15 redirects in `next.config.ts` are gated behind `ENABLE_ES_BLOG_SLUG_REDIRECTS=true`. Enabling them before the CMS slugs exist would 301 live 200 pages to 404s.
Order: 1) approve this table, 2) update the ES slugs in the CMS, 3) set the env var and deploy. The same flag makes the sitemap skip the old `/es/<english-slug>` entries.

Note: the existing `/es/blog/right-to-choose-repair-shop` rule points at `/es/blog/right-to-choose-auto-body-shop`; once the flag is on it becomes a two-hop chain. Repoint it to `derecho-a-elegir-taller-carroceria` at that time.
