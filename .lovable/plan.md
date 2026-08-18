# Record the standing rules as project knowledge

Store the rules you gave as permanent project memory so every future change in this project obeys them automatically, without you restating them.

## Rules to be recorded

1. No pricing, currency symbols, checkout, purchase buttons, or links to pricing/billing pages anywhere. Signup and payment happen on the website. If a screen appears to need an upgrade call to action, it is left out and called out explicitly.
2. All colours, sizes and spacing come from CSS custom properties. No inline hex or hardcoded values in components, since token values will change.
3. Target width 390px. All design and verification happens at that width.
4. Minimum touch target 44px, achieved by extending the hit area with padding rather than enlarging the visual.
5. No hover states. Touch only, with press/active feedback instead.
6. Consumption-only app: signs in existing users, lets them manage stock and enquiries. No account creation, dealership setup, or subscription changes. Anything resembling onboarding belongs on the website.
7. Ask before adding any dependency.

## Technical detail

- Write a constraint memory file holding the full wording of all seven rules.
- Add the short, always-applied versions to the project memory index so they load on every future session.
- No application code changes in this step.

## Not included

No screens are built here. Once the rules are stored, the next step is whichever screen you want first (sign in, stock list, enquiries).