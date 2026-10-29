import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// 👑 Fix 1: Import 'useLottie' as a named export for v3 compliance
import { useLottie } from 'lottie-react'; 

import successAnimation from '../assets/12345.json'; 

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // 👑 Fix 2: Define options according to v3 specifications (swapped 'animationData' for 'src')
  const lottie = useLottie({
    src: successAnimation,
    autoplay: true,
    loop: false,
  });

  useEffect(() => {
    if (sessionId) {
      console.log('Payment verified for session:', sessionId);
    }
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center bg-gray-50 font-sans antialiased w-full h-[90vh]">
      <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md w-full mx-4">
        
        {/* 👑 Fix 3: Use setDisplayRef instead of returning {View} to prevent callback crashes */}
        <div 
          ref={lottie.setDisplayRef} 
          className="w-32 h-32 mx-auto mb-4" 
        />

        <h1 className="text-gray-900 text-3xl font-extrabold tracking-tight mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        
        {sessionId && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 font-mono bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-200/60 max-w-full truncate">
              Ref ID: <span className="text-gray-600">{sessionId}</span>
            </p>
          </div>
        )}

        <Link 
          to="/" 
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-emerald-600/20 active:scale-95 transition-all duration-200 w-full sm:w-auto"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

