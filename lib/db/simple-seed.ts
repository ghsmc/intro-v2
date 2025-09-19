import { config } from 'dotenv';
import postgres from 'postgres';

// Load environment variables
config({ path: '.env.local' });

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);

async function seedData() {
  try {
    console.log('Starting simple seeding...');

    // Insert OpenAI company
    const [openai] = await client`
      INSERT INTO "Company" (
        id, name, description, industry, size, location, website,
        founded, funding, technologies, benefits, culture,
        hiring, remote, internship, "entryLevel", "domainType"
      ) VALUES (
        gen_random_uuid(),
        'OpenAI',
        'OpenAI is an AI research and deployment company building safe and beneficial artificial general intelligence.',
        'Artificial Intelligence',
        '500-1000',
        'San Francisco, CA',
        'https://openai.com',
        '2015',
        '$86B',
        ${JSON.stringify(['Python', 'PyTorch', 'TensorFlow', 'CUDA', 'Kubernetes', 'React'])},
        ${JSON.stringify(['Competitive salary', 'Stock options', 'Health insurance', 'Remote work', 'Learning budget'])},
        'Mission-driven organization focused on ensuring AGI benefits all of humanity.',
        true,
        true,
        true,
        true,
        'SOFTWARE'
      )
      RETURNING id, name
    `;
    console.log(`✓ Inserted OpenAI with ID: ${openai.id}`);

    // Insert Anthropic company
    const [anthropic] = await client`
      INSERT INTO "Company" (
        id, name, description, industry, size, location, website,
        founded, funding, technologies, benefits, culture,
        hiring, remote, internship, "entryLevel", "domainType"
      ) VALUES (
        gen_random_uuid(),
        'Anthropic',
        'Anthropic is an AI safety company working to build reliable, interpretable, and steerable AI systems.',
        'Artificial Intelligence',
        '100-500',
        'San Francisco, CA',
        'https://anthropic.com',
        '2021',
        '$18B',
        ${JSON.stringify(['Python', 'JAX', 'TensorFlow', 'Constitutional AI', 'LLMs', 'Safety Research'])},
        ${JSON.stringify(['Competitive compensation', 'Equity', 'Health coverage', 'Remote options', 'Research budget'])},
        'Safety-focused AI research company with emphasis on building beneficial AI systems.',
        true,
        true,
        true,
        true,
        'SOFTWARE'
      )
      RETURNING id, name
    `;
    console.log(`✓ Inserted Anthropic with ID: ${anthropic.id}`);

    // Insert Google DeepMind company
    const [deepmind] = await client`
      INSERT INTO "Company" (
        id, name, description, industry, size, location, website,
        founded, funding, technologies, benefits, culture,
        hiring, remote, internship, "entryLevel", "domainType"
      ) VALUES (
        gen_random_uuid(),
        'Google DeepMind',
        'DeepMind is a world leader in artificial intelligence research and its application for positive impact.',
        'Artificial Intelligence',
        '1000+',
        'Mountain View, CA',
        'https://deepmind.google',
        '2010',
        'Part of Alphabet',
        ${JSON.stringify(['Python', 'JAX', 'TensorFlow', 'AlphaGo', 'AlphaFold', 'Gemini'])},
        ${JSON.stringify(['Google benefits', 'Stock', 'Healthcare', 'Wellness', 'Learning opportunities'])},
        'Research-driven organization pushing the boundaries of AI for scientific discovery.',
        true,
        true,
        true,
        true,
        'SOFTWARE'
      )
      RETURNING id, name
    `;
    console.log(`✓ Inserted Google DeepMind with ID: ${deepmind.id}`);

    // Now insert jobs for OpenAI
    console.log('\nInserting jobs...');

    const mlEngineerJob = await client`
      INSERT INTO "Job" (
        id, "companyId", title, department, team, level, type,
        location, "locationCity", "locationState", "locationCountry", "remoteType",
        "salaryMin", "salaryMax", "salaryCurrency", "salaryPeriod",
        description, requirements, responsibilities, skills, categories,
        "applicationUrl", status, featured, verified, "postedAt"
      ) VALUES (
        gen_random_uuid(),
        ${openai.id},
        'Machine Learning Engineer - Large Language Models',
        'Engineering',
        'LLM Research',
        'mid',
        'full-time',
        'San Francisco, CA',
        'San Francisco',
        'CA',
        'USA',
        'hybrid',
        200000,
        400000,
        'USD',
        'year',
        'OpenAI: We are looking for exceptional ML engineers to work on cutting-edge large language models. You will be responsible for training, fine-tuning, and deploying state-of-the-art models at scale.',
        ${JSON.stringify([
          'MS/PhD in Computer Science, Machine Learning, or related field',
          '3+ years of experience with deep learning frameworks (PyTorch, TensorFlow)',
          'Experience with distributed training and model parallelism',
          'Strong programming skills in Python',
          'Experience with transformer architectures and attention mechanisms'
        ])},
        ${JSON.stringify([
          'Design and implement novel ML architectures for language understanding',
          'Optimize model training pipelines for efficiency and scalability',
          'Collaborate with research teams to productionize experimental models',
          'Develop evaluation frameworks and benchmarks',
          'Contribute to open-source ML projects'
        ])},
        ${JSON.stringify(['Python', 'PyTorch', 'Transformers', 'CUDA', 'Distributed Systems', 'LLMs', 'NLP'])},
        ${JSON.stringify(['Engineering', 'Machine Learning', 'Research'])},
        'https://openai.com/careers',
        'active',
        true,
        true,
        CURRENT_TIMESTAMP
      )
      RETURNING id, title
    `;
    console.log(`✓ Inserted job: ${mlEngineerJob[0].title}`);

    const infraJob = await client`
      INSERT INTO "Job" (
        id, "companyId", title, department, team, level, type,
        location, "locationCity", "locationState", "locationCountry", "remoteType",
        "salaryMin", "salaryMax", "salaryCurrency", "salaryPeriod",
        description, requirements, responsibilities, skills, categories,
        "applicationUrl", status, featured, verified, "postedAt"
      ) VALUES (
        gen_random_uuid(),
        ${openai.id},
        'ML Infrastructure Engineer',
        'Engineering',
        'ML Platform',
        'senior',
        'full-time',
        'San Francisco, CA',
        'San Francisco',
        'CA',
        'USA',
        'remote',
        180000,
        350000,
        'USD',
        'year',
        'OpenAI: Build the infrastructure that powers our AI research and deployment. You will work on distributed training systems, model serving infrastructure, and data pipelines.',
        ${JSON.stringify([
          'BS/MS in Computer Science or equivalent experience',
          '5+ years of experience in software engineering',
          'Experience with ML infrastructure (Kubernetes, Ray, MLflow)',
          'Strong systems programming skills',
          'Experience with cloud platforms (AWS, GCP, Azure)'
        ])},
        ${JSON.stringify([
          'Design and build distributed training infrastructure',
          'Develop model serving and deployment systems',
          'Optimize GPU utilization and resource allocation',
          'Build monitoring and observability for ML systems',
          'Collaborate with ML researchers and engineers'
        ])},
        ${JSON.stringify(['Python', 'Kubernetes', 'Docker', 'CUDA', 'AWS', 'Ray', 'MLOps'])},
        ${JSON.stringify(['Engineering', 'Infrastructure', 'Machine Learning'])},
        'https://openai.com/careers',
        'active',
        false,
        true,
        CURRENT_TIMESTAMP - INTERVAL '5 days'
      )
      RETURNING id, title
    `;
    console.log(`✓ Inserted job: ${infraJob[0].title}`);

    // Add more jobs for Anthropic and DeepMind
    const anthropicJob = await client`
      INSERT INTO "Job" (
        id, "companyId", title, department, team, level, type,
        location, "locationCity", "locationState", "locationCountry", "remoteType",
        "salaryMin", "salaryMax", "salaryCurrency", "salaryPeriod",
        description, requirements, responsibilities, skills, categories,
        "applicationUrl", status, featured, verified, "postedAt"
      ) VALUES (
        gen_random_uuid(),
        ${anthropic.id},
        'AI Safety Researcher',
        'Research',
        'Safety Research',
        'senior',
        'full-time',
        'San Francisco, CA',
        'San Francisco',
        'CA',
        'USA',
        'hybrid',
        250000,
        450000,
        'USD',
        'year',
        'Anthropic: Join our team working on AI safety and alignment. Focus on developing methods to make AI systems more reliable, interpretable, and aligned with human values.',
        ${JSON.stringify([
          'PhD in ML, AI, or related field',
          'Publications in top ML/AI conferences',
          'Experience with constitutional AI or RLHF',
          'Strong mathematical background',
          'Experience with large language models'
        ])},
        ${JSON.stringify([
          'Research AI alignment and safety techniques',
          'Develop interpretability methods for large models',
          'Design and run experiments on model behavior',
          'Publish research findings',
          'Collaborate with the broader AI safety community'
        ])},
        ${JSON.stringify(['Python', 'JAX', 'Constitutional AI', 'RLHF', 'Research', 'LLMs'])},
        ${JSON.stringify(['Research', 'AI Safety', 'Machine Learning'])},
        'https://anthropic.com/careers',
        'active',
        true,
        true,
        CURRENT_TIMESTAMP - INTERVAL '2 days'
      )
      RETURNING id, title
    `;
    console.log(`✓ Inserted job: ${anthropicJob[0].title}`);

    const deepmindJob = await client`
      INSERT INTO "Job" (
        id, "companyId", title, department, team, level, type,
        location, "locationCity", "locationState", "locationCountry", "remoteType",
        "salaryMin", "salaryMax", "salaryCurrency", "salaryPeriod",
        description, requirements, responsibilities, skills, categories,
        "applicationUrl", status, featured, verified, "postedAt"
      ) VALUES (
        gen_random_uuid(),
        ${deepmind.id},
        'Research Engineer - Reinforcement Learning',
        'Research',
        'RL Research',
        'mid',
        'internship',
        'Mountain View, CA',
        'Mountain View',
        'CA',
        'USA',
        'onsite',
        8000,
        10000,
        'USD',
        'month',
        'Google DeepMind: Join our reinforcement learning research team as an intern. Work on cutting-edge RL algorithms and their applications to real-world problems.',
        ${JSON.stringify([
          'Currently pursuing BS/MS/PhD in CS, ML, or related field',
          'Strong mathematical background',
          'Experience with RL algorithms and frameworks',
          'Proficiency in Python and deep learning frameworks',
          'Research publications in RL/ML (preferred)'
        ])},
        ${JSON.stringify([
          'Implement and experiment with novel RL algorithms',
          'Run experiments and analyze results',
          'Contribute to research papers and technical reports',
          'Collaborate with senior researchers',
          'Present findings to the team'
        ])},
        ${JSON.stringify(['Python', 'PyTorch', 'Reinforcement Learning', 'Mathematics', 'Research'])},
        ${JSON.stringify(['Research', 'Machine Learning', 'Internship'])},
        'https://deepmind.google/careers',
        'active',
        true,
        true,
        CURRENT_TIMESTAMP - INTERVAL '7 days'
      )
      RETURNING id, title
    `;
    console.log(`✓ Inserted job: ${deepmindJob[0].title}`);

    console.log('\n✅ Seeding completed successfully!');
    console.log(`Seeded 3 companies and 4 ML engineering jobs`);

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}