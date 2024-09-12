/* eslint-disable react/no-unescaped-entities */
'use client';
import { useRouter } from 'next/navigation';

import {
  ArrowRightIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from './contexts/AuthContext';
import Image from 'next/image';
import whiteboardWriting from '@/assets/generating-programming.gif';
import gymWhiteboard from '@/assets/configure-gym.gif';
import customizeProgram from '@/assets/customize-program.png';

export default function HomePage() {
  const { session, supabase } = useAuth();

  const router = useRouter();
  const push = () => {
    if (session) {
      router.refresh();
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const Feature = ({ icon, title, description }) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      {icon}
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 text-center">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Elevate Your Fitness Programming with HalteresAI
          </h1>
          <p className="text-xl mb-8">
            AI-Powered, Personalized Workouts for CrossFit Gyms, Coaches, and
            Health Professionals
          </p>
          <button
            onClick={() => push('/dashboard')}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
          >
            Get Started!
          </button>
        </div>
      </section>

      {/* Why HalteresAI is Great */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The HalteresAI Advantage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<LightBulbIcon className="h-12 w-12 text-blue-500" />}
              title="Unparalleled Personalization"
              description="Our AI adapts to your gym's unique equipment, class schedule, and member profiles for truly tailored programming."
            />
            <Feature
              icon={<CurrencyDollarIcon className="h-12 w-12 text-blue-500" />}
              title="Exceptional Value"
              description="High-quality, customized programming that fits your budget, maximizing your return on investment."
            />
            <Feature
              icon={<ClockIcon className="h-12 w-12 text-blue-500" />}
              title="Time-Saving Efficiency"
              description="Spend less time planning and more time coaching. Let our AI handle the programming details."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tailored for Fitness Professionals
          </h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-semibold mb-2">
                  1. Comprehensive Setup
                </h3>
                <p>
                  Input your facility's details, equipment inventory, and class
                  schedule. HalteresAI considers everything from your bikes to
                  your highest rig.
                </p>
              </div>
              <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md">
                <Image
                  src={gymWhiteboard}
                  alt="Interior of a well-equipped CrossFit gym"
                  width={500}
                  height={300}
                  layout="responsive"
                  className="rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-4 md:mb-0 md:pl-8">
                <h3 className="text-2xl font-semibold mb-2">
                  2. AI-Powered Workout Creation
                </h3>
                <p>
                  Our advanced algorithms create varied, challenging workouts
                  that align with proven methodologies while considering your
                  facility's unique factors.
                </p>
              </div>
              <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md">
                <Image
                  src={whiteboardWriting}
                  alt="Coach writing workout on whiteboard"
                  width={500}
                  height={300}
                  layout="responsive"
                  className="rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-semibold mb-2">
                  3. Intuitive Customization
                </h3>
                <p>
                  Fine-tune generated workouts with our user-friendly interface.
                  Adjust for specific goals, competitions, or individual needs
                  with ease.
                </p>
              </div>
              <div className="md:w-1/2 bg-white p-4 rounded-lg shadow-md">
                <Image
                  src={customizeProgram}
                  alt="HalteresAI program customization interface"
                  width={500}
                  height={300}
                  layout="responsive"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Fitness Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="italic mb-4">
                "HalteresAI has revolutionized our gym's programming. We're
                saving time, money, and our members are seeing better results
                than ever."
              </p>
              <p className="font-semibold">- Sarah J., Gym Owner</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="italic mb-4">
                "As a physical therapist, HalteresAI helps me create rehab
                programs that seamlessly integrate with functional fitness
                methodologies. It's a game-changer."
              </p>
              <p className="font-semibold">
                - Dr. Mike T., Sports Physical Therapist
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Fitness Programming?
          </h2>
          <p className="text-xl mb-8">
            Join HalteresAI today and experience AI-powered, personalized
            workouts that will elevate your coaching.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 inline-flex items-center">
            Start Your Free 14-Day Trial
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
          <p className="mt-4 text-sm">
            No credit card required. Experience the future of fitness
            programming risk-free.
          </p>
        </div>
      </section> */}
    </div>
  );
}
