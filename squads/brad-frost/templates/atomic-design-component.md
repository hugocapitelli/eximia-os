---
title: "[Component Name] — Atomic Design Component Documentation"
galaxy: "OPERATIONAL"
galaxy-color: "#FF69B4"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "atomic-design-component"
  - "[component name] — atomic desi"
  - "component overview"
  - "description"
  - "example use"
  - "atomic composition"
  - "components this contains (if a"
  - "used by (if applicable)"
  - "api / props"
  - "examples"
tags:
  - "galaxy-operational"
  - "document"
---

# [Component Name] — Atomic Design Component Documentation

> Based on Brad Frost's Atomic Design methodology
> Use this template to document components at any level (atoms, molecules, organisms)

---

## Component Overview

**Atomic Level:** [Atom | Molecule | Organism]
**Status:** [Draft | Review | Approved | Deprecated]
**Last Updated:** [Date]
**Owner:** [Team/Person]

### Description
[Clear, concise description of what this component does and when to use it]

### Example Use
[Real-world example of component in use]

---

## Atomic Composition

### Components This Contains (if applicable)
- [List of sub-components if this is a molecule/organism]
- Example: "Label (atom) + Input (atom) + Error Message (atom)"

### Used By (if applicable)
- [List of parent components that use this component]
- Example: "Used in LoginForm (molecule) and RegistrationForm (molecule)"

---

## API / Props

[For components with configurable props]

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | string | Yes | — | Form field label |
| `error` | string | No | — | Error message to display |
| `required` | boolean | No | `false` | Mark field as required |
| `disabled` | boolean | No | `false` | Disable interaction |

### Examples

```jsx
// Basic usage
<FormField label="Email" />

// With error
<FormField label="Email" error="Invalid email" />

// Required field
<FormField label="Name" required />
```

---

## Variants

### 1. [Variant Name]
**When to use:** [Description]
```jsx
<Component variant="primary" />
```

### 2. [Variant Name]
**When to use:** [Description]
```jsx
<Component variant="secondary" />
```

---

## Accessibility

### Keyboard Navigation
- [ ] Keyboard accessible
- [ ] Logical tab order
- [ ] Focus management

### Screen Reader
- [ ] Proper ARIA labels
- [ ] Semantic HTML
- [ ] Alternative text for images

### Color & Contrast
- [ ] WCAG AA contrast ratio
- [ ] Not reliant on color alone
- [ ] Works in high contrast mode

**Notes:** [Any accessibility considerations]

---

## Design Tokens Used

| Token | Usage |
|-------|-------|
| `color-primary` | Primary action button |
| `space-2` | Internal padding |
| `font-body` | Text content |

---

## States

### Normal
[Description and visual/code example]

### Hover
[Description and visual/code example]

### Focus
[Description and visual/code example]

### Disabled
[Description and visual/code example]

### Error
[Description and visual/code example]

---

## When to Use

✅ **Use this component when:**
- [Criteria 1]
- [Criteria 2]
- [Criteria 3]

❌ **Don't use this component when:**
- [Counter-example 1]
- [Counter-example 2]

---

## Related Components

- **Parent Molecule:** [If applicable]
- **Sibling Atoms:** [If applicable]
- **Alternative Solutions:** [If this component doesn't fit]

---

## Code

### HTML
```html
<!-- Basic example -->
<label for="email">Email</label>
<input type="email" id="email" required>
```

### CSS
```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-field label {
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: 600;
}
```

### React
```jsx
import { FormField } from '@mydesignsystem/form-field';

export function LoginForm() {
  return (
    <FormField
      label="Email"
      type="email"
      required
    />
  );
}
```

---

## Responsive Behavior

- **Mobile:** [How component adapts on mobile]
- **Tablet:** [How component adapts on tablet]
- **Desktop:** [Desktop layout and behavior]

---

## Performance Considerations

- [ ] Lazy loaded (if applicable)
- [ ] Optimized re-renders
- [ ] No unnecessary animations
- [ ] Minimal CSS bundle impact

**Notes:** [Performance concerns or optimizations]

---

## Versioning

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | [Date] | Initial release |
| 1.1.0 | [Date] | Added new variant |

---

## Questions & Answers

**Q: Why is this component structured this way?**
A: [Answer explaining design decisions]

**Q: Can I customize the colors?**
A: [Answer about customization]

---

## Maintenance

**Last Reviewed:** [Date]
**Review Frequency:** [Quarterly/Semi-annual/Annual]
**Maintainer:** [Name/Team]

**Known Issues:** [If any]

**Future Improvements:** [Planned enhancements]

---

*Template created for Brad Frost Atomic Design Squad*

#galaxy-operational