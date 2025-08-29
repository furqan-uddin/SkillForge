import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Bot,
    Tally4,
    Layers,
    MessagesSquare,
    ArrowRight,
    User,
    Brain,
    Target,
    Sparkles,
    Briefcase,
    Zap,
    Gauge,
    Sparkle,
} from "lucide-react";
import illustration from "../assets/img.png";

const features = [
    {
        name: "Resume Analyzer",
        description: "Upload your resume and let AI analyze strengths and weaknesses instantly.",
        icon: FileText,
        link: "/resume-analyzer",
    },
    {
        name: "AI Roadmap",
        description: "Get a personalized career roadmap tailored to your interests and skills.",
        icon: Bot,
        link: "/ai-roadmap",
    },
    {
        name: "JD Matcher",
        description: "See how well your resume matches job descriptions and missing keywords.",
        icon: Tally4,
        link: "/jd-matcher",
    },
    {
        name: "Skill Gap Analysis",
        description: "Identify missing skills based on your resume and career interests.",
        icon: Layers,
        link: "/skill-gap",
    },
    {
        name: "Interview Prep",
        description: "Practice with AI-driven interview simulations and smart Q&A.",
        icon: MessagesSquare,
        link: "/interview-prep",
    },
    {
        name: "Performance Dashboard",
        description: "Track your progress and key metrics on your career journey.",
        icon: Gauge,
        link: "/dashboard",
    },
];

const howItWorks = [
    { step: "Profile Setup", description: "Add your details, resume, and career interests.", icon: User },
    { step: "AI Career Hub", description: "Get roadmaps, track progress, and receive AI insights.", icon: Brain },
    { step: "Preparation Tools", description: "Use JD Matcher, Interview Prep, and Skill Gap Analyzer.", icon: Target },
];

const whyUs = [
    {
        title: "Personalized Journeys",
        description: "Our AI creates a unique roadmap tailored to your specific goals and skills.",
        icon: Sparkles,
    },
    {
        title: "Real-time Feedback",
        description: "Get instant, actionable insights on your resume, skills, and interview performance.",
        icon: Zap,
    },
    {
        title: "Career-Focused",
        description: "Every tool is designed to help you land your next role and advance your career.",
        icon: Briefcase,
    },
];

const testimonials = [
    {
        quote: "SkillForge helped me prepare for my dream SDE role. The AI Interview Prep was a game-changer!",
        author: "Student User",
    },
    {
        quote: "Finally a tool that connects my resume, skills, and goals into one seamless platform.",
        author: "Early Adopter",
    },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-all duration-300">

            {/* ✅ Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 animate-gradient" />
                <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="flex-1 text-center lg:text-left space-y-6"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Forge Your Career Path with <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient mt-2">AI-Powered Guidance</span>
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                            SkillForge offers personalized AI tools for career roadmapping, resume optimization, skill gap analysis, and interview preparation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/register")}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-95 transition-all duration-300"
                            >
                                Get Started <ArrowRight className="inline-block w-5 h-5 ml-1" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/ai-roadmap")}
                                className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300"
                            >
                                Try Roadmap Demo
                            </motion.button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        whileHover={{ 
        scale: 1.05,    // slight zoom
        rotate: 2,      // subtle rotation
        y: -5           // move up a bit
    }}
                        className="flex-1 flex justify-center mt-10 lg:mt-0"
                    >
                        <img
                            src={illustration}
                            alt="AI-Powered Career & Learning Planner"
                            className="w-full max-w-md rounded-2xl shadow-2xl transition-transform duration-500"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ✅ Features Section */}
            <section className="bg-gray-100 dark:bg-gray-900 max-w-7xl mx-auto px-6 py-20 rounded-3xl -mt-16 relative shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
                    What You Can Do
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
                            className="p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition group cursor-pointer"
                            onClick={() => navigate(feature.link)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-gray-800 group-hover:bg-blue-600 transition-all duration-300">
                                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-all duration-300" />
                                </div>
                                <h3 className="text-xl font-semibold">{feature.name}</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                            <span className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                                Explore <ArrowRight className="w-4 h-4" />
                            </span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ✅ How It Works Section */}
            <section className="bg-gray-50 dark:bg-gray-950 py-20">
                <div className="max-w-6xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold mb-12">How SkillForge Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorks.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                whileHover={{ y: -5, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.05)" }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-200/40 dark:border-gray-700/40"
                            >
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                                    <s.icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{s.step}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{s.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ Why Choose Us Section */}
            <section className="bg-gray-100 dark:bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Why Choose SkillForge?</h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {whyUs.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
                                className="p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition"
                            >
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-gray-800 inline-block mb-4">
                                    <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ Testimonials */}
            <section className="bg-gray-50 dark:bg-gray-950 max-w-5xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, rotate: (i % 2 === 0 ? 1 : -1) }}
                            className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow"
                        >
                            <p className="italic text-gray-700 dark:text-gray-300 mb-4 text-lg">“{t.quote}”</p>
                            <div className="flex items-center gap-2">
                                <Sparkle className="w-5 h-5 text-blue-500" />
                                <p className="font-semibold text-blue-600 dark:text-blue-400">{t.author}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ✅ Final CTA */}
            <section className="relative py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient opacity-95" />
                <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
                    <p className="mb-8 text-lg">Join SkillForge today and unlock AI-powered tools to transform your learning & career journey.</p>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/register")}
                        className="px-12 py-5 bg-white text-blue-600 rounded-full font-bold text-lg shadow-lg hover:opacity-90 transition"
                    >
                        Start Your Free Journey 🚀
                    </motion.button>
                </div>
            </section>
        </div>
    );
}