import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-xl">
                Skill<span className="text-brand-400">Bridge</span>
              </span>
            </Link>
            <p className="text-sm font-body leading-relaxed max-w-xs">
              Connect with expert tutors and accelerate your learning journey. Any subject, any level.
            </p>
          </div>

          <div>
            <h4 className="text-white font-display font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href="/tutors" className="hover:text-white transition-colors">Browse Tutors</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Become a Tutor</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body">© 2025 SkillBridge. All rights reserved.</p>
          <p className="text-xs font-body">Made with ❤️ for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
