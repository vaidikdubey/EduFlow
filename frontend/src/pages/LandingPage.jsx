import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  CreditCard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Code2,
  QrCode,
  Layers,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

const SIGN_IN_URL = "https://eduflow-campus.vercel.app/signin";
const SIGN_UP_URL = "https://eduflow-campus.vercel.app/signup";

export default function EduFlowLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo Link to Hero */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Edu<span className="text-primary">Flow</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#certification" className="hover:text-foreground transition-colors">Certification</a>
            <a href="#techstack" className="hover:text-foreground transition-colors">Tech Stack</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href={SIGN_IN_URL}
              className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </a>
            <a
              href={SIGN_UP_URL}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-4 space-y-3">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">Features</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">Architecture</a>
            <a href="#certification" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">Certification</a>
            <a href="#techstack" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">Tech Stack</a>
            <div className="pt-2 flex flex-col gap-2">
              <a href={SIGN_IN_URL} className="w-full text-center py-2 text-sm font-medium border border-border rounded-lg">Sign In</a>
              <a href={SIGN_UP_URL} className="w-full text-center py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg">Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-b from-background via-muted/20 to-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Full-Stack LMS Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Simulate modern <span className="text-primary">EdTech Workflows</span> effortlessly.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                A role-based Learning Management System designed with clean backend architecture, secure JWT authorization, integrated Razorpay payments, and automated QR-verified PDF certificates.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href={SIGN_UP_URL}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg shadow-md hover:opacity-90 transition-opacity"
                >
                  Start Learning Now <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={SIGN_IN_URL}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border bg-card font-medium rounded-lg hover:bg-muted/50 transition-colors"
                >
                  Instructor Login
                </a>
              </div>
            </div>

            {/* Platform Preview Card */}
            <div className="relative">
              <div className="relative bg-card border border-border rounded-xl shadow-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground font-bold">
                      JS
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Full-Stack Web Engineering</h4>
                      <p className="text-xs text-muted-foreground">Instructor: Alex Rivera</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground font-medium">
                    Enrolled
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Course Completion Progress</span>
                    <span className="text-primary font-bold">100%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-muted/30 border border-border rounded-lg text-left">
                    <p className="text-xs text-muted-foreground">Modules Completed</p>
                    <p className="text-lg font-bold">8 / 8</p>
                  </div>
                  <div className="p-3 bg-muted/30 border border-border rounded-lg text-left">
                    <p className="text-xs text-muted-foreground">Quiz Avg Score</p>
                    <p className="text-lg font-bold text-accent-foreground">96%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <QrCode className="w-4 h-4 text-primary" /> Certificate Ready
                  </div>
                  <span className="text-xs text-primary font-semibold underline cursor-pointer">Download PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Engineered for Learning & Creation</h2>
            <p className="mt-4 text-muted-foreground">
              A comprehensive suite of role-specific workflows built to mirror production SaaS platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<UserCheck className="w-6 h-6 text-primary" />}
              title="Role-Based Access Control"
              description="Dedicated workflows for Students, Instructors, and Admins powered by secure JWT authentication and protected routing."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-primary" />}
              title="Drag & Drop Course Builder"
              description="Instructors easily structure modules and reorder lessons with video links, rich markdown text, and PDF assets."
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6 text-primary" />}
              title="Razorpay Payment Gateway"
              description="Seamless checkout process supporting free instantly-accessible courses alongside paid tier enrollments."
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6 text-primary" />}
              title="Auto-Graded Quizzes"
              description="Interactive MCQ-style quizzes per module with instant scoring, attempt histories, and performance tracking."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-primary" />}
              title="Analytical Dashboards"
              description="Real-time metric monitoring for course progress, enrollment figures, student performance, and completion rates."
            />
            <FeatureCard
              icon={<Award className="w-6 h-6 text-primary" />}
              title="Verified PDF Certificates"
              description="Automatic certificate generation upon 100% course completion with embedded QR codes for instant verification."
            />
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section id="certification" className="py-20 bg-muted/20 border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Automated Credentials</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Instant QR-Verified Certificates</h2>
              <p className="text-muted-foreground leading-relaxed">
                Upon reaching 100% course completion, EduFlow automatically generates an official PDF certificate. Embedded with a unique Certificate ID and QR code, credential authenticity can be validated instantly by employers or institutions.
              </p>
              <ul className="space-y-3">
                {['Dynamic PDF Generation via PDFKit', 'Unique Certificate ID Generation', 'Embedded QR Code Verification Link', 'Student & Course Metadata Rendering'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-card border border-border rounded-xl shadow-lg relative flex flex-col justify-between aspect-[1.4/1]">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <span className="font-bold tracking-tight">EduFlow Academy</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">ID: EDU-2026-9842</span>
              </div>
              <div className="my-auto space-y-2 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Certificate of Completion</p>
                <h3 className="text-xl font-bold">Full-Stack Development with Node.js</h3>
                <p className="text-xs text-muted-foreground">Awarded to <span className="font-semibold text-foreground">John Doe</span></p>
              </div>
              <div className="flex justify-between items-end border-t border-border pt-4">
                <div className="text-[10px] text-muted-foreground">
                  <p>Issue Date: September 15, 2026</p>
                  <p>Status: Verified</p>
                </div>
                <div className="p-1 bg-white border rounded">
                  <QrCode className="w-10 h-10 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section id="techstack" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built with Modern Tech Stack</h2>
            <p className="mt-4 text-muted-foreground">
              Designed for performance, scale, and clean separation of concerns.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TechCard category="Frontend" items={['Vite & React', 'Tailwind CSS', 'Zustand State', 'dnd-kit Sortable']} />
            <TechCard category="Backend" items={['Node.js & Express', 'JWT Authentication', 'RESTful API Architecture', 'PDFKit & QRCode']} />
            <TechCard category="Database" items={['PostgreSQL', 'Prisma ORM', 'Relational Schemas', 'Optimized Queries']} />
            <TechCard category="Services & Security" items={['Razorpay Gateway', 'Mailtrap SMTP', 'Bcrypt Password Hashing', 'Protected Middleware']} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to test the EduFlow experience?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-base sm:text-lg">
            Join as a student to explore interactive learning or sign up as an instructor to design structured courses and track student performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={SIGN_UP_URL}
              className="px-8 py-3 bg-background text-foreground font-semibold rounded-lg shadow-md hover:bg-muted transition-colors"
            >
              Create Free Account
            </a>
            <a
              href={SIGN_IN_URL}
              className="px-8 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/20 transition-colors"
            >
              Sign In to Platform
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <a href="#hero" className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-tight">EduFlow</span>
          </a>
          <p className="text-xs text-muted-foreground text-center">
            &copy; 2026 EduFlow. Built for real-world EdTech workflows.
          </p>
          <div className="flex gap-4 text-xs font-medium text-muted-foreground">
            <a href={SIGN_IN_URL} className="hover:text-foreground">Sign In</a>
            <a href={SIGN_UP_URL} className="hover:text-foreground">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-3">
      <div className="p-2.5 rounded-lg bg-primary/10 w-fit">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function TechCard({ category, items }) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">{category}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            <Code2 className="w-4 h-4 text-muted-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}