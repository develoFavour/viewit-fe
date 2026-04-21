'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Package, 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { post } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface SetupWizardProps {
  onComplete: () => void;
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [details, setDetails] = useState({
    businessName: '',
    description: '',
    logo: ''
  });

  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate/Update merchant store details
      // await post(ENDPOINTS.MERCHANT.UPDATE_PROFILE, details);
      toast.success('Studio setup complete!');
      onComplete();
    } catch (e) {
      toast.error('Finishing setup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Brand Identity', icon: Building2 },
    { title: 'Store Details', icon: Package },
    { title: 'Launch', icon: Rocket },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0f1115] border border-gray-800 rounded-[40px] overflow-hidden shadow-2xl relative">
        {/* Progress Header */}
        <div className="flex border-b border-gray-800">
          {steps.map((s, i) => (
            <div 
              key={i}
              className={cn(
                "flex-1 py-6 flex flex-col items-center space-y-2 border-b-2 transition-all",
                step > i + 1 ? "border-emerald-500 text-emerald-500" : 
                step === i + 1 ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600"
              )}
            >
              <s.icon className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Step into your Studio</h2>
                  <p className="text-gray-400">First, let's establish your brand identity in the AR marketplace.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Business Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Fuzcore Design Hub"
                      className="w-full bg-[#1a1d23] border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      value={details.businessName}
                      onChange={(e) => setDetails({ ...details, businessName: e.target.value })}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Studio Logo</label>
                    <div className="w-full h-32 bg-[#1a1d23] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-all group">
                      <ImageIcon className="h-8 w-8 text-gray-600 group-hover:text-blue-500 mb-2 transition-colors" />
                      <span className="text-xs text-gray-500 font-bold uppercase">Upload Emblem</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">What do you build?</h2>
                  <p className="text-gray-400">Provide a brief description of your product specialization.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your 3D craftsmanship..."
                    className="w-full bg-[#1a1d23] border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    value={details.description}
                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">System Operational</h2>
                  <p className="text-gray-400">Your AR Studio is configured and ready for deployment. Time to ignite your catalog.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between">
            <button 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="text-gray-500 hover:text-white font-bold text-sm disabled:opacity-0"
            >
              Back
            </button>
            <button 
              onClick={step === 3 ? handleSubmit : nextStep}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center shadow-2xl shadow-blue-900/40 active:scale-95 transition-all"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 
               step === 3 ? 'Launch Studio' : 'Next Step'}
              {step !== 3 && <ArrowRight className="h-5 w-5 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
