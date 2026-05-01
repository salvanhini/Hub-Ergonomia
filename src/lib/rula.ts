/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RulaInput, RulaScore } from '../types';

// Simplified RULA Score Calculation logic for demonstration
// In a real production app, these would be lookup tables as per the official method
export function calculateRula(input: RulaInput): RulaScore {
  const {
    upperArm, forearm, wrist, wristTwist,
    neck, trunk, legs,
    muscleUse, forceLoad
  } = input;

  // Group A Score (Arms/Wrist)
  let scoreA = (upperArm + forearm + wrist + wristTwist) / 2; // Approximation
  scoreA += muscleUse + forceLoad;

  // Group B Score (Neck/Trunk/Legs)
  let scoreB = (neck + trunk + legs) / 2; // Approximation
  scoreB += muscleUse + forceLoad;

  // Final Score (Combined A and B)
  // Standard RULA table C output
  let finalScore = Math.ceil((scoreA + scoreB) / 1.5);
  
  // Clamp score between 1 and 7
  finalScore = Math.max(1, Math.min(7, finalScore));

  let actionLevel = 1;
  let recommendation = "";

  if (finalScore <= 2) {
    actionLevel = 1;
    recommendation = "Postura aceitável se não for mantida ou repetida por longos períodos.";
  } else if (finalScore <= 4) {
    actionLevel = 2;
    recommendation = "Investigação adicional é necessária; mudanças podem ser requeridas.";
  } else if (finalScore <= 6) {
    actionLevel = 3;
    recommendation = "Investigação e mudanças são necessárias em breve.";
  } else {
    actionLevel = 4;
    recommendation = "Investigação e mudanças são necessárias imediatamente.";
  }

  return {
    score: finalScore,
    actionLevel,
    recommendation
  };
}
