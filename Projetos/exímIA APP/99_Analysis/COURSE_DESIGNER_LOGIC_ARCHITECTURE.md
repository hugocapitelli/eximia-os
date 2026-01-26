# Course Designer — Logic Architecture
## Internal Engine Design for ExímIA OS

**Version:** 1.0
**Date:** 26 Janeiro 2026
**For:** ExímIA Ventures Internal Tool
**Purpose:** Define the logical architecture and decision-making engine behind Course Designer

---

## EXECUTIVE SUMMARY

Course Designer is the **LOGIC ENGINE** that transforms raw course ideas into structured, pedagogically-sound course architectures. This is NOT about integrations or products - this is about the **BRAIN** of the system.

**Core Philosophy:** Evidence-based, algorithmic course design using synthesized best practices from 40+ research sources.

**Primary Methodologies:**
- **Backward Design** (structure)
- **Action Mapping** (focus)
- **SAM** (process)
- **ELC+ 2026** (experiential learning)
- **LXD frameworks** (instructional design)

---

## 1. SYSTEM OVERVIEW

### 1.1 What Course Designer Does

```
INPUT:
- Course topic
- Target audience
- Duration/constraints
- Business goals

↓ [PROCESSING ENGINE] ↓

OUTPUT:
- Complete course architecture
- Module breakdown
- Learning objectives
- Assessment strategy
- ELC+ implementation
- Duration allocation
- Quality validation report
```

### 1.2 Core Components

```
┌────────────────────────────────────────────────────────────┐
│                  COURSE DESIGNER ENGINE                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. ANALYZER                                               │
│     ├── Input Parser                                       │
│     ├── Constraint Validator                               │
│     ├── Framework Selector                                 │
│     └── Audience Profiler                                  │
│                                                            │
│  2. ARCHITECT                                              │
│     ├── Objective Generator (Bloom + ABCD)                 │
│     ├── Assessment Designer (Backward Design)              │
│     ├── Module Sequencer (Prerequisites + Spiral)          │
│     └── ELC+ Mapper (6-stage experiential)                 │
│                                                            │
│  3. CALCULATOR                                             │
│     ├── Duration Allocator (attention span logic)          │
│     ├── Cognitive Load Analyzer (Sweller)                  │
│     ├── Chunk Size Optimizer (Miller 7±2)                  │
│     └── Time Distribution (ELC+ percentages)               │
│                                                            │
│  4. VALIDATOR                                              │
│     ├── Alignment Checker (objectives ↔ assessments)       │
│     ├── Bloom Progression Validator                        │
│     ├── Completeness Auditor (Gagne's 9 Events)            │
│     └── Quality Scorecard                                  │
│                                                            │
│  5. GENERATOR                                              │
│     ├── JSON Blueprint Builder                             │
│     ├── Activity Recommender                               │
│     ├── Material Specifications                            │
│     └── Implementation Checklist                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 2. PHASE 1: ANALYZER

### 2.1 Input Parser

**Function:** Extract and structure all input data

**Input Structure:**
```json
{
  "course_title": "Product Management Fundamentals",
  "business_goal": "Reduce time-to-market by improving PM decision-making",
  "target_audience": {
    "role": "Product Managers",
    "experience_level": "junior_to_mid",
    "prior_knowledge": ["basic agile", "basic UX"],
    "size": "15-30 people"
  },
  "constraints": {
    "total_duration_hours": 40,
    "weeks": 12,
    "hours_per_week": 3.5,
    "delivery_mode": "online_async",
    "cohort_based": true
  },
  "preferences": {
    "learning_style": "experiential",
    "assessment_type": "authentic",
    "content_density": "lean"  // vs. "comprehensive"
  }
}
```

**Processing Logic:**

```python
def parse_input(raw_input):
    # Validate required fields
    required = ["course_title", "target_audience", "constraints"]
    for field in required:
        if field not in raw_input:
            raise ValueError(f"Missing required field: {field}")

    # Normalize experience level
    experience_map = {
        "novice": 1,
        "junior": 2,
        "mid": 3,
        "senior": 4,
        "expert": 5
    }

    # Calculate total available time
    total_hours = raw_input["constraints"].get("total_duration_hours")
    if not total_hours:
        weeks = raw_input["constraints"]["weeks"]
        hours_per_week = raw_input["constraints"]["hours_per_week"]
        total_hours = weeks * hours_per_week

    # Extract learning preferences
    preferences = raw_input.get("preferences", {})

    return {
        "parsed_input": raw_input,
        "total_hours": total_hours,
        "experience_numeric": experience_map.get(
            raw_input["target_audience"]["experience_level"].split("_")[0], 2
        ),
        "preferences": preferences
    }
```

---

### 2.2 Framework Selector

**Function:** Algorithmically select best instructional design framework(s)

**Decision Tree:**

```python
def select_framework(parsed_input):
    """
    Returns primary framework + supporting frameworks
    Based on: COURSE_DESIGN_METHODOLOGIES_RESEARCH.md Algorithm 1
    """

    constraints = parsed_input["constraints"]
    preferences = parsed_input["preferences"]

    # Primary framework selection
    if preferences.get("content_density") == "lean":
        primary = "Action_Mapping"
        rationale = "Minimizes content bloat, behavior-focused"

    elif constraints.get("cohort_based") == True:
        primary = "SAM"
        rationale = "Iterative, rapid prototyping, community-driven"

    elif parsed_input["experience_numeric"] >= 3:
        primary = "Merrills_First_Principles"
        rationale = "Problem-centered for experienced learners"

    else:
        primary = "Backward_Design"
        rationale = "Universal alignment framework"

    # Supporting frameworks (always included)
    supporting = [
        "Backward_Design",  # Always use for alignment
        "ELC_Plus_2026",    # ExímIA's experiential methodology
        "Gagnes_9_Events",  # Lesson-level checklist
        "Cognitive_Load_Theory"  # Duration/chunking optimization
    ]

    return {
        "primary_framework": primary,
        "rationale": rationale,
        "supporting_frameworks": supporting,
        "methodology_mix": f"{primary} + ELC+ + Backward Design"
    }
```

**Output Example:**
```json
{
  "primary_framework": "Action_Mapping",
  "rationale": "Minimizes content bloat, behavior-focused",
  "supporting_frameworks": [
    "Backward_Design",
    "ELC_Plus_2026",
    "Gagnes_9_Events",
    "Cognitive_Load_Theory"
  ],
  "methodology_mix": "Action_Mapping + ELC+ + Backward Design"
}
```

---

### 2.3 Audience Profiler

**Function:** Determine learning characteristics and ZPD

**Processing Logic:**

```python
def profile_audience(target_audience):
    """
    Apply Adult Learning Theory (Knowles) + Kolb Learning Styles
    """

    # Adult learning assumptions (all TRUE for professional training)
    adult_learning_profile = {
        "self_directed": True,
        "experience_rich": target_audience["experience_level"] != "novice",
        "problem_oriented": True,
        "intrinsically_motivated": True
    }

    # Infer dominant learning style based on role
    role_to_style = {
        "product_manager": "Divergente",  # Creative, people-oriented
        "engineer": "Convergente",  # Technical problem-solving
        "designer": "Assimilador",  # Abstract conceptualization
        "sales": "Acomodador"  # Action-oriented, hands-on
    }

    role_lower = target_audience["role"].lower()
    dominant_style = "Divergente"  # Default
    for role_key, style in role_to_style.items():
        if role_key in role_lower:
            dominant_style = style
            break

    # Determine ZPD range
    experience = target_audience["experience_level"]
    if experience == "novice":
        zpd = {"can_do_alone": ["remember", "understand"],
               "can_do_with_support": ["apply"]}
    elif "junior" in experience:
        zpd = {"can_do_alone": ["remember", "understand", "apply"],
               "can_do_with_support": ["analyze"]}
    elif "mid" in experience:
        zpd = {"can_do_alone": ["remember", "understand", "apply", "analyze"],
               "can_do_with_support": ["evaluate", "create"]}
    else:  # senior/expert
        zpd = {"can_do_alone": ["all"],
               "can_do_with_support": ["create (novel contexts)"]}

    return {
        "adult_learning_profile": adult_learning_profile,
        "dominant_learning_style": dominant_style,
        "zpd": zpd,
        "scaffolding_needed": experience in ["novice", "junior_to_mid"]
    }
```

---

## 3. PHASE 2: ARCHITECT

### 3.1 Objective Generator

**Function:** Generate SMART learning objectives using ABCD method + Bloom's Taxonomy

**Algorithm:**

```python
def generate_objectives(course_topic, business_goal, total_hours, zpd):
    """
    Generate 4-7 objectives per module (Miller's 7±2)
    Use Bloom's verbs appropriate to ZPD
    """

    # Determine Bloom level based on course duration and ZPD
    if total_hours < 10:
        max_bloom = "Apply"  # Short courses focus on application
    elif total_hours < 40:
        max_bloom = "Analyze"
    else:
        max_bloom = "Create"  # Long courses aim for mastery

    # Bloom verb bank (organized by level)
    bloom_verbs = {
        "Remember": ["define", "list", "recall", "identify"],
        "Understand": ["explain", "describe", "summarize", "interpret"],
        "Apply": ["demonstrate", "execute", "implement", "solve"],
        "Analyze": ["differentiate", "organize", "compare", "deconstruct"],
        "Evaluate": ["justify", "critique", "assess", "defend"],
        "Create": ["design", "construct", "formulate", "develop"]
    }

    # Module estimation (2-4 hours per module)
    num_modules = max(3, min(10, total_hours // 3))

    objectives = []

    for module_idx in range(num_modules):
        # Progressive Bloom levels (spiral curriculum)
        if module_idx < num_modules / 3:
            bloom_level = "Apply"
        elif module_idx < 2 * num_modules / 3:
            bloom_level = "Analyze"
        else:
            bloom_level = max_bloom

        # Generate 1-2 objectives per module
        verb = random.choice(bloom_verbs[bloom_level])

        # ABCD format
        objective = {
            "module": module_idx + 1,
            "objective_id": f"M{module_idx+1}_OBJ1",
            "bloom_level": bloom_level,
            "abcd": {
                "audience": f"Junior to mid-level {course_topic} professionals",
                "behavior": f"{verb.capitalize()} [specific skill related to module topic]",
                "condition": "Given real-world scenarios and tools",
                "degree": "with 80% accuracy" if bloom_level in ["Apply", "Analyze"] else "producing publication-quality deliverable"
            },
            "objective_statement": f"[Audience] will [behavior] [condition], achieving [degree]."
        }

        objectives.append(objective)

    return {
        "total_objectives": len(objectives),
        "objectives_by_module": objectives,
        "bloom_progression": [obj["bloom_level"] for obj in objectives]
    }
```

**Output Example:**
```json
{
  "module": 1,
  "objective_id": "M1_OBJ1",
  "bloom_level": "Apply",
  "abcd": {
    "audience": "Junior to mid-level Product Management professionals",
    "behavior": "Execute discovery interviews using structured frameworks",
    "condition": "Given real-world user scenarios and interview templates",
    "degree": "with 80% coverage of key discovery questions"
  },
  "objective_statement": "Junior to mid-level Product Management professionals will execute discovery interviews using structured frameworks, given real-world user scenarios and interview templates, achieving 80% coverage of key discovery questions."
}
```

---

### 3.2 Assessment Designer (Backward Design)

**Function:** Design assessments FIRST, before instruction (Backward Design principle)

**Algorithm:**

```python
def design_assessments(objectives):
    """
    For each objective, create aligned assessment
    Mix formative (ongoing) + summative (end-of-module)
    """

    assessments = []

    for obj in objectives:
        bloom_level = obj["bloom_level"]

        # Assessment type based on Bloom level
        if bloom_level in ["Remember", "Understand"]:
            assessment_type = "Quiz (multiple choice + short answer)"
        elif bloom_level == "Apply":
            assessment_type = "Practice Exercise (scenario-based)"
        elif bloom_level == "Analyze":
            assessment_type = "Case Study Analysis"
        elif bloom_level == "Evaluate":
            assessment_type = "Peer Review + Rubric"
        else:  # Create
            assessment_type = "Project (deliverable)"

        # Formative vs Summative
        if obj["module"] % 3 == 0:  # Every 3rd module
            timing = "Summative (end of module)"
        else:
            timing = "Formative (during learning)"

        assessment = {
            "objective_id": obj["objective_id"],
            "assessment_type": assessment_type,
            "timing": timing,
            "format": "Individual" if bloom_level in ["Remember", "Understand"] else "Individual or Group",
            "rubric_required": bloom_level in ["Evaluate", "Create"],
            "estimated_duration_min": 15 if timing == "Formative" else 45
        }

        assessments.append(assessment)

    # Add Kirkpatrick Level 1 (always)
    assessments.append({
        "type": "Kirkpatrick_L1_Reaction",
        "timing": "End of course",
        "format": "Survey (satisfaction + NPS)",
        "estimated_duration_min": 5
    })

    return {
        "total_assessments": len(assessments),
        "assessments": assessments,
        "formative_count": len([a for a in assessments if "Formative" in a.get("timing", "")]),
        "summative_count": len([a for a in assessments if "Summative" in a.get("timing", "")])
    }
```

---

### 3.3 Module Sequencer

**Function:** Sequence modules using prerequisite chains + spiral curriculum

**Algorithm:**

```python
def sequence_modules(objectives, total_hours):
    """
    Creates prerequisite dependency graph
    Applies simple→complex sequencing
    Implements spiral curriculum (revisit key concepts)
    """

    num_modules = len(set([obj["module"] for obj in objectives]))
    module_duration = total_hours / num_modules

    modules = []

    for module_num in range(1, num_modules + 1):
        # Get objectives for this module
        module_objectives = [obj for obj in objectives if obj["module"] == module_num]

        # Determine prerequisites
        if module_num == 1:
            prerequisites = []
        elif module_num <= num_modules / 3:
            prerequisites = [1]  # First module only
        else:
            # Requires completion of previous 2 modules
            prerequisites = [module_num - 2, module_num - 1]

        # Spiral curriculum: Key concepts to revisit
        if module_num > num_modules / 2:
            spiral_revisits = ["Core concept from Module 1", "Framework from Module 2"]
        else:
            spiral_revisits = []

        module = {
            "module_number": module_num,
            "title": f"[Module {module_num} Title - TBD]",
            "duration_hours": round(module_duration, 1),
            "objectives": module_objectives,
            "prerequisites": prerequisites,
            "spiral_curriculum_revisits": spiral_revisits,
            "complexity_level": "Low" if module_num <= num_modules/3 else "Medium" if module_num <= 2*num_modules/3 else "High"
        }

        modules.append(module)

    return {
        "total_modules": len(modules),
        "modules": modules,
        "avg_module_duration_hours": module_duration
    }
```

---

### 3.4 ELC+ Mapper (6-Stage Experiential)

**Function:** Map each module to ELC+ 2026 6-stage cycle

**ELC+ Time Distribution (from research):**
- IMMERSE: 18%
- REFLECT: 12%
- CONCEPTUALIZE: 18%
- EXPERIMENT: 18%
- CALIBRATE: 12%
- INTEGRATE: 22%

**Algorithm:**

```python
def map_elc_plus(module):
    """
    For each module, break into 6 ELC+ stages with time allocation
    """

    module_duration_min = module["duration_hours"] * 60

    elc_stages = {
        "IMMERSE": {
            "percentage": 18,
            "duration_min": round(module_duration_min * 0.18),
            "purpose": "Concrete Experience - Learners encounter real-world scenario",
            "activities": [
                "Case study immersion",
                "Role-play scenario",
                "Watch real-world example video",
                "Simulation or VR experience"
            ],
            "bloom_level": "Remember/Understand",
            "question": "What am I experiencing? What do I notice?"
        },
        "REFLECT": {
            "percentage": 12,
            "duration_min": round(module_duration_min * 0.12),
            "purpose": "Reflective Observation - Process the experience",
            "activities": [
                "Journaling prompts",
                "Peer discussion (async forum or sync breakout)",
                "Debrief with facilitator questions",
                "Self-assessment questionnaire"
            ],
            "bloom_level": "Understand",
            "question": "What worked? What didn't? Why did that happen?"
        },
        "CONCEPTUALIZE": {
            "percentage": 18,
            "duration_min": round(module_duration_min * 0.18),
            "purpose": "Abstract Conceptualization - Connect to theory/frameworks",
            "activities": [
                "Framework presentation (video/reading)",
                "Model mapping exercise",
                "Theory lecture with examples",
                "Compare experience to established principles"
            ],
            "bloom_level": "Understand/Analyze",
            "question": "What theory explains this? What's the underlying principle?"
        },
        "EXPERIMENT": {
            "percentage": 18,
            "duration_min": round(module_duration_min * 0.18),
            "purpose": "Active Experimentation - Apply in practice",
            "activities": [
                "Hands-on project",
                "A/B testing exercise",
                "Build prototype or deliverable",
                "Practice with real tools"
            ],
            "bloom_level": "Apply",
            "question": "How can I use this? What happens if I try X?"
        },
        "CALIBRATE": {
            "percentage": 12,
            "duration_min": round(module_duration_min * 0.12),
            "purpose": "Validation & Feedback - Adjust and refine",
            "activities": [
                "Peer review",
                "Expert feedback session",
                "Gap analysis (expected vs actual)",
                "Iteration planning"
            ],
            "bloom_level": "Evaluate",
            "question": "How well did I do? What needs improvement?"
        },
        "INTEGRATE": {
            "percentage": 22,
            "duration_min": round(module_duration_min * 0.22),
            "purpose": "Consolidation via Teaching - Deepest learning",
            "activities": [
                "Teach concept to peer",
                "Create explainer video or tutorial",
                "Write blog post or documentation",
                "Present findings to cohort"
            ],
            "bloom_level": "Create",
            "question": "How do I explain this to others? What's my synthesis?"
        }
    }

    # Validate percentages sum to 100
    total_percentage = sum([stage["percentage"] for stage in elc_stages.values()])
    assert total_percentage == 100, f"ELC+ percentages must sum to 100, got {total_percentage}"

    return {
        "module_number": module["module_number"],
        "elc_plus_structure": elc_stages,
        "total_duration_min": module_duration_min,
        "retention_estimate": "70-85% (evidence-based for experiential learning)"
    }
```

**Output Example:**
```json
{
  "IMMERSE": {
    "percentage": 18,
    "duration_min": 43,
    "purpose": "Concrete Experience - Learners encounter real-world scenario",
    "activities": ["Case study immersion", "Role-play scenario"],
    "bloom_level": "Remember/Understand",
    "question": "What am I experiencing?"
  }
}
```

---

## 4. PHASE 3: CALCULATOR

### 4.1 Duration Allocator

**Function:** Calculate optimal durations based on attention span research

**Research-Based Rules:**
- **Attention span:** 10-18 minutes (consensus: 15 min)
- **Video optimal:** 5-15 minutes
- **Lesson optimal:** 20-30 minutes
- **Module optimal:** 2-4 hours (completable in 1-2 sittings)

**Algorithm:**

```python
def calculate_durations(total_hours, num_modules):
    """
    Allocate time across hierarchy: Course > Module > Lesson > Activity
    """

    # Module level
    hours_per_module = total_hours / num_modules

    # Lesson level (3-5 lessons per module)
    if hours_per_module <= 2:
        lessons_per_module = 3
    elif hours_per_module <= 3:
        lessons_per_module = 4
    else:
        lessons_per_module = 5

    hours_per_lesson = hours_per_module / lessons_per_module
    minutes_per_lesson = hours_per_lesson * 60

    # Activity level (3-4 activities per lesson)
    activities_per_lesson = 3
    minutes_per_activity = minutes_per_lesson / activities_per_lesson

    # Validation: Ensure lesson duration is optimal (20-30 min)
    if minutes_per_lesson < 20:
        # Too short - combine lessons
        lessons_per_module -= 1
        minutes_per_lesson = (hours_per_module * 60) / lessons_per_module

    if minutes_per_lesson > 40:
        # Too long - split lessons
        lessons_per_module += 1
        minutes_per_lesson = (hours_per_module * 60) / lessons_per_module

    return {
        "course_total_hours": total_hours,
        "modules": {
            "count": num_modules,
            "hours_each": round(hours_per_module, 1)
        },
        "lessons": {
            "per_module": lessons_per_module,
            "duration_minutes": round(minutes_per_lesson),
            "validation": "OPTIMAL" if 20 <= minutes_per_lesson <= 30 else "NEEDS_ADJUSTMENT"
        },
        "activities": {
            "per_lesson": activities_per_lesson,
            "duration_minutes": round(minutes_per_activity)
        }
    }
```

---

### 4.2 Cognitive Load Analyzer

**Function:** Assess cognitive load using Sweller's CLT principles

**Algorithm:**

```python
def analyze_cognitive_load(lesson_content):
    """
    Calculate intrinsic + extraneous load
    Recommend adjustments to stay within working memory limits (4-7 chunks)
    """

    intrinsic_load = 0
    extraneous_load = 0

    # Intrinsic load (content complexity)
    if lesson_content["concepts_count"] > 5:
        intrinsic_load = lesson_content["concepts_count"]
    else:
        intrinsic_load = 3  # Default moderate

    # Extraneous load (design issues)
    design_factors = {
        "split_attention": 2,  # Text separate from diagram
        "redundancy": 1,  # Same info presented multiple ways unnecessarily
        "unnecessary_graphics": 1,
        "poor_structure": 2
    }

    for factor, load in design_factors.items():
        if lesson_content.get(factor, False):
            extraneous_load += load

    total_load = intrinsic_load + extraneous_load

    # Recommendations
    if total_load > 7:
        status = "HIGH_LOAD"
        recommendations = [
            "Break into 2 lessons (reduce concepts)",
            "Remove extraneous elements",
            "Use worked examples to reduce intrinsic load for novices",
            "Chunk information into 4-5 groups"
        ]
    elif total_load > 5:
        status = "MODERATE_LOAD"
        recommendations = [
            "Provide scaffolding for complex concepts",
            "Integrate text and visuals (avoid split-attention)",
            "Consider prerequisite review"
        ]
    else:
        status = "OPTIMAL_LOAD"
        recommendations = ["Load is within working memory capacity"]

    return {
        "intrinsic_load": intrinsic_load,
        "extraneous_load": extraneous_load,
        "total_load": total_load,
        "status": status,
        "recommendations": recommendations
    }
```

---

### 4.3 Chunk Size Optimizer

**Function:** Apply Miller's 7±2 (updated: 4 chunks) principle

**Algorithm:**

```python
def optimize_chunks(content_items):
    """
    Group content into optimal chunk sizes
    Modern research: 4 chunks for young adults
    """

    OPTIMAL_CHUNKS = 4
    MAX_CHUNKS = 7

    num_items = len(content_items)

    if num_items <= OPTIMAL_CHUNKS:
        return {
            "status": "OPTIMAL",
            "chunks": [content_items],
            "recommendation": "No chunking needed"
        }

    elif num_items <= MAX_CHUNKS:
        # Group into sub-categories
        chunk_size = 2
        chunks = [content_items[i:i+chunk_size] for i in range(0, num_items, chunk_size)]
        return {
            "status": "ACCEPTABLE",
            "chunks": chunks,
            "recommendation": f"Grouped {num_items} items into {len(chunks)} chunks of ~{chunk_size}"
        }

    else:
        # Too many - requires hierarchical organization
        chunk_size = max(2, num_items // OPTIMAL_CHUNKS)
        chunks = [content_items[i:i+chunk_size] for i in range(0, num_items, chunk_size)]
        return {
            "status": "REQUIRES_HIERARCHY",
            "chunks": chunks,
            "recommendation": f"Too many items ({num_items}). Create hierarchical structure with {len(chunks)} main categories."
        }
```

---

## 5. PHASE 4: VALIDATOR

### 5.1 Alignment Checker

**Function:** Ensure every objective has assessment, every assessment tests objective

**Algorithm:**

```python
def validate_alignment(objectives, assessments):
    """
    1:1 mapping validation
    Flag misalignments
    """

    objective_ids = [obj["objective_id"] for obj in objectives]
    assessed_objectives = [assess["objective_id"] for assess in assessments if "objective_id" in assess]

    # Check coverage
    not_assessed = set(objective_ids) - set(assessed_objectives)
    not_mapped = set(assessed_objectives) - set(objective_ids)

    alignment_score = 100
    issues = []

    if not_assessed:
        alignment_score -= 10 * len(not_assessed)
        issues.append({
            "type": "OBJECTIVES_NOT_ASSESSED",
            "count": len(not_assessed),
            "details": list(not_assessed)
        })

    if not_mapped:
        issues.append({
            "type": "ASSESSMENTS_WITHOUT_OBJECTIVES",
            "count": len(not_mapped),
            "details": list(not_mapped)
        })

    if alignment_score == 100:
        status = "FULL_ALIGNMENT"
    elif alignment_score >= 70:
        status = "PARTIAL_ALIGNMENT"
    else:
        status = "CRITICAL_MISALIGNMENT"

    return {
        "alignment_score": max(0, alignment_score),
        "status": status,
        "issues": issues,
        "coverage_rate": f"{len(assessed_objectives)}/{len(objective_ids)}"
    }
```

---

### 5.2 Bloom Progression Validator

**Function:** Ensure logical progression of Bloom levels (spiral curriculum)

**Algorithm:**

```python
def validate_bloom_progression(objectives):
    """
    Check for:
    1. Progressive complexity (no sudden drops)
    2. Early modules = lower Bloom (Apply)
    3. Later modules = higher Bloom (Evaluate/Create)
    """

    bloom_hierarchy = {
        "Remember": 1,
        "Understand": 2,
        "Apply": 3,
        "Analyze": 4,
        "Evaluate": 5,
        "Create": 6
    }

    progression = [bloom_hierarchy[obj["bloom_level"]] for obj in objectives]

    issues = []

    for i in range(1, len(progression)):
        current_level = progression[i]
        previous_level = progression[i-1]

        # Check for level drops > 1 (e.g., Create → Understand)
        if current_level < previous_level - 1:
            issues.append({
                "type": "BLOOM_LEVEL_DROP",
                "module": objectives[i]["module"],
                "from": objectives[i-1]["bloom_level"],
                "to": objectives[i]["bloom_level"],
                "recommendation": "Avoid sudden complexity drops. Maintain spiral progression."
            })

    # Check early modules aren't too advanced
    first_third = len(objectives) // 3
    early_modules = progression[:first_third]
    if any(level > 4 for level in early_modules):
        issues.append({
            "type": "EARLY_COMPLEXITY_TOO_HIGH",
            "recommendation": "First third of course should focus on Apply or below. Save Evaluate/Create for later."
        })

    status = "VALID_PROGRESSION" if len(issues) == 0 else "NEEDS_ADJUSTMENT"

    return {
        "status": status,
        "progression": [objectives[i]["bloom_level"] for i in range(len(objectives))],
        "issues": issues
    }
```

---

### 5.3 Completeness Auditor (Gagne's 9 Events)

**Function:** Verify each lesson includes all 9 events of instruction

**Checklist:**

```python
def audit_completeness(lesson):
    """
    Validate against Gagne's 9 Events checklist
    """

    gagnes_9_events = [
        "Gain Attention",
        "Inform Objective",
        "Stimulate Recall",
        "Present Stimulus",
        "Provide Guidance",
        "Elicit Performance",
        "Provide Feedback",
        "Assess Performance",
        "Enhance Retention"
    ]

    lesson_components = lesson.get("activities", [])

    checklist = {}
    for event in gagnes_9_events:
        # Check if lesson has activity mapped to this event
        has_event = any(activity.get("gagne_event") == event for activity in lesson_components)
        checklist[event] = "✓" if has_event else "✗"

    completeness_score = (sum(1 for v in checklist.values() if v == "✓") / 9) * 100

    missing_events = [event for event, status in checklist.items() if status == "✗"]

    return {
        "completeness_score": round(completeness_score, 1),
        "checklist": checklist,
        "missing_events": missing_events,
        "status": "COMPLETE" if completeness_score == 100 else "INCOMPLETE"
    }
```

---

### 5.4 Quality Scorecard

**Function:** Aggregate all validation metrics into overall quality score

**Algorithm:**

```python
def generate_quality_scorecard(course_blueprint):
    """
    Multi-dimensional quality assessment
    """

    scores = {}

    # 1. Alignment (objectives ↔ assessments)
    alignment_result = validate_alignment(
        course_blueprint["objectives"],
        course_blueprint["assessments"]
    )
    scores["alignment"] = alignment_result["alignment_score"]

    # 2. Bloom Progression
    bloom_result = validate_bloom_progression(course_blueprint["objectives"])
    scores["bloom_progression"] = 100 if bloom_result["status"] == "VALID_PROGRESSION" else 70

    # 3. ELC+ Completeness (all 6 stages present?)
    elc_complete = all(
        all(stage in module["elc_plus_structure"] for stage in [
            "IMMERSE", "REFLECT", "CONCEPTUALIZE", "EXPERIMENT", "CALIBRATE", "INTEGRATE"
        ])
        for module in course_blueprint["modules"]
    )
    scores["elc_plus_completeness"] = 100 if elc_complete else 60

    # 4. Duration Optimization
    duration_result = calculate_durations(
        course_blueprint["total_hours"],
        len(course_blueprint["modules"])
    )
    scores["duration_optimization"] = 100 if duration_result["lessons"]["validation"] == "OPTIMAL" else 80

    # 5. Cognitive Load Management
    avg_load = sum(
        analyze_cognitive_load(lesson)["total_load"]
        for lesson in course_blueprint.get("lessons", [{"concepts_count": 5}])
    ) / max(1, len(course_blueprint.get("lessons", [1])))
    scores["cognitive_load"] = 100 if avg_load <= 7 else 70 if avg_load <= 9 else 50

    # Overall score (weighted average)
    weights = {
        "alignment": 0.30,
        "bloom_progression": 0.20,
        "elc_plus_completeness": 0.25,
        "duration_optimization": 0.15,
        "cognitive_load": 0.10
    }

    overall_score = sum(scores[key] * weights[key] for key in scores.keys())

    # Quality rating
    if overall_score >= 90:
        rating = "EXCELLENT"
    elif overall_score >= 80:
        rating = "GOOD"
    elif overall_score >= 70:
        rating = "ACCEPTABLE"
    else:
        rating = "NEEDS_IMPROVEMENT"

    return {
        "overall_score": round(overall_score, 1),
        "rating": rating,
        "dimension_scores": scores,
        "weights": weights,
        "recommendations": generate_recommendations(scores)
    }

def generate_recommendations(scores):
    recommendations = []

    if scores["alignment"] < 90:
        recommendations.append("Improve objective-assessment alignment")
    if scores["bloom_progression"] < 90:
        recommendations.append("Review Bloom level sequencing")
    if scores["elc_plus_completeness"] < 90:
        recommendations.append("Ensure all 6 ELC+ stages are present")
    if scores["duration_optimization"] < 90:
        recommendations.append("Adjust lesson durations to 20-30 minute optimal range")
    if scores["cognitive_load"] < 90:
        recommendations.append("Reduce cognitive load through chunking or scaffolding")

    if len(recommendations) == 0:
        recommendations.append("Course meets all quality standards!")

    return recommendations
```

---

## 6. PHASE 5: GENERATOR

### 6.1 JSON Blueprint Builder

**Function:** Compile all outputs into structured JSON blueprint

**Output Schema:**

```json
{
  "course_metadata": {
    "title": "Product Management Fundamentals",
    "version": "1.0",
    "generated_by": "Course_Designer_Engine",
    "generated_at": "2026-01-26T15:30:00Z",
    "total_duration_hours": 40,
    "estimated_retention_rate": "70-85%"
  },

  "framework_mix": {
    "primary": "Action_Mapping",
    "supporting": ["Backward_Design", "ELC_Plus_2026", "Gagnes_9_Events"],
    "rationale": "Lean content, behavior-focused, experiential learning"
  },

  "audience_profile": {
    "role": "Product Managers",
    "experience": "junior_to_mid",
    "learning_style": "Divergente",
    "zpd": {"can_do_alone": ["remember", "understand", "apply"],
            "can_do_with_support": ["analyze"]},
    "scaffolding_needed": true
  },

  "course_architecture": {
    "modules": [
      {
        "module_number": 1,
        "title": "Discovery & Validation",
        "duration_hours": 4,
        "objectives": [...],
        "assessments": [...],
        "elc_plus_structure": {
          "IMMERSE": {...},
          "REFLECT": {...},
          "CONCEPTUALIZE": {...},
          "EXPERIMENT": {...},
          "CALIBRATE": {...},
          "INTEGRATE": {...}
        },
        "lessons": [
          {
            "lesson_number": 1,
            "title": "Customer Discovery Fundamentals",
            "duration_minutes": 25,
            "gagnes_9_events": {
              "gain_attention": "Video: Failed product launch story",
              "inform_objective": "Text: By end of this lesson, you'll...",
              "stimulate_recall": "Quiz: What do you already know about discovery?",
              "present_stimulus": "Video + Reading: Discovery frameworks",
              "provide_guidance": "Worked example: Discovery interview walkthrough",
              "elicit_performance": "Practice: Write 10 discovery questions",
              "provide_feedback": "Automated review + tips",
              "assess_performance": "Submit questions for peer review",
              "enhance_retention": "Spaced review scheduled 3 days later"
            },
            "activities": [...]
          }
        ]
      }
    ]
  },

  "evaluation_plan": {
    "kirkpatrick_L1": "Post-course satisfaction survey (5 min)",
    "kirkpatrick_L2": "Assessment scores across all summative tests",
    "kirkpatrick_L3": "30-day follow-up: Are PMs using discovery frameworks?",
    "kirkpatrick_L4": "90-day: Time-to-market reduction (business goal)"
  },

  "quality_scorecard": {
    "overall_score": 92.5,
    "rating": "EXCELLENT",
    "dimension_scores": {
      "alignment": 100,
      "bloom_progression": 100,
      "elc_plus_completeness": 100,
      "duration_optimization": 90,
      "cognitive_load": 85
    }
  }
}
```

---

### 6.2 Activity Recommender

**Function:** Suggest specific activities for each ELC+ stage and Bloom level

**Activity Bank (Sampling):**

```python
ACTIVITY_BANK = {
    "IMMERSE": {
        "video": ["Case study video", "Real-world example", "Expert interview"],
        "interactive": ["VR simulation", "Role-play", "Scenario walkthrough"],
        "reading": ["Rich narrative case", "First-person story"]
    },
    "REFLECT": {
        "individual": ["Journaling prompts", "Self-assessment quiz", "Reflection worksheet"],
        "social": ["Async forum discussion", "Peer Q&A", "Debrief session"]
    },
    "CONCEPTUALIZE": {
        "passive": ["Video lecture", "Reading: Theory article", "Framework diagram"],
        "active": ["Concept mapping", "Compare/contrast", "Theory-to-practice mapping"]
    },
    "EXPERIMENT": {
        "hands_on": ["Build prototype", "Execute process", "Use tool"],
        "project": ["Mini-project", "Real-world application", "A/B test"]
    },
    "CALIBRATE": {
        "feedback": ["Peer review", "Expert review", "Automated assessment"],
        "analysis": ["Gap analysis worksheet", "Performance comparison", "Iteration planning"]
    },
    "INTEGRATE": {
        "teaching": ["Teach-back to peer", "Create tutorial", "Write explainer"],
        "synthesis": ["Blog post", "Case study write-up", "Presentation to cohort"]
    }
}

def recommend_activities(stage, bloom_level, duration_min):
    """
    Return 2-3 activities appropriate for stage, Bloom level, and duration
    """

    stage_activities = ACTIVITY_BANK.get(stage, {})

    # Select based on duration
    if duration_min < 15:
        # Short: 1-2 quick activities
        recommended = random.sample(list(stage_activities.values())[0], 1)
    elif duration_min < 30:
        # Medium: 2-3 activities
        recommended = random.sample(list(stage_activities.values())[0], 2)
    else:
        # Long: 3-4 activities (mix types)
        recommended = []
        for activity_type in stage_activities.values():
            recommended.append(random.choice(activity_type))

    return {
        "stage": stage,
        "duration_min": duration_min,
        "recommended_activities": recommended
    }
```

---

## 7. DECISION FLOW SUMMARY

**Complete Processing Pipeline:**

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT RECEIVED                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: ANALYZER                                          │
│  ├── Parse Input                                            │
│  ├── Select Framework (Decision Tree)                       │
│  ├── Profile Audience (Adult Learning + Kolb)               │
│  └── Calculate Constraints                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: ARCHITECT                                         │
│  ├── Generate Objectives (ABCD + Bloom)                     │
│  ├── Design Assessments FIRST (Backward Design)             │
│  ├── Sequence Modules (Prerequisites + Spiral)              │
│  └── Map ELC+ Structure (6 stages per module)               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: CALCULATOR                                        │
│  ├── Allocate Durations (Attention span logic)              │
│  ├── Analyze Cognitive Load (Sweller CLT)                   │
│  ├── Optimize Chunks (Miller 7±2)                           │
│  └── Distribute Time (ELC+ percentages)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: VALIDATOR                                         │
│  ├── Check Alignment (Objectives ↔ Assessments)             │
│  ├── Validate Bloom Progression                             │
│  ├── Audit Completeness (Gagne's 9 Events)                  │
│  └── Generate Quality Scorecard (0-100)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: GENERATOR                                         │
│  ├── Build JSON Blueprint                                   │
│  ├── Recommend Activities (per stage)                       │
│  ├── Specify Materials                                      │
│  └── Create Implementation Checklist                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              COMPLETE COURSE ARCHITECTURE                    │
│                  (JSON BLUEPRINT)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. KEY ALGORITHMS SUMMARY

### Algorithm Index

1. **Framework Selector** - Decision tree for choosing instructional design approach
2. **Objective Generator** - ABCD + Bloom-based objective creation
3. **Assessment Designer** - Backward Design alignment (assess before instruct)
4. **Module Sequencer** - Prerequisite chains + spiral curriculum
5. **ELC+ Mapper** - 6-stage experiential breakdown with time %
6. **Duration Allocator** - Attention span-based time distribution
7. **Cognitive Load Analyzer** - CLT-based complexity assessment
8. **Chunk Optimizer** - Miller's 7±2 application
9. **Alignment Validator** - 1:1 objective-assessment mapping check
10. **Bloom Progression Validator** - Spiral curriculum logic check
11. **Completeness Auditor** - Gagne's 9 Events checklist
12. **Quality Scorecard** - Weighted multi-dimensional quality score

---

## 9. IMPLEMENTATION NOTES

### Technology Stack (Recommendation)

**Backend Logic:**
- **Python** - All algorithms, decision trees, processors
- **Pydantic** - Input/output schema validation
- **NetworkX** - Prerequisite dependency graphs

**Data Storage:**
- **JSON** - Course blueprints
- **YAML** - Configuration files (activity banks, Bloom verbs)

**Processing Engine:**
- **Synchronous** - Single course design is fast (<5 sec)
- **Stateless** - Each course design is independent

### Integration Points (ExímIA OS)

```
Course_Designer (standalone engine)
    ↓ (outputs JSON blueprint)
exímIA OS UI
    ├── Form: Input course parameters
    ├── Display: Generated architecture
    ├── Edit: Manual adjustments
    └── Export: PDF/DOCX/JSON
```

---

## 10. VALIDATION & QUALITY GATES

### Quality Thresholds

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| **Alignment Score** | 70 | 90 | 100 |
| **Bloom Progression** | Valid | Valid | Optimal Spiral |
| **ELC+ Completeness** | All 6 stages | All 6 + balanced % | Perfect time distribution |
| **Cognitive Load** | ≤9 | ≤7 | ≤5 |
| **Overall Quality** | 70 | 85 | 90+ |

### Automatic Flagging

Course Designer automatically flags:
- ❌ Objectives without assessments
- ❌ Bloom level drops >1
- ❌ Cognitive load >9
- ❌ Lesson durations >40 min or <15 min
- ❌ Missing ELC+ stages

---

## 11. NEXT STEPS: FROM LOGIC TO CODE

### Phase 1: Core Engine (Week 1)
1. Implement Analyzer module
2. Implement Architect module
3. Unit tests for algorithms

### Phase 2: Validation & Scoring (Week 2)
1. Implement Validator module
2. Implement Calculator module
3. Integration tests

### Phase 3: Generator & UI (Week 3)
1. Implement Generator module
2. Build ExímIA OS interface
3. End-to-end testing

### Phase 4: Activity Bank & Polish (Week 4)
1. Populate activity recommendation bank
2. Refine quality scorecard weights
3. User acceptance testing

---

## CONCLUSION

Course Designer is a **LOGICAL ENGINE** - not a product integration. It applies evidence-based instructional design principles through **algorithmic decision-making**.

**Core Capabilities:**
1. ✅ Parse inputs and select optimal frameworks
2. ✅ Generate aligned objectives and assessments
3. ✅ Structure modules using ELC+ 6-stage experiential learning
4. ✅ Optimize durations based on cognitive science
5. ✅ Validate quality across multiple dimensions
6. ✅ Output structured JSON blueprints

**Philosophical Foundation:**
- **Backward Design:** Start with outcomes
- **Action Mapping:** Minimize content bloat
- **ELC+ 2026:** Experiential learning with 70-85% retention
- **Evidence-Based:** Every decision backed by research

**For ExímIA OS:**
This is an **internal tool** for ExímIA entrepreneurs to design courses rapidly and correctly. It codifies expertise so anyone can create high-quality learning experiences.

---

**Document Prepared By:** Claude (eximIA.OS Runtime Engine)
**Research Foundation:** COURSE_DESIGN_METHODOLOGIES_RESEARCH.md (4,500 words, 40+ sources)
**Status:** Ready for Implementation

---

*Course Designer Logic Architecture v1.0*
*ExímIA OS — Where AI Agents Come to Life*
