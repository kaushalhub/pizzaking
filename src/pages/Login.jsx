import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // If user already logged in, redirect home
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate(-1); // Go back to where the user was
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-md text-center space-y-8"
      >
        {/* Brand visual header */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Welcome to PizzaKing</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Sign in to unlock exclusive promo coupons, track orders in real-time, and save multiple delivery addresses.
          </p>
        </div>

        {/* Action Button: Google Login Only */}
        <div className="pt-2">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 px-6 border border-slate-200 hover:border-slate-300 rounded-2xl font-extrabold text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-sm"
          >
            {/* Custom Google logo using SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.97 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.31 7.57 9 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.09 3.57-5.17 3.57-8.71z"
              />
              <path
                fill="#FBBC05"
                d="M5.36 14.5c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38l-3.86-3C.68 8.24 0 10.04 0 12s.68 3.76 1.5 5.26l3.86-3.76z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.86-2.98c-1.1.74-2.52 1.18-4.1 1.18-3 0-5.69-2.53-6.64-5.46l-3.86 3C3.39 20.35 7.35 23 12 23z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </div>

        {/* Small Notice */}
        <div className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
          By signing in, you agree to our Terms of Service. Note that this is a simulated demo environment.
        </div>

      </motion.div>
      
    </div>
  );
}
