// Quick Match Tool - Instantly match students to opportunities
import { z } from 'zod';
import { tool } from 'ai';
import { bulgeBracketPrograms } from '@/lib/data/bulge-bracket-programs';

interface MatchScore {
  program: any;
  score: number;
  reasons: string[];
  urgency: 'closing-soon' | 'just-opened' | 'normal';
}

export const quickMatchTool = tool({
  description: 'Instantly match students to their best-fit IB programs based on profile',
  inputSchema: z.object({
    classYear: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Recent Grad']),
    targetLocations: z.array(z.string()).optional(),
    experience: z.enum(['None', 'Basic Finance', 'Previous IB Internship', 'Advanced']),
    interests: z.array(z.string()).optional(),
  }),
  execute: async ({ classYear, targetLocations, experience, interests }) => {
    const today = new Date();
    const matches: MatchScore[] = [];

    // Score each program
    bulgeBracketPrograms.forEach(program => {
      let score = 0;
      const reasons: string[] = [];
      let urgency: 'closing-soon' | 'just-opened' | 'normal' = 'normal';

      // Class year matching
      if (classYear === 'Junior' || classYear === 'Senior') {
        score += 30;
        reasons.push('Perfect timing for your class year');
      } else if (classYear === 'Sophomore') {
        if (program.programName.includes('Sophomore') || program.programName.includes('Insight')) {
          score += 40;
          reasons.push('Designed for sophomores');
        } else {
          score += 10;
        }
      }

      // Location matching
      if (targetLocations?.length) {
        const locationMatch = program.locations.some(loc =>
          targetLocations.some(target =>
            loc.toLowerCase().includes(target.toLowerCase())
          )
        );
        if (locationMatch) {
          score += 25;
          reasons.push('Matches your location preference');
        }
      }

      // Experience level matching
      if (experience === 'None' && program.tier === 'Middle Market') {
        score += 20;
        reasons.push('Good entry point for beginners');
      } else if (experience === 'Previous IB Internship' && program.tier === 'Elite Boutique') {
        score += 30;
        reasons.push('Elite program for experienced candidates');
      } else if (experience === 'Basic Finance' && program.tier === 'Bulge Bracket') {
        score += 25;
        reasons.push('Strong brand for career growth');
      }

      // Check urgency
      const closeDate = program.closingDate ? new Date(program.closingDate) : null;
      const openDate = program.openingDate ? new Date(program.openingDate) : null;

      if (closeDate) {
        const daysUntilClose = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilClose > 0 && daysUntilClose <= 7) {
          urgency = 'closing-soon';
          score += 15;
          reasons.push(`⚠️ Closes in ${daysUntilClose} days`);
        }
      }

      if (openDate) {
        const daysSinceOpen = Math.ceil((today.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceOpen >= 0 && daysSinceOpen <= 3) {
          urgency = 'just-opened';
          score += 20;
          reasons.push(`🔥 Just opened ${daysSinceOpen} days ago`);
        }
      }

      // Program is currently open
      if (openDate && openDate <= today && (!closeDate || closeDate >= today)) {
        score += 10;
        reasons.push('Currently accepting applications');
      }

      if (score > 0) {
        matches.push({ program, score, reasons, urgency });
      }
    });

    // Sort by score and urgency
    matches.sort((a, b) => {
      if (a.urgency === 'closing-soon' && b.urgency !== 'closing-soon') return -1;
      if (b.urgency === 'closing-soon' && a.urgency !== 'closing-soon') return 1;
      return b.score - a.score;
    });

    const topMatches = matches.slice(0, 10);

    // Create personalized insights
    const insights = {
      immediate_action: matches.filter(m => m.urgency === 'closing-soon').slice(0, 3),
      best_fits: topMatches.slice(0, 5),
      new_opportunities: matches.filter(m => m.urgency === 'just-opened'),
      statistics: {
        total_open: matches.filter(m => m.reasons.some(r => r.includes('accepting'))).length,
        closing_this_week: matches.filter(m => m.urgency === 'closing-soon').length,
        perfect_matches: matches.filter(m => m.score >= 50).length,
      }
    };

    return {
      summary: `Found ${topMatches.length} programs matching your profile`,
      urgent_message: insights.immediate_action.length > 0
        ? `⚠️ ${insights.immediate_action.length} programs closing soon - apply TODAY!`
        : null,
      top_matches: topMatches.map(m => ({
        company: m.program.company,
        program: m.program.programName,
        match_score: `${Math.min(Math.round(m.score * 1.5), 99)}%`,
        why_matched: m.reasons.slice(0, 2),
        urgency: m.urgency,
        locations: m.program.locations,
        deadline: m.program.closingDate,
        apply_url: m.program.applicationUrl
      })),
      insights,
      next_steps: [
        'Review your top 5 matches below',
        'Set reminders for closing deadlines',
        'Prepare tailored applications for best fits',
        'Track your application progress'
      ]
    };
  },
});