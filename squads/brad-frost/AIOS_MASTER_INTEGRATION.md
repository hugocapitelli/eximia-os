# Brad Frost Squad Integration with @aios-master

**Status:** ✅ Ready for Integration
**Date:** 2026-01-27
**Integration Type:** Squad Registration + Command Routing

---

## Quick Integration

### Option 1: Register in Agent Registry (Recommended)

Edit: `agent_registry.yaml`

Add Brad Frost squad to the registry:

```yaml
# In executive_agents or specialist_agents section:

- id: brad_frost_squad
  name: "Brad Frost — Atomic Design Squad"
  alias: "design-systems-specialist"
  version: "1.0.0"
  tier: 2
  status: production
  domain: "Design Systems & Atomic Design"

  description: |
    Complete Atomic Design specialist squad. Provides design system planning,
    Atomic Design education, component architecture guidance, design tokens
    strategy, team collaboration workshops, and LLM token economy analysis.

  competencies:
    - "Atomic Design methodology"
    - "Design system architecture"
    - "Component library design"
    - "Design tokens strategy"
    - "Designer-developer collaboration"
    - "LLM token economy analysis"
    - "Design system governance"

  paths:
    root: "squads/brad-frost/"
    agents: "squads/brad-frost/agents/"
    tasks: "squads/brad-frost/tasks/"
    workflows: "squads/brad-frost/workflows/"

  routing_keywords:
    - "atomic design"
    - "design system"
    - "component library"
    - "design tokens"
    - "designer-developer"
    - "collaboration"

  handoff_from:
    - the_maestro: "For design system strategy consultation"
    - the_cmo: "For brand system alignment"
    - the_ceo: "For design system governance"

  handoff_to:
    - "@dev": "For component implementation"
    - "@qa": "For design system validation"
    - "@architect": "For frontend architecture"

  dependencies:
    required: []
    optional: ["the_veritas"]  # For fact verification on design trends
```

### Option 2: Create Slash Command Alias

Edit: `.eximia/SLASH_COMMANDS.yaml`

```yaml
- command: /atomic-design
  routes_to: "brad_frost_squad"
  workflow: "atomic-design-planning"
  description: "Complete design system planning for your project"
  aliases: ["/design-system", "/atomic-system"]
  visibility: "global"

- command: /design-system
  routes_to: "brad_frost_squad"
  workflow: "design-systems-consulting"
  description: "Consult on design system strategy"
  visibility: "global"
```

---

## Integration with @aios-master

### How It Works

When user types `/atomic-design`:

```
User: /atomic-design
  ↓
@aios-master detects command
  ↓
Checks SLASH_COMMANDS.yaml routing
  ↓
Routes to brad_frost_squad
  ↓
Activates workflow: atomic-design-planning
  ↓
Brad Frost asks clarifying questions (elicit: true)
  ↓
Runs complete-design-system-planning task
  ↓
Returns:
  - Design system specification
  - Component inventory
  - Design tokens
  - Implementation roadmap
  - Governance guide
  - Token economy analysis
```

### Routing Decision Logic

@aios-master should route to Brad Frost when:

**Direct Commands:**
- `/atomic-design` → atomic-design-planning workflow
- `/design-system` → design-systems-consulting workflow
- `/atomic-design-lesson` → teach-atomic-design task
- `/token-roi-analysis` → token-economy-analysis task

**Keyword Routing (for natural language):**
- "I'm building [app], design a design system" → atomic-design-planning
- "Review my design system structure" → design-system-assessment
- "How do I organize components?" → teach-atomic-design
- "Designers and developers aren't talking" → collaboration-diagnosis
- "What are design tokens?" → design-tokens-strategy
- "How much will AI cost for components?" → token-roi-analysis

**Handoff from Other Agents:**
- The_CEO asking for design system governance → Brad Frost governance guide
- The_CMO asking for brand consistency → Brad Frost design tokens strategy
- The_Maestro needing design system architecture → Brad Frost complete planning
- @dev implementing components → Brad Frost component-library-review

---

## Integration Points

### 1. Direct Command

```bash
# User runs directly:
/atomic-design

# @aios-master routes to:
→ brad_frost_squad.atomic-design-planning workflow
```

### 2. Agent Handoff

```bash
# From The_Maestro:
"I need a design system strategy for our SaaS product"

# The_Maestro reasons:
→ This is design systems work
→ Route to brad_frost_squad
→ Use: atomic-design-planning workflow

# Brad Frost takes over:
→ Asks project details (interactively)
→ Returns complete plan
```

### 3. Natural Language Detection

```bash
# User asks:
"Help me design a component library with Atomic Design"

# @aios-master NLP detects:
→ Keywords: "component library", "Atomic Design"
→ Intent: Design system planning
→ Route to: brad_frost_squad
→ Workflow: atomic-design-planning
```

### 4. Context-Aware Routing

```bash
# User context: Building e-commerce platform
# Previous: Created product roadmap with CEO

# User asks: "Now let's design the UI components"
# @aios-master recognizes:
→ User is building product
→ Design phase reached
→ Route to: brad_frost_squad
→ Most relevant: atomic-design-planning
```

---

## @aios-master Configuration

### In CLAUDE.md or aios config:

```yaml
agent_routing:
  design_systems:
    primary: brad_frost_squad
    keywords:
      - "atomic design"
      - "design system"
      - "components"
      - "design tokens"
      - "component library"
      - "designer-developer"
    workflows:
      greenfield: "atomic-design-planning"
      review: "design-systems-consulting"
      training: "atomic-design-training"
    escalation:
      - level: strategy → the_maestro → brad_frost_squad
      - level: brand → the_cmo → brad_frost_squad
      - level: implementation → @dev (uses brad_frost guidance)

handoff_rules:
  brad_frost_squad:
    receives_from:
      - the_maestro: design system architecture
      - the_cmo: brand system alignment
      - the_ceo: governance strategy
      - @dev: component questions (while implementing)

    delegates_to:
      - @dev: "Here's the plan, implement these components"
      - @qa: "Validate against this governance guide"
      - the_veritas: "Verify design trends/benchmarks"
      - the_cmo: "Align brand tokens with visual identity"

priority:
  atomic_design_planning: high  # Main entry point
  token_roi_analysis: high      # Financial impact
  design_system_assessment: medium
  teach_atomic_design: medium
  collaboration_diagnosis: medium
```

---

## Example Integration Flows

### Flow 1: User Starts Design System from Scratch

```
User: /atomic-design

@aios-master detects: Design system planning needed
↓
Routes to: brad_frost_squad
↓
Activates: atomic-design-planning workflow
↓
Brad asks:
  - What are you building?
  - What's the scope?
  - Team size and timeline?
↓
Brad delivers:
  ✅ Design system specification
  ✅ Component inventory (atoms, molecules, organisms, etc.)
  ✅ Design tokens system
  ✅ Implementation roadmap (phases)
  ✅ Governance guide
  ✅ Token economy analysis
↓
User: "Great! Now let's implement"
↓
@aios-master suggests: "Let me connect you with @dev to build components"
↓
@dev gets: Brad's component specifications + roadmap
```

### Flow 2: CEO Needs Design System Strategy

```
The_CEO: "We need a design system strategy"

@aios-master reasons:
  - Request: design system strategy
  - Expertise needed: design systems
  - Appropriate agent: brad_frost_squad
↓
Routes to: brad_frost_squad
↓
Brad delivers:
  - Architecture recommendation
  - Governance framework
  - Team structure
  - Timeline and investment
  - Expected ROI
↓
The_CEO presents to board
```

### Flow 3: Designer-Developer Collaboration Issues

```
The_CMO: "Designers and developers aren't collaborating well"

@aios-master detects:
  - Issue: team collaboration
  - Cause likely: design system misalignment
  - Specialist: brad_frost_squad
↓
Routes to: brad_frost_squad
↓
Brad activates: collaboration-diagnosis task
↓
Brad diagoses:
  - Root cause: No shared vocabulary
  - Solution: Design system + naming conventions
  - Implementation: 4-week workshop plan
↓
Handoff to @dev for implementation
```

### Flow 4: Token Cost Optimization for AI Development

```
PM: "We're using Claude to generate components. How can we reduce costs?"

@aios-master detects:
  - Topic: LLM cost optimization
  - Context: Component development
  - Solution: Design systems + token analysis
  - Expert: brad_frost_squad
↓
Routes to: brad_frost_squad
↓
Brad activates: token-economy-analysis
↓
Brad calculates:
  - Current cost (without system): $5,000/project
  - Optimized cost (with system): $600/project
  - ROI: $4,400 + engineering time
↓
Recommendation: Invest in design system
```

---

## Configuration Files Needed

### 1. Update `agent_registry.yaml`
```bash
# Location: ./agent_registry.yaml
# Add brad_frost_squad entry (see above)
```

### 2. Update `.eximia/SLASH_COMMANDS.yaml`
```bash
# Location: ./.eximia/SLASH_COMMANDS.yaml
# Add /atomic-design and /design-system commands
```

### 3. Update `CLAUDE.md` (routing rules)
```bash
# Location: ./CLAUDE.md
# Add routing section for design systems
```

### 4. Optional: Create Integration Bridge

File: `.aios-core/integrations/brad-frost-squad.js`

```javascript
/**
 * Brad Frost Squad Integration Bridge
 * Routes design system requests to brad_frost_squad
 */

module.exports = {
  // Detect if request is design system related
  detectDesignSystemRequest(context) {
    const keywords = [
      'atomic design',
      'design system',
      'components',
      'design tokens',
      'component library'
    ];

    return keywords.some(k =>
      context.message.toLowerCase().includes(k)
    );
  },

  // Route to appropriate workflow
  routeRequest(context) {
    const messageLC = context.message.toLowerCase();

    if (messageLC.includes('atomic design') &&
        messageLC.includes('planning')) {
      return 'atomic-design-planning';
    }

    if (messageLC.includes('review') ||
        messageLC.includes('audit')) {
      return 'design-systems-consulting';
    }

    if (messageLC.includes('token') &&
        messageLC.includes('cost')) {
      return 'token-economy-analysis';
    }

    if (messageLC.includes('collaboration') ||
        messageLC.includes('designer') && messageLC.includes('developer')) {
      return 'collaboration-diagnosis';
    }

    // Default to complete planning
    return 'atomic-design-planning';
  },

  // Get handoff context for @dev, @qa, etc.
  getHandoffContext(workflow) {
    return {
      squad: 'brad-frost',
      workflow,
      deliverables: [
        'design-system-specification',
        'component-inventory',
        'design-tokens',
        'implementation-roadmap',
        'governance-guide'
      ]
    };
  }
};
```

---

## Testing Integration

### Test 1: Direct Command

```bash
User: /atomic-design

Expected:
  ✅ Brad Frost activates
  ✅ Workflow: atomic-design-planning starts
  ✅ Brad asks project questions
  ✅ Generates complete specification
```

### Test 2: Natural Language

```bash
User: "I'm building an e-commerce marketplace.
       Can you design my component system?"

Expected:
  ✅ @aios-master detects design system request
  ✅ Routes to brad_frost_squad
  ✅ Activates atomic-design-planning
  ✅ Brad understands project scope
  ✅ Delivers design system plan
```

### Test 3: Agent Handoff

```bash
The_Maestro: "Design a system for our SaaS"
→ brad_frost_squad receives request
✅ Executes complete-design-system-planning
✅ Returns comprehensive plan
```

### Test 4: Existing System Review

```bash
User: "Review my current design system"

Expected:
  ✅ Routes to brad_frost_squad
  ✅ Activates design-system-assessment
  ✅ Asks about current system
  ✅ Returns audit + improvements
```

---

## Success Metrics

### Integration Acceptance
- ✅ `/atomic-design` command routes correctly
- ✅ @aios-master recognizes design system requests
- ✅ Workflows execute without errors
- ✅ Output files generate properly
- ✅ Handoffs to @dev/@qa work

### User Experience
- ✅ User gets complete design system in one command
- ✅ No need to piece together multiple tasks
- ✅ Clear implementation roadmap provided
- ✅ Token economy ROI calculated automatically

### Business Value
- ✅ Design system planning becomes one-click
- ✅ Teams get complete playbook for execution
- ✅ ROI calculations justify investment
- ✅ Reduces design system planning time 80%

---

## Maintenance & Updates

### Quarterly Reviews
- [ ] Check if routing rules still optimal
- [ ] Update agent_registry.yaml with stats
- [ ] Monitor command usage patterns
- [ ] Improve handoff integration

### Version Updates
- Update version in squad.yaml
- Update agent_registry.yaml reference
- Add new commands if workflows added
- Update routing rules if needed

---

## FAQ

**Q: Can users call Brad Frost commands directly?**
A: Yes. Both work:
- Directly: `*brad-frost` then `*atomic-design`
- Via master: `/atomic-design` (routed by @aios-master)

**Q: What if The_Maestro already has a design-related task?**
A: Brad Frost shouldn't override. Instead, Brad provides detailed guidance that The_Maestro can reference.

**Q: Should atomic-design-planning always be the default?**
A: Yes, because it's the most comprehensive. Users can ask for specific tasks if needed.

**Q: Can other agents call Brad Frost workflows?**
A: Yes! Any agent can request Brad's expertise via handoff mechanism.

**Q: How does Brad know context from @aios-master?**
A: Through the workflow inputs and conversation context.

---

## Integration Status

**Ready for Implementation:** ✅
**Configuration Files:** Provided above
**Testing Plan:** Included
**Handoff Integration:** Complete
**Documentation:** ✅

**Next Steps:**
1. Add brad_frost_squad to agent_registry.yaml
2. Add slash commands to SLASH_COMMANDS.yaml
3. Test integration flows
4. Update CLAUDE.md routing rules
5. Monitor usage and refine

---

*Brad Frost Squad Integration Guide | Created 2026-01-27*
*Status: Ready for @aios-master integration*
