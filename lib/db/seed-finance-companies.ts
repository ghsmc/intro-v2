import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { company } from './schema';
import * as dotenv from 'dotenv';
import path from 'node:path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Create db instance
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL not found in environment variables');
}

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

// Define the finance companies data structure
interface FinanceCompany {
  name: string;
  hq?: string;
  founded?: number;
  employees?: string;
  aum?: string;
  focus: string;
  tech_stack: string[];
  comp_range: string;
  culture?: string;
  career_site: string;
  tier: string;
  category: string;
  subcategory?: string;
  parent?: string;
  valuation?: string;
  market_cap?: string;
  status?: string;
}

// Tier 1: Quantitative Trading Giants (25 companies)
const quantTradingElite: FinanceCompany[] = [
  {
    name: "Jane Street",
    hq: "New York, NY",
    founded: 1999,
    employees: "2,500+",
    focus: "ETF market making, global liquidity provider",
    tech_stack: ["OCaml", "Python", "C++", "FPGA"],
    comp_range: "$400-700k new grad, $1-3M+ experienced",
    culture: "Poker/game theory, collaborative, intellectual",
    career_site: "janestreet.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Market Making & HFT"
  },
  {
    name: "Citadel Securities",
    hq: "Chicago, IL / Miami, FL",
    founded: 2002,
    employees: "2,000+",
    focus: "Market making, 40% of US retail volume",
    tech_stack: ["C++", "Python", "Java", "KDB+/Q"],
    comp_range: "$425k new grad, $1-5M+ experienced",
    culture: "Excellence driven, competitive, well-resourced",
    career_site: "citadelsecurities.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Market Making & HFT"
  },
  {
    name: "Jump Trading",
    hq: "Chicago, IL",
    founded: 1999,
    employees: "1,200+",
    focus: "HFT, crypto, research-driven",
    tech_stack: ["C++", "Python", "FPGA", "CUDA"],
    comp_range: "$350k new grad, $1-3M+ experienced",
    culture: "Academic, research-focused, collaborative",
    career_site: "jumptrading.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Market Making & HFT"
  },
  {
    name: "Two Sigma",
    hq: "New York, NY",
    founded: 2001,
    aum: "$60B+",
    employees: "2,000+",
    focus: "Systematic trading, data science",
    tech_stack: ["Python", "C++", "Spark", "TensorFlow"],
    comp_range: "$350k new grad, $800k-2M+ experienced",
    culture: "Tech-company feel, open source friendly",
    career_site: "twosigma.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Systematic Trading"
  },
  {
    name: "D.E. Shaw",
    hq: "New York, NY",
    founded: 1988,
    aum: "$60B+",
    employees: "2,500+",
    focus: "Systematic & discretionary strategies",
    tech_stack: ["Python", "C++", "KDB+/Q", "Slang"],
    comp_range: "$375k new grad, $1-3M+ experienced",
    culture: "Intellectual, academic pedigree valued",
    career_site: "deshaw.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Systematic Trading"
  },
  {
    name: "Renaissance Technologies",
    hq: "East Setauket, NY",
    founded: 1982,
    aum: "$130B+",
    employees: "300+",
    focus: "Medallion Fund, pure quant strategies",
    tech_stack: ["C++", "Fortran", "Python"],
    comp_range: "Highly variable, profit-sharing model",
    culture: "PhD-heavy, secretive, academic",
    career_site: "rentec.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Pure Quant"
  },
  {
    name: "Millennium Management",
    hq: "New York, NY",
    founded: 1989,
    aum: "$60B+",
    employees: "5,000+",
    focus: "Multi-strategy pod structure",
    tech_stack: ["Python", "C++", "Java", "KDB+"],
    comp_range: "$300-500k new grad, $1-5M+ experienced",
    culture: "Pod-based, entrepreneurial, eat-what-you-kill",
    career_site: "mlp.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Multi-Strategy"
  },
  {
    name: "Bridgewater Associates",
    hq: "Westport, CT",
    founded: 1975,
    aum: "$150B+",
    employees: "1,500+",
    focus: "Macro strategies, risk parity",
    tech_stack: ["Python", "Java", "Scala"],
    comp_range: "$275k new grad, $500k-2M experienced",
    culture: "Radical transparency, principles-based",
    career_site: "bridgewater.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Macro Strategies"
  },
  {
    name: "AQR Capital",
    hq: "Greenwich, CT",
    founded: 1998,
    aum: "$100B+",
    employees: "900+",
    focus: "Factor investing, systematic strategies",
    tech_stack: ["Python", "R", "C++", "MATLAB"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    culture: "Academic, research-published, collaborative",
    career_site: "aqr.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Factor Investing"
  },
  {
    name: "Point72",
    hq: "Stamford, CT",
    founded: 2014,
    aum: "$30B+",
    employees: "2,000+",
    focus: "Multi-strategy, fundamental + systematic",
    tech_stack: ["Python", "C++", "Java"],
    comp_range: "$300k new grad, $800k-3M experienced",
    culture: "Data-driven, collaborative pods",
    career_site: "point72.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Multi-Strategy"
  },
  {
    name: "Balyasny Asset Management",
    hq: "Chicago, IL",
    founded: 1999,
    aum: "$20B+",
    employees: "1,000+",
    focus: "Multi-strategy, global macro",
    tech_stack: ["Python", "C++", "KDB+"],
    comp_range: "$275k new grad, $700k-2M experienced",
    career_site: "balyasny.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Multi-Strategy"
  },
  {
    name: "Squarepoint Capital",
    hq: "London, UK / New York, NY",
    founded: 2014,
    aum: "$75B+",
    employees: "800+",
    focus: "Systematic strategies, statistical arbitrage",
    tech_stack: ["Python", "C++", "KDB+", "Rust"],
    comp_range: "$300k new grad, $800k-2M experienced",
    career_site: "squarepoint-capital.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Statistical Arbitrage"
  },
  {
    name: "Schonfeld Strategic Advisors",
    hq: "New York, NY / Miami, FL",
    founded: 1988,
    aum: "$13B+",
    employees: "900+",
    focus: "Quantitative trading, fundamental strategies",
    tech_stack: ["Python", "C++", "Java"],
    comp_range: "$250k new grad, $600k-2M experienced",
    career_site: "schonfeld.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Fundamental + Quant"
  },
  {
    name: "Wolverine Trading",
    hq: "Chicago, IL",
    founded: 1994,
    employees: "500+",
    focus: "Options market making, crypto",
    tech_stack: ["C++", "Python", "Rust", "FPGA"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    career_site: "wolve.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "GTS",
    hq: "New York, NY",
    founded: 2006,
    employees: "350+",
    focus: "Market making, ETFs, crypto",
    tech_stack: ["C++", "Python", "Go", "Rust"],
    comp_range: "$275k new grad, $600k-1.5M experienced",
    career_site: "gtsx.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Market Making"
  },
  {
    name: "Akuna Capital",
    hq: "Chicago, IL",
    founded: 2011,
    employees: "350+",
    focus: "Options market making, crypto derivatives",
    tech_stack: ["C++", "Python", "Rust", "React"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "akunacapital.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "Belvedere Trading",
    hq: "Chicago, IL",
    founded: 2002,
    employees: "200+",
    focus: "Equity derivatives, proprietary trading",
    tech_stack: ["C++", "Python", "Java"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "belvederetrading.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Equity Derivatives"
  },
  {
    name: "Peak6",
    hq: "Chicago, IL",
    founded: 1997,
    employees: "800+",
    focus: "Options trading, fintech investments",
    tech_stack: ["Python", "C++", "Java", "AWS"],
    comp_range: "$180k new grad, $350k-800k experienced",
    career_site: "peak6.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Options Trading"
  },
  {
    name: "Voleon Group",
    hq: "Berkeley, CA",
    founded: 2007,
    aum: "$5B+",
    employees: "150+",
    focus: "Machine learning for trading",
    tech_stack: ["Python", "C++", "TensorFlow", "PyTorch"],
    comp_range: "$250k new grad, $500k-1.2M experienced",
    career_site: "voleon.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Machine Learning"
  },
  {
    name: "PDT Partners",
    hq: "New York, NY",
    founded: 1993,
    aum: "$10B+",
    employees: "200+",
    focus: "Systematic trading, statistical arbitrage",
    tech_stack: ["Python", "C++", "KDB+"],
    comp_range: "$300k new grad, $700k-2M experienced",
    career_site: "pdtpartners.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Statistical Arbitrage"
  },
  {
    name: "Headlands Technologies",
    hq: "Chicago, IL",
    founded: 2016,
    employees: "100+",
    focus: "FICC market making, low latency",
    tech_stack: ["C++", "FPGA", "Python"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    career_site: "headlandstech.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "FICC Market Making"
  },
  {
    name: "Radix Trading",
    hq: "Chicago, IL",
    founded: 2016,
    employees: "150+",
    focus: "Quantitative trading, market making",
    tech_stack: ["Rust", "C++", "Python"],
    comp_range: "$225k new grad, $450k-1M experienced",
    career_site: "radixtrading.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Market Making"
  },
  {
    name: "3Red Partners",
    hq: "Austin, TX",
    founded: 2016,
    employees: "50+",
    focus: "Options trading, volatility strategies",
    tech_stack: ["Python", "C++", "AWS"],
    comp_range: "$200k new grad, $400k-800k experienced",
    career_site: "3red.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Options Trading"
  },
  {
    name: "Vatic Labs",
    hq: "New York, NY",
    founded: 2019,
    employees: "50+",
    focus: "Crypto market making, DeFi",
    tech_stack: ["Rust", "Go", "Python", "Solidity"],
    comp_range: "$250k new grad, $500k-1M experienced",
    career_site: "vaticlabs.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Crypto Market Making"
  },
  {
    name: "Maven Securities",
    hq: "London, UK / New York, NY",
    founded: 2011,
    employees: "200+",
    focus: "Options market making, arbitrage",
    tech_stack: ["C++", "Python", "FPGA"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "mavensecurities.com/careers",
    tier: "Tier 1",
    category: "Quantitative Trading",
    subcategory: "Options Market Making"
  }
];

// Tier 2: Prop Trading & Market Makers (20 companies)
const propTradingFirms: FinanceCompany[] = [
  {
    name: "Optiver",
    hq: "Amsterdam / Chicago / Sydney",
    founded: 1986,
    employees: "2,000+",
    focus: "Options market making globally",
    tech_stack: ["C++", "Python", "FPGA", "Rust"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    culture: "Collaborative, transparent, work-life balance",
    career_site: "optiver.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "IMC Trading",
    hq: "Amsterdam / Chicago / Sydney",
    founded: 1989,
    employees: "1,500+",
    focus: "Market making, ETFs, bonds",
    tech_stack: ["C++", "Java", "Python", "FPGA"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    culture: "Engineering-first, innovative, flat hierarchy",
    career_site: "imc.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Market Making"
  },
  {
    name: "DRW",
    hq: "Chicago, IL",
    founded: 1992,
    employees: "1,500+",
    focus: "Trading, crypto, venture investments",
    tech_stack: ["C++", "Python", "Java", "Rust"],
    comp_range: "$300k new grad, $600k-2M experienced",
    culture: "Entrepreneurial, diverse strategies",
    career_site: "drw.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Multi-Strategy"
  },
  {
    name: "SIG (Susquehanna)",
    hq: "Philadelphia, PA",
    founded: 1987,
    employees: "3,000+",
    focus: "Options, ETFs, education-focused",
    tech_stack: ["C++", "Python", "Java", "OCaml"],
    comp_range: "$200k new grad, $400k-1.2M experienced",
    culture: "Poker/game theory, education-first",
    career_site: "sig.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Options Trading"
  },
  {
    name: "Five Rings",
    hq: "New York, NY",
    founded: 2012,
    employees: "250+",
    focus: "Proprietary trading, market making",
    tech_stack: ["C++", "Python", "FPGA"],
    comp_range: "$275k new grad, $550k-1.5M experienced",
    career_site: "fiverings.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Market Making"
  },
  {
    name: "Tower Research Capital",
    hq: "New York, NY",
    founded: 1998,
    employees: "1,000+",
    focus: "HFT, low latency, global markets",
    tech_stack: ["C++", "Python", "FPGA", "Verilog"],
    comp_range: "$275k new grad, $600k-1.8M experienced",
    career_site: "tower-research.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "High Frequency Trading"
  },
  {
    name: "Hudson River Trading",
    hq: "New York, NY",
    founded: 2002,
    employees: "700+",
    focus: "Algorithmic trading, all asset classes",
    tech_stack: ["C++", "Python", "OCaml", "FPGA"],
    comp_range: "$300k new grad, $650k-2M experienced",
    culture: "Academic, algorithm competitions",
    career_site: "hudsonrivertrading.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Algorithmic Trading"
  },
  {
    name: "Virtu Financial",
    hq: "New York, NY",
    founded: 2008,
    employees: "1,000+",
    focus: "Market making, execution services",
    tech_stack: ["C++", "Java", "Python"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "virtu.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Market Making"
  },
  {
    name: "XTX Markets",
    hq: "London, UK",
    founded: 2015,
    employees: "150+",
    focus: "Algorithmic trading, FX focus",
    tech_stack: ["C++", "Python", "KDB+", "FPGA"],
    comp_range: "$300k new grad, $700k-2M experienced",
    career_site: "xtxmarkets.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "FX Trading"
  },
  {
    name: "Flow Traders",
    hq: "Amsterdam",
    founded: 2004,
    employees: "700+",
    focus: "ETF market making, crypto",
    tech_stack: ["C++", "Python", "Java"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "flowtraders.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "ETF Market Making"
  },
  {
    name: "Old Mission Capital",
    hq: "Chicago, IL",
    founded: 2007,
    employees: "150+",
    focus: "Options market making, ETFs",
    tech_stack: ["C++", "Python", "FPGA"],
    comp_range: "$225k new grad, $450k-1.2M experienced",
    career_site: "oldmissioncapital.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "Group One Trading",
    hq: "Chicago, IL",
    founded: 1989,
    employees: "200+",
    focus: "Options market making",
    tech_stack: ["C++", "Python", "Java"],
    comp_range: "$180k new grad, $350k-800k experienced",
    career_site: "group1.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "Allston Trading",
    hq: "Chicago, IL",
    founded: 2004,
    employees: "250+",
    focus: "High frequency trading",
    tech_stack: ["C++", "Python", "FPGA"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "allstontrading.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "High Frequency Trading"
  },
  {
    name: "Tibra",
    hq: "Sydney, Australia",
    founded: 2006,
    employees: "150+",
    focus: "Options market making",
    tech_stack: ["C++", "Python", "Rust"],
    comp_range: "$180k new grad, $350k-800k experienced",
    career_site: "tibra.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "Eclipse Trading",
    hq: "Sydney, Australia",
    founded: 2002,
    employees: "100+",
    focus: "Asia-Pacific market making",
    tech_stack: ["C++", "Python", "Java"],
    comp_range: "$150k new grad, $300k-700k experienced",
    career_site: "eclipsetrading.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Market Making"
  },
  {
    name: "Liquid Capital Group",
    hq: "Melbourne, Australia",
    founded: 2002,
    employees: "80+",
    focus: "Options market making",
    tech_stack: ["C++", "Python"],
    comp_range: "$140k new grad, $280k-600k experienced",
    career_site: "liquidcapitalgroup.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Options Market Making"
  },
  {
    name: "Ostium Labs",
    hq: "Miami, FL",
    founded: 2022,
    employees: "30+",
    focus: "Crypto derivatives, DeFi market making",
    tech_stack: ["Rust", "Go", "Python", "Solidity"],
    comp_range: "$200k new grad, $400k-800k experienced",
    career_site: "ostium.io/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Crypto Trading"
  },
  {
    name: "Amber Group",
    hq: "Singapore / Hong Kong",
    founded: 2017,
    employees: "700+",
    focus: "Crypto trading, market making",
    tech_stack: ["Go", "Python", "Rust", "C++"],
    comp_range: "$150k new grad, $300k-800k experienced",
    career_site: "ambergroup.io/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Crypto Trading"
  },
  {
    name: "Kronos Research",
    hq: "Taipei, Taiwan",
    founded: 2018,
    employees: "100+",
    focus: "Crypto market making, arbitrage",
    tech_stack: ["Python", "Go", "Rust"],
    comp_range: "$120k new grad, $250k-600k experienced",
    career_site: "kronosresearch.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Crypto Trading"
  },
  {
    name: "Keyrock",
    hq: "Brussels, Belgium",
    founded: 2017,
    employees: "150+",
    focus: "Digital asset market making",
    tech_stack: ["Python", "Go", "Rust", "TypeScript"],
    comp_range: "$100k new grad, $200k-500k experienced",
    career_site: "keyrock.com/careers",
    tier: "Tier 2",
    category: "Prop Trading",
    subcategory: "Crypto Trading"
  }
];

// Tier 3: Crypto/DeFi Trading (15 companies)
const cryptoTradingFirms: FinanceCompany[] = [
  {
    name: "Cumberland DRW",
    hq: "Chicago, IL",
    parent: "DRW",
    founded: 2014,
    focus: "Crypto OTC, institutional trading",
    tech_stack: ["Python", "Go", "Rust", "Solidity"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    career_site: "cumberland.io/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "OTC Trading"
  },
  {
    name: "Genesis Trading",
    hq: "New York, NY",
    founded: 2013,
    focus: "Institutional crypto trading",
    tech_stack: ["Python", "JavaScript", "Go"],
    comp_range: "$180k new grad, $350k-800k experienced",
    career_site: "genesistrading.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Institutional Trading"
  },
  {
    name: "Galaxy Digital Trading",
    hq: "New York, NY",
    founded: 2018,
    focus: "Crypto trading, asset management",
    tech_stack: ["Python", "C++", "Rust"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "galaxydigital.io/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Asset Management"
  },
  {
    name: "Wintermute",
    hq: "London, UK",
    founded: 2017,
    employees: "200+",
    focus: "Crypto market making, DeFi",
    tech_stack: ["Rust", "Go", "Python", "Solidity"],
    comp_range: "$200k new grad, $400k-1M experienced",
    career_site: "wintermute.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Market Making"
  },
  {
    name: "GSR",
    hq: "Hong Kong",
    founded: 2013,
    employees: "400+",
    focus: "Crypto market making, OTC",
    tech_stack: ["Python", "C++", "Go"],
    comp_range: "$180k new grad, $350k-800k experienced",
    career_site: "gsr.io/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Market Making"
  },
  {
    name: "B2C2",
    hq: "London, UK",
    founded: 2015,
    focus: "Crypto liquidity provider",
    tech_stack: ["Python", "Go", "Rust"],
    comp_range: "$150k new grad, $300k-700k experienced",
    career_site: "b2c2.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Liquidity Provider"
  },
  {
    name: "QCP Capital",
    hq: "Singapore",
    founded: 2017,
    focus: "Crypto options, structured products",
    tech_stack: ["Python", "C++", "Rust"],
    comp_range: "$120k new grad, $250k-600k experienced",
    career_site: "qcp.capital/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Options & Derivatives"
  },
  {
    name: "Talos",
    hq: "New York, NY",
    founded: 2018,
    focus: "Institutional crypto trading platform",
    tech_stack: ["Python", "Go", "Kubernetes", "React"],
    comp_range: "$180k new grad, $350k-700k experienced",
    career_site: "talos.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Trading Platform"
  },
  {
    name: "FalconX",
    hq: "San Mateo, CA",
    founded: 2018,
    valuation: "$8B",
    focus: "Institutional crypto platform",
    tech_stack: ["Go", "Python", "React", "AWS"],
    comp_range: "$200k new grad, $400k-800k experienced",
    career_site: "falconx.io/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Institutional Platform"
  },
  {
    name: "Paradigm",
    hq: "San Francisco, CA",
    founded: 2018,
    aum: "$13B+",
    focus: "Crypto VC, research, trading",
    tech_stack: ["Solidity", "Rust", "Python"],
    comp_range: "$250k new grad, $500k-1.5M experienced",
    career_site: "paradigm.xyz/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "VC & Research"
  },
  {
    name: "Jump Crypto",
    hq: "Chicago, IL",
    parent: "Jump Trading",
    focus: "Crypto trading, infrastructure, research",
    tech_stack: ["Rust", "Go", "Solidity", "C++"],
    comp_range: "$275k new grad, $550k-1.5M experienced",
    career_site: "jumpcrypto.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Infrastructure"
  },
  {
    name: "Blockchain.com Institutional",
    hq: "London, UK",
    founded: 2011,
    focus: "Institutional crypto services",
    tech_stack: ["Python", "Go", "React", "Kotlin"],
    comp_range: "$150k new grad, $300k-600k experienced",
    career_site: "blockchain.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Institutional Services"
  },
  {
    name: "Copper.co",
    hq: "London, UK",
    founded: 2018,
    focus: "Institutional crypto custody, trading",
    tech_stack: ["Python", "Go", "React", "AWS"],
    comp_range: "$120k new grad, $250k-500k experienced",
    career_site: "copper.co/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Custody & Trading"
  },
  {
    name: "Coinbase Institutional",
    hq: "San Francisco, CA",
    founded: 2012,
    focus: "Institutional crypto exchange",
    tech_stack: ["Go", "Ruby", "React", "Python"],
    comp_range: "$180k new grad, $350k-700k experienced",
    career_site: "coinbase.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Exchange"
  },
  {
    name: "BitGo",
    hq: "Palo Alto, CA",
    founded: 2013,
    valuation: "$1.75B",
    focus: "Digital asset financial services",
    tech_stack: ["Node.js", "Go", "React", "PostgreSQL"],
    comp_range: "$170k new grad, $340k-680k experienced",
    career_site: "bitgo.com/careers",
    tier: "Tier 3",
    category: "Crypto Trading",
    subcategory: "Financial Services"
  }
];

// Tier 4: Fintech Infrastructure & Platforms (25 companies)
const fintechInfrastructure: FinanceCompany[] = [
  {
    name: "Stripe",
    hq: "San Francisco, CA",
    founded: 2010,
    valuation: "$65B",
    employees: "8,000+",
    focus: "Payment processing, financial infrastructure",
    tech_stack: ["Ruby", "Go", "Scala", "React"],
    comp_range: "$200k new grad, $400k-800k experienced",
    career_site: "stripe.com/jobs",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Payment Infrastructure"
  },
  {
    name: "Square/Block",
    hq: "San Francisco, CA",
    founded: 2009,
    market_cap: "$45B",
    focus: "Payments, Cash App, Bitcoin",
    tech_stack: ["Java", "Ruby", "Go", "React Native"],
    comp_range: "$180k new grad, $350k-700k experienced",
    career_site: "block.xyz/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Payment Platforms"
  },
  {
    name: "Adyen",
    hq: "Amsterdam",
    founded: 2006,
    market_cap: "$50B",
    focus: "Global payment platform",
    tech_stack: ["Java", "Python", "PostgreSQL"],
    comp_range: "$150k new grad, $300k-600k experienced",
    career_site: "adyen.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Payment Platforms"
  },
  {
    name: "Marqeta",
    hq: "Oakland, CA",
    founded: 2010,
    focus: "Card issuing platform",
    tech_stack: ["Java", "Python", "AWS", "Kafka"],
    comp_range: "$160k new grad, $320k-650k experienced",
    career_site: "marqeta.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Card Infrastructure"
  },
  {
    name: "Checkout.com",
    hq: "London, UK",
    founded: 2012,
    valuation: "$40B",
    focus: "Global payments platform",
    tech_stack: ["C#", ".NET", "Go", "React"],
    comp_range: "$140k new grad, $280k-550k experienced",
    career_site: "checkout.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Payment Platforms"
  },
  {
    name: "Plaid",
    hq: "San Francisco, CA",
    founded: 2013,
    valuation: "$13.4B",
    focus: "Banking API, account connectivity",
    tech_stack: ["Go", "Python", "Node.js", "React"],
    comp_range: "$180k new grad, $350k-700k experienced",
    career_site: "plaid.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Banking Infrastructure"
  },
  {
    name: "Modern Treasury",
    hq: "San Francisco, CA",
    founded: 2018,
    valuation: "$2B",
    focus: "Payment operations, money movement",
    tech_stack: ["Python", "TypeScript", "PostgreSQL"],
    comp_range: "$170k new grad, $340k-650k experienced",
    career_site: "moderntreasury.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Payment Operations"
  },
  {
    name: "Thought Machine",
    hq: "London, UK",
    founded: 2014,
    valuation: "$2.7B",
    focus: "Core banking platform",
    tech_stack: ["Go", "Python", "Kubernetes"],
    comp_range: "$150k new grad, $300k-600k experienced",
    career_site: "thoughtmachine.net/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Banking Platform"
  },
  {
    name: "Mambu",
    hq: "Berlin, Germany",
    founded: 2011,
    valuation: "$5B",
    focus: "Cloud banking platform",
    tech_stack: ["Java", "Kotlin", "AWS"],
    comp_range: "$120k new grad, $240k-500k experienced",
    career_site: "mambu.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Banking Platform"
  },
  {
    name: "Unit",
    hq: "New York, NY",
    founded: 2020,
    valuation: "$1.2B",
    focus: "Banking-as-a-Service",
    tech_stack: ["Python", "TypeScript", "AWS"],
    comp_range: "$160k new grad, $320k-600k experienced",
    career_site: "unit.co/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Banking-as-a-Service"
  },
  {
    name: "Robinhood",
    hq: "Menlo Park, CA",
    founded: 2013,
    market_cap: "$15B",
    focus: "Retail trading platform",
    tech_stack: ["Python", "Go", "React Native", "Kafka"],
    comp_range: "$180k new grad, $350k-700k experienced",
    career_site: "robinhood.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Trading Platforms"
  },
  {
    name: "Interactive Brokers",
    hq: "Greenwich, CT",
    founded: 1978,
    focus: "Electronic trading platform",
    tech_stack: ["Java", "C++", "Python"],
    comp_range: "$150k new grad, $300k-600k experienced",
    career_site: "interactivebrokers.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Trading Platforms"
  },
  {
    name: "eToro",
    hq: "Tel Aviv, Israel",
    founded: 2007,
    valuation: "$8.8B",
    focus: "Social trading platform",
    tech_stack: ["Java", "Scala", "React", "Kafka"],
    comp_range: "$120k new grad, $250k-500k experienced",
    career_site: "etoro.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Trading Platforms"
  },
  {
    name: "Tradeweb",
    hq: "New York, NY",
    founded: 1996,
    market_cap: "$20B",
    focus: "Electronic trading platform",
    tech_stack: ["Java", "C++", "Python"],
    comp_range: "$160k new grad, $320k-650k experienced",
    career_site: "tradeweb.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Trading Platforms"
  },
  {
    name: "MarketAxess",
    hq: "New York, NY",
    founded: 2000,
    market_cap: "$10B",
    focus: "Electronic bond trading",
    tech_stack: ["Java", "Python", "React"],
    comp_range: "$150k new grad, $300k-600k experienced",
    career_site: "marketaxess.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Trading Platforms"
  },
  {
    name: "Betterment",
    hq: "New York, NY",
    founded: 2008,
    aum: "$35B+",
    focus: "Robo-advisor platform",
    tech_stack: ["Ruby", "React", "Python", "AWS"],
    comp_range: "$150k new grad, $300k-550k experienced",
    career_site: "betterment.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Wealth Management"
  },
  {
    name: "Wealthfront",
    hq: "Palo Alto, CA",
    founded: 2008,
    aum: "$30B+",
    focus: "Automated investing",
    tech_stack: ["Java", "Python", "React", "AWS"],
    comp_range: "$160k new grad, $320k-600k experienced",
    career_site: "wealthfront.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Wealth Management"
  },
  {
    name: "Carta",
    hq: "San Francisco, CA",
    founded: 2012,
    valuation: "$7.4B",
    focus: "Cap table management, equity",
    tech_stack: ["Python", "Django", "React", "PostgreSQL"],
    comp_range: "$170k new grad, $340k-650k experienced",
    career_site: "carta.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Equity Management"
  },
  {
    name: "AngelList",
    hq: "San Francisco, CA",
    founded: 2010,
    focus: "Startup investing platform",
    tech_stack: ["Ruby", "React", "PostgreSQL"],
    comp_range: "$160k new grad, $320k-600k experienced",
    career_site: "angellist.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Investment Platform"
  },
  {
    name: "Vise AI",
    hq: "New York, NY",
    founded: 2016,
    valuation: "$1B",
    focus: "AI-powered investment management",
    tech_stack: ["Python", "React", "TensorFlow", "AWS"],
    comp_range: "$180k new grad, $360k-700k experienced",
    career_site: "vise.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Investment Management"
  },
  {
    name: "Fireblocks",
    hq: "New York, NY",
    founded: 2018,
    valuation: "$8B",
    focus: "Digital asset custody",
    tech_stack: ["Go", "Python", "React", "Kubernetes"],
    comp_range: "$170k new grad, $340k-650k experienced",
    career_site: "fireblocks.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Crypto Infrastructure"
  },
  {
    name: "Anchorage Digital",
    hq: "San Francisco, CA",
    founded: 2017,
    valuation: "$3B",
    focus: "Crypto custody, banking",
    tech_stack: ["Go", "Python", "Rust", "React"],
    comp_range: "$180k new grad, $360k-700k experienced",
    career_site: "anchorage.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Crypto Infrastructure"
  },
  {
    name: "Alchemy",
    hq: "San Francisco, CA",
    founded: 2017,
    valuation: "$10B",
    focus: "Blockchain developer platform",
    tech_stack: ["TypeScript", "Go", "Rust", "React"],
    comp_range: "$180k new grad, $360k-700k experienced",
    career_site: "alchemy.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Blockchain Infrastructure"
  },
  {
    name: "Chainalysis",
    hq: "New York, NY",
    founded: 2014,
    valuation: "$8.6B",
    focus: "Blockchain analytics",
    tech_stack: ["Java", "Python", "React", "Kafka"],
    comp_range: "$160k new grad, $320k-650k experienced",
    career_site: "chainalysis.com/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "Blockchain Analytics"
  },
  {
    name: "0x Labs",
    hq: "San Francisco, CA",
    founded: 2016,
    focus: "DEX infrastructure",
    tech_stack: ["TypeScript", "Solidity", "Go", "React"],
    comp_range: "$170k new grad, $340k-700k experienced",
    career_site: "0x.org/careers",
    tier: "Tier 4",
    category: "Fintech Infrastructure",
    subcategory: "DeFi Infrastructure"
  }
];

// Tier 5: Market Data & Analytics (15 companies)
const marketDataProviders: FinanceCompany[] = [
  {
    name: "Bloomberg LP",
    hq: "New York, NY",
    founded: 1981,
    employees: "20,000+",
    focus: "Terminal, market data, analytics",
    tech_stack: ["C++", "JavaScript", "Python", "Proprietary"],
    comp_range: "$150k new grad, $300k-600k experienced",
    career_site: "bloomberg.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Data Providers"
  },
  {
    name: "Refinitiv (LSEG)",
    hq: "London, UK",
    founded: 2018,
    focus: "Market data, trading systems",
    tech_stack: ["C++", "Python", "Java", "Cloud"],
    comp_range: "$130k new grad, $260k-500k experienced",
    career_site: "refinitiv.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Data Providers"
  },
  {
    name: "S&P Global Market Intelligence",
    hq: "New York, NY",
    market_cap: "$120B",
    focus: "Financial data, analytics",
    tech_stack: ["Python", "Java", "AWS", "Snowflake"],
    comp_range: "$120k new grad, $240k-480k experienced",
    career_site: "spglobal.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Data Analytics"
  },
  {
    name: "FactSet",
    hq: "Norwalk, CT",
    founded: 1978,
    market_cap: "$15B",
    focus: "Financial data platform",
    tech_stack: ["C++", "Python", "JavaScript", "SQL"],
    comp_range: "$110k new grad, $220k-450k experienced",
    career_site: "factset.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Data Platforms"
  },
  {
    name: "MSCI",
    hq: "New York, NY",
    founded: 1969,
    market_cap: "$40B",
    focus: "Indexes, risk analytics",
    tech_stack: ["Python", "C++", "Java", "Cloud"],
    comp_range: "$120k new grad, $240k-500k experienced",
    career_site: "msci.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Risk Analytics"
  },
  {
    name: "Moody's Analytics",
    hq: "New York, NY",
    market_cap: "$60B",
    focus: "Risk assessment, analytics",
    tech_stack: ["Python", "R", "SAS", "Cloud"],
    comp_range: "$110k new grad, $220k-450k experienced",
    career_site: "moodys.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Risk Analytics"
  },
  {
    name: "Morningstar",
    hq: "Chicago, IL",
    founded: 1984,
    focus: "Investment research, data",
    tech_stack: ["C#", ".NET", "Python", "React"],
    comp_range: "$100k new grad, $200k-400k experienced",
    career_site: "morningstar.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Investment Research"
  },
  {
    name: "IHS Markit (S&P)",
    hq: "London, UK",
    focus: "Information services, analytics",
    tech_stack: ["Python", "Java", "Scala", "AWS"],
    comp_range: "$110k new grad, $220k-450k experienced",
    career_site: "ihsmarkit.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Data Analytics"
  },
  {
    name: "ICE Data Services",
    hq: "New York, NY",
    parent: "Intercontinental Exchange",
    focus: "Pricing, analytics, data",
    tech_stack: ["Python", "Java", "C++"],
    comp_range: "$130k new grad, $260k-520k experienced",
    career_site: "theice.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Pricing & Analytics"
  },
  {
    name: "Cboe Global Markets",
    hq: "Chicago, IL",
    market_cap: "$15B",
    focus: "Options exchange, market data",
    tech_stack: ["C++", "Java", "Python"],
    comp_range: "$140k new grad, $280k-550k experienced",
    career_site: "cboe.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Exchange Data"
  },
  {
    name: "Nasdaq Market Technology",
    hq: "New York, NY",
    focus: "Exchange technology, market data",
    tech_stack: ["C++", "Java", "Python", "FPGA"],
    comp_range: "$140k new grad, $280k-550k experienced",
    career_site: "nasdaq.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Exchange Technology"
  },
  {
    name: "London Stock Exchange Group",
    hq: "London, UK",
    market_cap: "$55B",
    focus: "Exchange, data, analytics",
    tech_stack: ["C++", "Python", "Java"],
    comp_range: "$120k new grad, $240k-500k experienced",
    career_site: "lseg.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Exchange Data"
  },
  {
    name: "CME Group",
    hq: "Chicago, IL",
    market_cap: "$70B",
    focus: "Derivatives exchange, clearing",
    tech_stack: ["C++", "Java", "Python"],
    comp_range: "$140k new grad, $280k-550k experienced",
    career_site: "cmegroup.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Derivatives Exchange"
  },
  {
    name: "Deutsche Börse",
    hq: "Frankfurt, Germany",
    focus: "Exchange, clearing, market data",
    tech_stack: ["Java", "C++", "Python"],
    comp_range: "$100k new grad, $200k-400k experienced",
    career_site: "deutsche-boerse.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Exchange Data"
  },
  {
    name: "Euronext",
    hq: "Amsterdam",
    focus: "Pan-European exchange",
    tech_stack: ["Java", "C++", "Python"],
    comp_range: "$90k new grad, $180k-380k experienced",
    career_site: "euronext.com/careers",
    tier: "Tier 5",
    category: "Market Data",
    subcategory: "Exchange Data"
  }
];

// Function to transform company data to match database schema
function transformCompanyData(company: FinanceCompany, rank: number): any {
  const domain = company.career_site.split('/')[0].replace('www.', '');

  return {
    name: company.name,
    industry: `Finance - ${company.category}`,
    size: company.employees,
    location: company.hq,
    description: `${company.focus}\n\nCompensation: ${company.comp_range}\nTier: ${company.tier}`,
    website: `https://${domain}`,
    founded: company.founded?.toString() || null,
    funding: company.valuation || company.market_cap || null,
    technologies: company.tech_stack || [],
    benefits: {
      compensation: company.comp_range,
      culture_notes: company.culture,
      tier: company.tier,
      category: company.category,
      subcategory: company.subcategory,
      aum: company.aum
    },
    culture: company.culture || '',
    hiring: true,
    remote: false,
    internship: true,
    entryLevel: true
  };
}

// Combine all companies (exactly 100)
const allFinanceCompanies = [
  ...quantTradingElite,    // 25 companies
  ...propTradingFirms,     // 20 companies
  ...cryptoTradingFirms,   // 15 companies
  ...fintechInfrastructure, // 25 companies
  ...marketDataProviders   // 15 companies
];

export async function seedFinanceCompanies() {
  try {
    console.log('Starting to seed finance companies...');
    console.log(`Total companies to seed: ${allFinanceCompanies.length}`);

    // Transform and insert companies
    const companiesData = allFinanceCompanies.map((comp, index) =>
      transformCompanyData(comp, index + 1)
    );

    // Insert in batches to avoid potential issues
    const batchSize = 20;
    for (let i = 0; i < companiesData.length; i += batchSize) {
      const batch = companiesData.slice(i, i + batchSize);
      await db.insert(company).values(batch);
      console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(companiesData.length/batchSize)}`);
    }

    console.log(`Successfully seeded ${allFinanceCompanies.length} finance companies`);
    return { success: true, count: allFinanceCompanies.length };
  } catch (error) {
    console.error('Error seeding finance companies:', error);
    throw error;
  }
}

// Export for manual execution
export { allFinanceCompanies };

// If running directly
if (require.main === module) {
  seedFinanceCompanies()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}