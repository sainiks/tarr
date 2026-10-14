# SinghWorks storefront: design and benchmark direction

## Concept

Design for the person trying to identify a component during maintenance, not just for a buyer who already knows the catalog. The first screen acts like a compact parts desk: search by part number, machine, or plain description, then hand off to a human when the match is unclear. The catalog is a data-driven hierarchy: main systems → part families → model/series examples → quote by selected model.

Visual direction: field-service console meets printed engineering index. Use a restrained graphite / warm-paper palette, safety-orange actions, numbered diagrams, small technical labels, and motion in the gear illustration. Keep the animation decorative and respect reduced-motion settings.

Typography and color tokens: Space Grotesk for headings, DM Sans for reading and controls, IBM Plex Mono for part references only; graphite `#202A32`, deep navy `#172630`, warm paper `#F5F3ED`, and terracotta `#D97955` for the main action color.

## Benchmark references

- [RS India](https://in.rsdelivers.com/) exposes search around product, part number, and brand. Its search criteria also include RS stock number, manufacturer part number, and keywords. The storefront applies this task-first search idea and adds machine / plain-language entry points for buyers who do not have an SKU.
- [McMaster-Carr](https://www.mcmaster.com/) sets a strong organization benchmark: a deep industrial taxonomy, prominent search, and very broad product coverage. Its visual presentation is not the target. This storefront borrows the hierarchy and makes the category map more scannable with mechanism tiles, clearer labels, focused product cards, and a quote-led flow suited to a supplier whose prices and availability need confirmation.

## Applied interaction patterns

1. **Start with the repair task:** a buyer can search by part number, machine, or description without making an account.
2. **Scale beyond a small product grid:** the demo taxonomy includes 10 main systems, 43 part families, and 172 representative model/series entries. Each level has its own browse state, breadcrumb, and quote action.
3. **Make specifications visible:** model-family rows show details to include in a quote, such as bore, seal, pitch, ratio, or tolerances. Avoid publishing made-up prices or stock status.
4. **Provide a human fallback:** an unmatched search opens a prefilled enquiry rather than leaving the buyer at a dead end.
5. **Carry selected products into the quote:** the quote panel includes system, part family, model/item reference, machine/OEM reference when supplied, and fitment prompts. The buyer enters quantity and contact details instead of retyping the component description.
6. **Keep quote capture short:** name, phone, quantity, and a reference for unselected enquiries are required; email, company, and delivery pincode are optional. Collect a full shipping address only after the quote is accepted.

## Before publishing

- Replace the sample SinghWorks identity and product illustrations/details with the actual company brand and catalog.
- The 10/43/172 structure is representative seed data, not a claim about the company's real inventory. Replace `catalog-data.js` with the verified master taxonomy and model series.
- Set `BUSINESS_EMAIL` and `BUSINESS_WHATSAPP` in `script.js` to real sales contacts.
- Replace the email-app handoff with a backend or CRM endpoint if enquiries should be delivered without relying on the buyer's mail app.
- Add a secure drawing/photo upload endpoint if customers need to send files from the form; the current form intentionally does not claim to upload attachments.
