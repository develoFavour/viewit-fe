'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes.const';
import {
  Box,
  Layers,
  Zap,
  Shield,
  ArrowRight,
  MousePointer2,
  Smartphone,
  Globe,
  Plus,
  User,
  Target,
  BadgeCheck,
  Upload,
  Store,
  ScanSearch,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const workflowSteps = [
    {
      icon: User,
      eyebrow: '01 Merchant Signup',
      title: 'Create a merchant account and claim your studio.',
      description:
        'Merchants register with their name, email, business name, password, and custom store slug to create a branded ViewIt studio.',
    },
    {
      icon: BadgeCheck,
      eyebrow: '02 Verification',
      title: 'Verify the account before entering the dashboard.',
      description:
        'A verification email activates the merchant account, signs the merchant in, and unlocks access to the product workspace.',
    },
    {
      icon: Upload,
      eyebrow: '03 Product Creation',
      title: 'Upload product media and attach a 3D model.',
      description:
        'Inside the merchant studio, products are created with photos, pricing, category details, publishing controls, and an optional .glb model for immersive viewing.',
    },
    {
      icon: Plus,
      eyebrow: '04 Interactive Story',
      title: 'Enhance the 3D product with hotspots and story layers.',
      description:
        'Merchants can add interactive hotspots to the 3D model so buyers and curators discover product details directly inside the experience.',
    },
    {
      icon: Globe,
      eyebrow: '05 Live Storefront',
      title: 'Publish the product to a public store page.',
      description:
        'Once published, each product becomes visible through the merchant store and marketplace, ready for exploration across browsers and supported AR surfaces.',
    },
    {
      icon: MousePointer2,
      eyebrow: '06 Buyer Experience',
      title: 'Curators and buyers view the product in 3D.',
      description:
        'Shoppers can open the product page, rotate the 3D model, inspect gallery images, launch AR-compatible viewing, and interact with hotspots in real time.',
    },
    {
      icon: BarChart3,
      eyebrow: '07 Admin Analytics',
      title: 'Admins measure AR engagement and product interaction.',
      description:
        'The system can track how many AR experiences were launched, how many product views happened, and how many hotspot clicks buyers made across the storefront.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 selection:bg-white selection:text-black font-sans overflow-hidden">

      {/* Centered Pill Navigation (from referenced image) */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/[0.05] rounded-full px-8 h-14 flex items-center justify-between w-full max-w-4xl shadow-2xl">
        <Link href="/" className="flex items-center space-x-2 mr-10">
          <Box className="h-5 w-5 text-white" />
          <span className="text-sm font-black tracking-tighter text-white">ViewIt</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
          <Link href="/marketplace" className="flex items-center space-x-2 hover:text-white transition-colors">
            <span>Marketplace</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex items-center space-x-6 ml-10">
          <Link href={ROUTES.AUTH.LOGIN} className="text-[11px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-all">
            Login
          </Link>
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all"
          >
            <User className="h-3 w-3 mr-1" />
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-52 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Floating Data Points (mimicking the node lines from the image) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left Node */}
          <div className="absolute top-[20%] left-[20%] flex flex-col items-start hidden lg:flex">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-6 border-b-white" />
              </div>
              <div className="h-[1px] w-24 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <p className="text-gray-400 text-xs font-medium tracking-widest ml-11">• Spatial</p>
            <p className="text-gray-600 text-[10px] ml-11">120 FPS</p>
          </div>

          {/* Center Right Node */}
          <div className="absolute top-[35%] right-[20%] flex flex-col items-end hidden lg:flex">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-[1px] w-24 bg-gradient-to-l from-white/20 to-transparent" />
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-xs font-medium tracking-widest mr-11">• Engine</p>
            <p className="text-gray-600 text-[10px] mr-11">Active</p>
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.04] blur-[100px] rounded-[100%] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0fa37f]/[0.02] blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 px-4 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full mb-8 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Unlock your store's dimension &rarr;</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-[1.1] text-white"
          >
            One-click for <br className="hidden md:block" /> Spatial Commerce
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed mb-12"
          >
            Dive into visual commerce, where innovative spatial WebXR technology seamlessly meets dynamic digital retail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="group flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold rounded-full transition-all backdrop-blur-sm"
            >
              Open Studio
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#workflow"
              className="flex items-center justify-center px-8 py-4 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-full transition-all"
            >
              How ViewIt Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* Brands / Integrations Footer bar (like the image) */}
      <section className="py-12 border-t border-white/[0.03] bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-40 grayscale">
          {['Vercel', 'Stripe', 'Three.js', 'Next.js', 'WebGL', 'React Space'].map(brand => (
            <span key={brand} className="text-xl font-bold tracking-tight text-white">{brand}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-black relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: "App-Less AR Tracking",
                desc: "No downloads needed. Customers tap to view interactive 3D assets mapped perfectly to their real-world environment."
              },
              {
                icon: Layers,
                title: "Multi-Tenant Infrastructure",
                desc: "Secure, isolated studio environments. Manage your 3D pipeline, webhooks, and visual analytics."
              },
              {
                icon: Target,
                title: "Spatial Analytics",
                desc: "Observe real user engagement. Track rotation dwell-times and specific hotspot interaction rates."
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-[#0a0a0c] border border-white/[0.04] hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-colors duration-500 text-gray-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="py-32 px-6 bg-[#050505] relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">System Flow</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-[1.05]">
              A full walkthrough of how ViewIt works.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
              ViewIt connects merchant onboarding, product publishing, immersive product discovery, and engagement analytics in one flow. Merchants create a studio, verify access, upload products and 3D assets, then buyers and curators explore those products in an interactive spatial storefront while admins monitor interaction performance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <div className="rounded-[36px] bg-[#0a0a0c] border border-white/[0.05] p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {workflowSteps.map((step, index) => (
                  <div
                    key={step.eyebrow}
                    className="rounded-[28px] bg-white/[0.02] border border-white/[0.04] p-7 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-300">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.25em]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.22em] mb-3">
                      {step.eyebrow}
                    </p>
                    <h3 className="text-xl text-white font-medium tracking-tight mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[36px] bg-[#0a0a0c] border border-white/[0.05] p-8 md:p-10">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white mb-6">
                  <Store className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.22em] mb-3">
                  Merchant Journey
                </p>
                <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                  From account creation to 3D-ready publishing.
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The merchant flow in this project starts at registration, continues through email verification, then moves into product setup where media, pricing, publishing status, and `.glb` files are managed from the studio dashboard.
                </p>
              </div>

              <div className="rounded-[36px] bg-[#0a0a0c] border border-white/[0.05] p-8 md:p-10">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white mb-6">
                  <ScanSearch className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.22em] mb-3">
                  Buyer / Curator Journey
                </p>
                <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                  Explore the product visually before making a decision.
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Buyers and curators reach products through the marketplace or a merchant store page, then switch into 3D view, inspect details, engage with hotspots, and use AR-enabled viewing when a model is available.
                </p>
                <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.04] p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.22em]">Why This Matters</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    This flow helps merchants present products with more context and helps buyers evaluate form, detail, and fit through a more immersive viewing experience than static images alone.
                  </p>
                </div>
              </div>

              <div className="rounded-[36px] bg-[#0a0a0c] border border-white/[0.05] p-8 md:p-10">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white mb-6">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.22em] mb-3">
                  Admin Insights
                </p>
                <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                  The best place to show AR views, product views, and hotspot clicks.
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  This fits naturally in the admin or merchant analytics dashboard because that is where platform performance is reviewed. It can summarize total AR experiences launched, overall product page views, and hotspot click activity per product or per merchant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.02] mix-blend-screen pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 p-20 rounded-[48px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Refine your digital storefront.
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Deploy an immersive spatial experience for your buyers today. Sign up and initialize your catalog in minutes.
          </p>
          <div className="flex justify-center">
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-gray-200 transition-all"
            >
              Initialize Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/[0.05] bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-white" />
            <div className="text-sm font-black tracking-tight text-white">ViewIt</div>
          </div>
          <div className="flex space-x-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
