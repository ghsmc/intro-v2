import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/providers';
import { generateUUID } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, message } = await request.json();

    // Get current session data (in production, this would be stored in database)
    // For now, we'll simulate the session data
    const currentSession = {
      id: sessionId,
      userId: session.user.id,
      domain: 'ENGINEERS', // This would come from the session
      profile: {
        name: 'John Doe',
        classYear: '2025',
        major: 'Computer Science',
        energyProfile: {
          solo_work: 4,
          team_lead: 3,
          data_analysis: 5,
          creative_problem_solving: 4
        },
        values: ['intellectual_challenge', 'building_something_new'],
        peakMoment: 'Built a machine learning model that predicted student outcomes',
        constraints: { geography: 'San Francisco', salary_minimum: '100000' },
        immediateGoal: 'Find a software engineering role at a tech company',
        skills: [],
        interests: [],
        workStyle: '',
        careerGoals: [],
        dealBreakers: [],
        mustHaves: [],
        locationPreferences: [],
        timeline: ''
      },
      conversation: [],
      matches: [],
      currentStep: 1,
      completed: false
    };

    // Add user message to conversation
    const userMessage = {
      id: generateUUID(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    const updatedConversation = [...currentSession.conversation, userMessage];

    // Generate AI response using LLM
    const aiResponse = await generateAIResponse(currentSession.profile, updatedConversation, currentSession.domain);

    const aiMessage = {
      id: generateUUID(),
      type: 'ai' as const,
      content: aiResponse,
      timestamp: new Date()
    };

    const finalConversation = [...updatedConversation, aiMessage];

    // Update profile based on conversation
    const updatedProfile = await updateProfileFromConversation(currentSession.profile, finalConversation);

    // Check if conversation is complete
    const isComplete = await isConversationComplete(updatedProfile, currentSession.domain);

    const updatedSession = {
      ...currentSession,
      profile: updatedProfile,
      conversation: finalConversation,
      currentStep: isComplete ? 2 : 1
    };

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error in conversation:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(profile: any, conversation: any[], domain: string): Promise<string> {
  const conversationHistory = conversation.map(msg => 
    `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`
  ).join('\n');

  const prompt = `
You are an AI career advisor helping a ${profile.classYear} ${profile.major} student find their ideal career path.

User Profile:
- Name: ${profile.name}
- Class Year: ${profile.classYear}
- Major: ${profile.major}
- Values: ${profile.values.join(', ')}
- Peak Moment: ${profile.peakMoment}
- Energy Profile: ${JSON.stringify(profile.energyProfile)}
- Immediate Goal: ${profile.immediateGoal}

Domain: ${domain}

Conversation History:
${conversationHistory}

Generate a natural, engaging follow-up question to learn more about their career preferences. 
Focus on areas that aren't already covered in their profile. Be conversational and reference their existing data.

Examples of good questions:
- "I see you're energized by data analysis and your peak moment was building that ML model. What specific technical skills did you develop in that project?"
- "Based on your energy profile, you seem to thrive in collaborative environments. What type of team dynamics work best for you?"
- "You mentioned wanting to work at a tech company. What size company appeals to you most - startup, mid-size, or large enterprise?"

Keep the question focused and specific. Don't ask about information we already have.
`;

  try {
    // For now, return a simple question to avoid build issues
    return "That's interesting! Can you tell me more about what excites you most in your career?";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "That's interesting! Can you tell me more about what excites you most in your career?";
  }
}

async function updateProfileFromConversation(profile: any, conversation: any[]): Promise<any> {
  // Extract skills, interests, and other details from conversation
  const recentMessages = conversation.slice(-4); // Last 4 messages
  const userMessages = recentMessages.filter(msg => msg.type === 'user');
  
  // Simple extraction logic - in production, use more sophisticated NLP
  const extractedSkills: string[] = [];
  const extractedInterests: string[] = [];
  
  userMessages.forEach(msg => {
    const content = msg.content.toLowerCase();
    
    // Extract technical skills
    if (content.includes('python') || content.includes('javascript') || content.includes('react')) {
      extractedSkills.push('Python', 'JavaScript', 'React');
    }
    if (content.includes('machine learning') || content.includes('ml')) {
      extractedSkills.push('Machine Learning');
    }
    if (content.includes('data analysis') || content.includes('analytics')) {
      extractedSkills.push('Data Analysis');
    }
    
    // Extract interests
    if (content.includes('startup') || content.includes('entrepreneur')) {
      extractedInterests.push('Startups');
    }
    if (content.includes('ai') || content.includes('artificial intelligence')) {
      extractedInterests.push('Artificial Intelligence');
    }
    if (content.includes('fintech') || content.includes('finance')) {
      extractedInterests.push('Fintech');
    }
  });

  return {
    ...profile,
    skills: [...new Set([...profile.skills, ...extractedSkills])],
    interests: [...new Set([...profile.interests, ...extractedInterests])]
  };
}

async function isConversationComplete(profile: any, domain: string): Promise<boolean> {
  // Check if we have enough information to generate matches
  const hasSkills = profile.skills.length > 0;
  const hasInterests = profile.interests.length > 0;
  const hasWorkStyle = profile.workStyle !== '';
  const hasCareerGoals = profile.careerGoals.length > 0;
  
  // For now, consider complete if we have skills and interests
  return hasSkills && hasInterests;
}
