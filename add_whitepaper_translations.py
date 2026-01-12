#!/usr/bin/env python3
"""
Script to add whitepaper translations to all language files.
This script will append the whitepaper section to each language file.
"""

import json
import os

# Base directory
base_dir = "/Users/marcangeloh/Desktop/ShieldNetwork/Frontend/Target BC/src/i18n/locales"

# English template (already added)
en_template = {
    "whitepaper": {
        "badge": "Whitepaper v1.0",
        "hero": {
            "title": "The 5-Dimensional",
            "subtitle": "Security Audit Framework",
            "description": "Discover how Spectra revolutionizes blockchain security through comprehensive multi-dimensional analysis, providing deeper insights than traditional audits ever could.",
            "buttons": {
                "exploreDimensions": "Explore Dimensions",
                "scoringAlgorithm": "Scoring Algorithm",
                "viewRoadmap": "View Roadmap"
            }
        },
        "introduction": {
            "title": "Why Multi-Dimensional Analysis?",
            "paragraph1": "Traditional smart contract audits focus exclusively on code security. While important, this single-lens approach misses critical risk factors that lead to most DeFi exploits and project failures.",
            "paragraph2": "Spectra's 5-dimensional audit framework analyzes projects comprehensively across sentiment, code, tokenomics, liquidity, and distribution—providing a complete security picture that protects investors from threats code audits alone cannot detect.",
            "stats": {
                "coreDimensions": {"value": "5", "label": "Core Dimensions"},
                "detectionRate": {"value": "95%", "label": "Detection Rate"},
                "analysisTime": {"value": "<30s", "label": "Analysis Time"},
                "riskCategories": {"value": "15+", "label": "Risk Categories"}
            }
        },
        "dimensions": {
            "title": "The 5 Dimensions",
            "subtitle": "Each dimension provides unique insights. Together, they deliver complete security intelligence.",
            "convergeLabel": "5 dimensions converge",
            "scoreDisplay": {
                "score": "95",
                "label": "Security Score",
                "excellent": "Excellent"
            },
            "weightDistribution": {
                "title": "Weight Distribution",
                "totalLabel": "Total:",
                "totalValue": "100%"
            },
            "items": {
                "sentiment": {
                    "name": "Sentiment Analysis",
                    "shortName": "Sentiment",
                    "description": "AI-powered analysis of community sentiment across social platforms, forums, and developer discussions.",
                    "details": {
                        "socialVolume": "Social volume tracking",
                        "sentimentScoring": "Sentiment scoring",
                        "influencerAnalysis": "Influencer analysis",
                        "communityHealth": "Community health index",
                        "fudFomoDetection": "FUD/FOMO detection"
                    },
                    "weight": 15
                },
                "code": {
                    "name": "Code Security",
                    "shortName": "Code",
                    "description": "Deep static and dynamic analysis of smart contract code to identify vulnerabilities and security patterns.",
                    "details": {
                        "vulnerabilityDetection": "Vulnerability detection",
                        "codeQuality": "Code quality scoring",
                        "auditVerification": "Audit report verification",
                        "dependencyAnalysis": "Dependency analysis",
                        "bestPractices": "Best practices check"
                    },
                    "weight": 30
                },
                "tokenomics": {
                    "name": "Tokenomics Health",
                    "shortName": "Tokenomics",
                    "description": "Comprehensive evaluation of token distribution, vesting schedules, inflation mechanics, and economic sustainability.",
                    "details": {
                        "supplyDistribution": "Supply distribution",
                        "vestingAnalysis": "Vesting analysis",
                        "inflationRates": "Inflation rates",
                        "economicModel": "Economic model validation",
                        "unlockSchedule": "Unlock schedule tracking"
                    },
                    "weight": 20
                },
                "liquidity": {
                    "name": "Liquidity Depth",
                    "shortName": "Liquidity",
                    "description": "Real-time assessment of liquidity pools, trading volumes, slippage tolerance, and market depth across DEXs.",
                    "details": {
                        "poolDepth": "Pool depth analysis",
                        "volumeTrends": "Volume trends",
                        "slippageCalc": "Slippage calculation",
                        "dexCoverage": "DEX coverage",
                        "liquidityConcentration": "Liquidity concentration"
                    },
                    "weight": 20
                },
                "distribution": {
                    "name": "Distribution Analysis",
                    "shortName": "Distribution",
                    "description": "Evaluation of token holder concentration, whale activity, airdrop distributions, and decentralization metrics.",
                    "details": {
                        "holderConcentration": "Holder concentration",
                        "whaleTracking": "Whale tracking",
                        "decentralizationScore": "Decentralization score",
                        "airdropAnalysis": "Airdrop analysis",
                        "walletDistribution": "Wallet distribution"
                    },
                    "weight": 15
                }
            }
        },
        "scoring": {
            "badge": "Algorithm",
            "title": "AI-Optimized Security Score Calculation",
            "subtitle": "Our scoring algorithm uses dynamic weighted averages, continuously fine-tuned by machine learning for maximum predictive accuracy.",
            "formula": {
                "title": "Security Score Formula",
                "formula": "Score = Σ (Dimensionᵢ × Weightᵢ × AdjustmentFactorᵢ)",
                "dynamicWeights": "Dynamic Weights",
                "aiAdjustments": "AI Adjustments",
                "accuracy": "Accuracy"
            },
            "weightDistribution": {
                "title": "Dynamic Weight Distribution",
                "description": "Base weights are assigned to each dimension based on historical impact analysis:"
            },
            "aiOptimization": {
                "title": "AI Optimization Layer",
                "description": "Machine learning models continuously refine weights based on:",
                "factors": {
                    "exploitPatterns": "Exploit pattern analysis",
                    "marketCorrelation": "Market condition correlation",
                    "projectCategorization": "Project type categorization",
                    "threatIntelligence": "Real-time threat intelligence",
                    "communityFeedback": "Community feedback integration"
                }
            },
            "calculationExample": {
                "title": "Calculation Example",
                "comment": "// Example: Project with varying dimension scores",
                "baseScore": "Base Score:",
                "aiAdjustment": "AI Adjustment:",
                "aiEnhancedTitle": "AI-Enhanced Accuracy",
                "aiEnhancedDescription": "The AI adjustment factor considers cross-dimensional correlations, project maturity, market conditions, and real-time threat data to provide a score that better reflects true security risk."
            }
        },
        "howItWorks": {
            "title": "How It Works",
            "subtitle": "Our AI-powered system continuously monitors and analyzes projects across all dimensions.",
            "steps": {
                "dataCollection": {
                    "title": "1. Data Collection",
                    "description": "Real-time ingestion of on-chain data, social signals, code repositories, and market data."
                },
                "aiAnalysis": {
                    "title": "2. AI Analysis",
                    "description": "Advanced ML models process data across all 5 dimensions with dynamic weight optimization."
                },
                "riskScoring": {
                    "title": "3. Risk Scoring",
                    "description": "AI-optimized weighted scores with verifiable evidence provide complete security assessment."
                }
            }
        },
        "roadmap": {
            "title": "Product Roadmap",
            "subtitle": "Our journey to expand security intelligence with new dimensions and enhanced research capabilities.",
            "phases": {
                "q1_2025": {
                    "phase": "Q1 2025",
                    "title": "Foundation",
                    "items": [
                        "Launch 5-dimensional audit system",
                        "Integrate major blockchain networks",
                        "Deploy real-time monitoring infrastructure",
                        "Establish security partnerships"
                    ]
                },
                "q2_2025": {
                    "phase": "Q2 2025",
                    "title": "Enhancement",
                    "items": [
                        "Add Governance dimension analysis",
                        "Introduce cross-chain bridge security",
                        "Launch API for enterprise integration",
                        "Mobile application release"
                    ]
                },
                "q3_2025": {
                    "phase": "Q3 2025",
                    "title": "Expansion",
                    "items": [
                        "Insurance risk dimension",
                        "Regulatory compliance checks",
                        "Advanced ML-based threat prediction",
                        "Community governance features"
                    ]
                },
                "q4_2025": {
                    "phase": "Q4 2025+",
                    "title": "Evolution",
                    "items": [
                        "Additional research dimensions based on market needs",
                        "Enhanced AI research factor optimization",
                        "Decentralized audit network",
                        "Real-time exploit prevention system"
                    ]
                }
            },
            "status": {
                "completed": "Completed",
                "inProgress": "In Progress",
                "upcoming": "Upcoming"
            },
            "expansion": {
                "title": "Continuous Expansion",
                "description": "Beyond Q4 2025, we are committed to continuously adding new research dimensions and enhanced analysis factors based on emerging market needs, technological advancements, and community feedback. Our framework is designed to evolve with the blockchain ecosystem."
            }
        },
        "cta": {
            "title": "Ready for Deeper Security Insights?",
            "description": "Experience the power of 5-dimensional analysis with AI-optimized scoring. Get comprehensive security audits in under 30 seconds.",
            "button": "Start Your First Audit"
        }
    }
}

print("Whitepaper translation structure prepared successfully!")
print("Note: This script prepares the structure. Manual translation is needed for each language.")
