'use client';
import { useState } from 'react';
import Metcon from '../../components/Metcon';
import Office from '../../components/Office';
import Whiteboard from '../../components/Whiteboard';

export default function EditProgram({ params }) {
  const [step, setStep] = useState(0);

  const steps = [
    { name: 'Customize Program', component: Whiteboard },
    { name: 'Configure Gym', component: Office },
    { name: 'Write Programming', component: Metcon },
  ];

  const CurrentStepComponent = steps[step].component;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="w-full mb-8">
        <ul className="steps steps-horizontal sm:steps-horizontal w-full">
          {steps.map((s, index) => (
            <li
              key={index}
              className={`step cursor-pointer ${
                step >= index ? 'step-primary' : ''
              }`}
              onClick={() => setStep(index)}
            >
              <span className="text-sm sm:text-base">
                {index + 1}. {s.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <CurrentStepComponent setStep={setStep} params={params} />
      </div>
    </div>
  );
}
