"""
Memo Integration Test
Quick test to verify dual storage is working
"""

from eximia_runtime.utils.memo_integration import memo

# Test 1: Save an idea (request approval first)
result = memo.save_idea(
    title="LLMs hallucinate when context is insufficient",
    content="Large language models tend to generate plausible but incorrect information when they lack sufficient context or knowledge about a topic.",
    idea_type="atom",
    tags=["LLMs", "hallucinations", "context"],
    connections=[],
    request_approval=True  # Returns data for approval instead of saving
)

print("Test 1: Save Idea (Approval Mode)")
print(f"Status: {result['status']}")
print(f"Title: {result['data']['title']}")
print(f"Tags: {result['data']['tags']}")
print()

# Test 2: Actually save (simulate approval)
if input("Approve save? (y/n): ").lower() == 'y':
    result = memo.save_idea(
        title="LLMs hallucinate when context is insufficient",
        content="Large language models tend to generate plausible but incorrect information when they lack sufficient context or knowledge about a topic.",
        idea_type="atom",
        tags=["LLMs", "hallucinations", "context"],
        connections=[],
        request_approval=False  # Actually save
    )
    print(f"✅ Saved! ID: {result['id']}, File: {result['file']}")
    print()

# Test 3: List ideas
print("Test 3: List Ideas")
ideas = memo.list_ideas(page=1, page_size=25)
print(f"Total ideas: {ideas['total']}")
print(f"Page {ideas['page']} of {ideas['total_pages']}")
for idea in ideas['ideas'][:5]:  # Show first 5
    print(f"  [{idea['id']}] {idea['title']} ({idea['type']})")
print()

# Test 4: Search similar
print("Test 4: Search Similar")
similar = memo.search_similar("hallucination", top_k=3)
for idea in similar:
    print(f"  [{idea['id']}] {idea['title']} (score: {idea['similarity']})")
