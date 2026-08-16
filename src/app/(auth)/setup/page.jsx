'use client';

import React from 'react';
import { SetupStepWizard } from '@/components/organisms/setup/SetupStepWizard.jsx';
import { useCompleteSetupMutation } from '@/store/services/setupApi';

export default function SetupPage() {
  const [completeSetup] = useCompleteSetupMutation();

  const handleComplete = async (data) => {
    await completeSetup(data).unwrap();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <SetupStepWizard onComplete={handleComplete} />
    </div>
  );
}
