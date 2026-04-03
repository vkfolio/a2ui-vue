"""
Index-based example retrieval for the A2UI widget designer.

Reads categorized markdown files from examples/ and selects the most
relevant ones based on keyword matching against the user's description.
"""

import json
import re
from pathlib import Path

EXAMPLES_DIR = Path(__file__).parent / "examples"

# Category files and their tags (mirrors index.md)
CATEGORIES = {
    "display.md": "weather flight stats dashboard data info status counter metric kpi crypto portfolio analytics",
    "forms.md": "login signup input form settings profile edit password email field checkbox picker slider register",
    "media.md": "image video audio photo gallery player music podcast media thumbnail",
    "commerce.md": "product cart payment pricing balance wallet account shop price buy order app store",
    "social.md": "profile user notification testimonial review avatar follow social comment feed",
    "productivity.md": "task todo email event calendar list checklist workout recipe compose schedule invite",
}


def _extract_json_blocks(md_text: str) -> list[dict]:
    """Extract all JSON code blocks from a markdown file, with their heading."""
    results = []
    # Split by ## headings
    sections = re.split(r'^## (.+)$', md_text, flags=re.MULTILINE)
    # sections[0] is preamble, then alternating: heading, content
    for i in range(1, len(sections), 2):
        heading = sections[i].strip()
        content = sections[i + 1] if i + 1 < len(sections) else ""
        for match in re.finditer(r'```json\s*\n([\s\S]*?)\n```', content):
            try:
                parsed = json.loads(match.group(1))
                results.append({"name": heading, "messages": parsed})
            except json.JSONDecodeError:
                continue
    return results


def _score_category(description: str, tags: str) -> int:
    """Count how many tag words appear in the description."""
    desc_lower = description.lower()
    return sum(1 for tag in tags.split() if tag in desc_lower)


def get_relevant_examples(description: str, max_examples: int = 3) -> list[dict]:
    """Select the most relevant examples based on the user's description."""
    # Score each category
    scored = []
    for filename, tags in CATEGORIES.items():
        score = _score_category(description, tags)
        if score > 0:
            scored.append((score, filename))

    # Sort by relevance, take top categories
    scored.sort(reverse=True)

    # Always include at least one category as fallback
    if not scored:
        scored = [(0, "display.md"), (0, "forms.md")]

    examples = []
    for _, filename in scored:
        filepath = EXAMPLES_DIR / filename
        if filepath.exists():
            md_text = filepath.read_text(encoding="utf-8")
            examples.extend(_extract_json_blocks(md_text))
        if len(examples) >= max_examples:
            break

    return examples[:max_examples]


def format_examples_for_prompt(description: str = "") -> str:
    """Format relevant gallery examples as few-shot prompt text."""
    examples = get_relevant_examples(description, max_examples=3) if description else _get_default_examples()

    lines = ["## Reference Examples (proven working JSON — follow these patterns)\n"]
    for ex in examples:
        lines.append(f"### {ex['name']}\n```json")
        lines.append(json.dumps(ex["messages"], indent=2))
        lines.append("```\n")
    return "\n".join(lines)


def _get_default_examples() -> list[dict]:
    """Return a small diverse default set."""
    defaults = []
    for filename in ["display.md", "forms.md", "commerce.md"]:
        filepath = EXAMPLES_DIR / filename
        if filepath.exists():
            blocks = _extract_json_blocks(filepath.read_text(encoding="utf-8"))
            if blocks:
                defaults.append(blocks[0])
    return defaults
