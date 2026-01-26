"""Clone Advisory System - Automated Expert Council for Idea Critique

This module provides an automated system to select the 3 most relevant clones
and execute a consultative session where they critique and improve user ideas.

Architecture:
    - CloneSelector: Matches user query to clone domains via keyword scoring
    - AdvisoryOrchestrator: Runs parallel clone executions and aggregates feedback
    - FeedbackAggregator: Structures feedback by theme (strengths, weaknesses, suggestions)

Usage:
    >>> from eximia_runtime.modules.clone_advisory import AdvisoryOrchestrator
    >>> orchestrator = AdvisoryOrchestrator()
    >>> result = orchestrator.run_advisory_session(
    ...     idea="Quero criar um sistema de hábitos atômicos",
    ...     domain_hint="productivity"
    ... )
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import yaml
import re
from collections import defaultdict

from eximia_runtime.core.config import settings


@dataclass
class CloneMatch:
    """Represents a clone matched to a query with relevance score"""
    clone_id: str
    name: str
    primary_domain: str
    secondary_domains: List[str]
    relevance_score: float
    match_reasons: List[str] = field(default_factory=list)


@dataclass
class CloneFeedback:
    """Structured feedback from a single clone"""
    clone_id: str
    clone_name: str
    strengths: List[str]
    weaknesses: List[str]
    risks: List[str]
    suggestions: List[str]
    overall_assessment: str
    raw_response: str


@dataclass
class AdvisoryReport:
    """Aggregated report from advisory session"""
    idea: str
    selected_clones: List[CloneMatch]
    individual_feedback: List[CloneFeedback]
    executive_summary: str
    consensus_points: List[str]
    divergent_views: List[str]
    priority_recommendations: List[str]


class CloneSelector:
    """Selects the most relevant clones for a given query using keyword matching"""
    
    def __init__(self):
        self.registry_path = settings.root_dir / "Clone_Factory" / "registry.yaml"
        self._load_registry()
    
    def _load_registry(self) -> None:
        """Load clone registry from YAML"""
        if not self.registry_path.exists():
            raise FileNotFoundError(f"Clone registry not found at {self.registry_path}")
        
        with open(self.registry_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        self.clones = data.get('clones', [])
        if not self.clones:
            raise ValueError("No clones found in registry")
    
    def select_top_clones(
        self, 
        query: str, 
        num: int = 3,
        domain_hint: Optional[str] = None
    ) -> List[CloneMatch]:
        """Select top N most relevant clones for the query
        
        Args:
            query: User's idea or question
            num: Number of clones to select (default: 3)
            domain_hint: Optional domain hint to boost relevance
        
        Returns:
            List of CloneMatch objects sorted by relevance score
        """
        query_lower = query.lower()
        domain_hint_lower = domain_hint.lower() if domain_hint else None
        
        matches = []
        for clone in self.clones:
            # Skip clones that aren't validated or ready
            if clone.get('status') not in ['validated', 'ready_for_validation']:
                continue
            
            score, reasons = self._calculate_relevance(
                clone, 
                query_lower, 
                domain_hint_lower
            )
            
            match = CloneMatch(
                clone_id=clone['clone_id'],
                name=clone['nome'],
                primary_domain=clone['domain']['primary'],
                secondary_domains=clone['domain'].get('secondary', []),
                relevance_score=score,
                match_reasons=reasons
            )
            matches.append(match)
        
        # Sort by relevance score (descending)
        matches.sort(key=lambda x: x.relevance_score, reverse=True)
        
        # Return top N
        return matches[:num]
    
    def _calculate_relevance(
        self, 
        clone: Dict, 
        query: str,
        domain_hint: Optional[str]
    ) -> Tuple[float, List[str]]:
        """Calculate relevance score between clone and query
        
        Scoring:
            - Primary domain exact match: +50 points
            - Primary domain keyword match: +30 points
            - Secondary domain match: +20 points per match
            - Tag match: +10 points per tag
            - Domain hint match: +40 points
        
        Returns:
            (score, list of match reasons)
        """
        score = 0.0
        reasons = []
        
        primary = clone['domain']['primary'].lower()
        secondary = [s.lower() for s in clone['domain'].get('secondary', [])]
        tags = [t.lower() for t in clone.get('tags', [])]
        
        # Check domain hint first (strongest signal)
        if domain_hint:
            if domain_hint in primary:
                score += 40
                reasons.append(f"Domain hint matches primary: {primary}")
            elif any(domain_hint in s for s in secondary):
                score += 30
                reasons.append(f"Domain hint matches secondary domains")
        
        # Primary domain matching
        if primary in query:
            score += 50
            reasons.append(f"Primary domain '{primary}' found in query")
        else:
            # Check for keyword overlap
            primary_keywords = primary.split('_')
            matches = [kw for kw in primary_keywords if kw in query and len(kw) > 3]
            if matches:
                score += 30
                reasons.append(f"Primary domain keywords matched: {', '.join(matches)}")
        
        # Secondary domains
        for domain in secondary:
            if domain in query:
                score += 20
                reasons.append(f"Secondary domain '{domain}' found in query")
        
        # Tags
        for tag in tags:
            if tag in query:
                score += 10
                reasons.append(f"Tag '{tag}' matched")
        
        return score, reasons


class AdvisoryOrchestrator:
    """Orchestrates advisory sessions with multiple clones"""
    
    def __init__(self):
        self.selector = CloneSelector()
    
    def run_advisory_session(
        self,
        idea: str,
        domain_hint: Optional[str] = None,
        num_clones: int = 3
    ) -> AdvisoryReport:
        """Run a complete advisory session
        
        Args:
            idea: The user's idea to be critiqued
            domain_hint: Optional domain hint for better clone selection
            num_clones: Number of clones to consult (default: 3)
        
        Returns:
            AdvisoryReport with aggregated feedback
        """
        # Step 1: Select clones
        selected_clones = self.selector.select_top_clones(
            idea, 
            num=num_clones,
            domain_hint=domain_hint
        )
        
        if not selected_clones:
            raise ValueError("No suitable clones found for this idea")
        
        # Step 2: Execute clones in parallel (will be implemented via MCP)
        # For now, this is a placeholder that will be called via the workflow
        individual_feedback = []
        
        # NOTE: Actual execution happens via MCP tools in the workflow
        # This method structure is for when we integrate programmatically
        
        # Step 3: Aggregate feedback
        report = self._create_report(idea, selected_clones, individual_feedback)
        
        return report
    
    def _create_report(
        self,
        idea: str,
        selected_clones: List[CloneMatch],
        individual_feedback: List[CloneFeedback]
    ) -> AdvisoryReport:
        """Create aggregated advisory report"""
        
        # For now, return a basic structure
        # Will be enhanced when we have actual feedback
        return AdvisoryReport(
            idea=idea,
            selected_clones=selected_clones,
            individual_feedback=individual_feedback,
            executive_summary="",
            consensus_points=[],
            divergent_views=[],
            priority_recommendations=[]
        )


class FeedbackAggregator:
    """Aggregates and structures feedback from multiple clones"""
    
    @staticmethod
    def aggregate(feedbacks: List[CloneFeedback]) -> Dict[str, any]:
        """Aggregate feedback from multiple clones
        
        Args:
            feedbacks: List of CloneFeedback objects
        
        Returns:
            Dictionary with aggregated insights
        """
        if not feedbacks:
            return {
                'executive_summary': 'No feedback received',
                'consensus_points': [],
                'divergent_views': [],
                'priority_recommendations': []
            }
        
        # Collect all points
        all_strengths = []
        all_weaknesses = []
        all_suggestions = []
        
        for feedback in feedbacks:
            all_strengths.extend(feedback.strengths)
            all_weaknesses.extend(feedback.weaknesses)
            all_suggestions.extend(feedback.suggestions)
        
        # Find consensus (points mentioned by multiple clones)
        consensus = FeedbackAggregator._find_consensus(feedbacks)
        
        # Find divergent views
        divergent = FeedbackAggregator._find_divergences(feedbacks)
        
        # Create executive summary
        summary = FeedbackAggregator._create_summary(feedbacks, consensus)
        
        return {
            'executive_summary': summary,
            'consensus_points': consensus,
            'divergent_views': divergent,
            'priority_recommendations': all_suggestions[:5],  # Top 5
            'all_strengths': all_strengths,
            'all_weaknesses': all_weaknesses
        }
    
    @staticmethod
    def _find_consensus(feedbacks: List[CloneFeedback]) -> List[str]:
        """Find points of consensus (mentioned by 2+ clones)"""
        # Simple keyword-based consensus detection
        # In production, would use semantic similarity
        consensus = []
        
        # Combine all assessment text
        all_text = [f.overall_assessment for f in feedbacks]
        
        # Look for common themes (simplified)
        if len(feedbacks) >= 2:
            consensus.append(f"{len(feedbacks)} experts reviewed this idea")
        
        return consensus
    
    @staticmethod
    def _find_divergences(feedbacks: List[CloneFeedback]) -> List[str]:
        """Find divergent viewpoints between clones"""
        divergent = []
        
        # Compare overall assessments
        assessments = [f.overall_assessment for f in feedbacks]
        if len(set(assessments)) > 1:
            for i, feedback in enumerate(feedbacks):
                if feedback.overall_assessment:
                    divergent.append(
                        f"{feedback.clone_name}: {feedback.overall_assessment[:100]}..."
                    )
        
        return divergent
    
    @staticmethod
    def _create_summary(feedbacks: List[CloneFeedback], consensus: List[str]) -> str:
        """Create executive summary from aggregated feedback"""
        num_clones = len(feedbacks)
        clone_names = ", ".join([f.clone_name for f in feedbacks])
        
        summary = f"Consultoria com {num_clones} especialistas: {clone_names}.\n\n"
        
        if consensus:
            summary += "Pontos de consenso:\n" + "\n".join(f"- {c}" for c in consensus)
        
        return summary


# Convenience function for workflow usage
def run_advisory(idea: str, domain_hint: Optional[str] = None) -> List[CloneMatch]:
    """Convenience function to select clones for an advisory session
    
    This is meant to be called from the /advisory workflow.
    
    Args:
        idea: The user's idea
        domain_hint: Optional domain hint
    
    Returns:
        List of selected CloneMatch objects
    """
    orchestrator = AdvisoryOrchestrator()
    selected = orchestrator.selector.select_top_clones(
        idea, 
        num=3,
        domain_hint=domain_hint
    )
    return selected
