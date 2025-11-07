export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FFCBB8 0%, #FFB89A 50%, #FFD4A0 100%)'
    }}>
      {/* Animated decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-300/25 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-300/25 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-yellow-300/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      {/* Floating Food Emoji Watermarks */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.18] z-0">
        {/* Row 1 - Top */}
        <div className="absolute top-[5%] left-[8%] text-6xl animate-float" style={{ animationDelay: '0s', animationDuration: '25s' }}>🍕</div>
        <div className="absolute top-[10%] left-[45%] text-5xl animate-float-slow" style={{ animationDelay: '2s', animationDuration: '30s' }}>🍔</div>
        <div className="absolute top-[15%] right-[12%] text-5xl animate-float" style={{ animationDelay: '4s', animationDuration: '28s' }}>🍜</div>
        
        {/* Row 2 */}
        <div className="absolute top-[25%] left-[15%] text-4xl animate-float-slow" style={{ animationDelay: '1s', animationDuration: '32s' }}>🌮</div>
        <div className="absolute top-[30%] left-[65%] text-5xl animate-float" style={{ animationDelay: '3s', animationDuration: '26s' }}>🍣</div>
        <div className="absolute top-[28%] right-[8%] text-4xl animate-float-slow" style={{ animationDelay: '5s', animationDuration: '29s' }}>🍝</div>
        
        {/* Row 3 - Middle */}
        <div className="absolute top-[40%] left-[10%] text-5xl animate-float" style={{ animationDelay: '2.5s', animationDuration: '27s' }}>🥗</div>
        <div className="absolute top-[45%] left-[50%] text-6xl animate-float-slow" style={{ animationDelay: '1.5s', animationDuration: '31s' }}>🍰</div>
        <div className="absolute top-[42%] right-[18%] text-4xl animate-float" style={{ animationDelay: '4.5s', animationDuration: '25s' }}>🍱</div>
        
        {/* Row 4 */}
        <div className="absolute top-[55%] left-[25%] text-4xl animate-float-slow" style={{ animationDelay: '3.5s', animationDuration: '33s' }}>🥘</div>
        <div className="absolute top-[58%] left-[70%] text-5xl animate-float" style={{ animationDelay: '0.5s', animationDuration: '24s' }}>🍛</div>
        <div className="absolute top-[60%] right-[5%] text-5xl animate-float-slow" style={{ animationDelay: '2.8s', animationDuration: '30s' }}>🍲</div>
        
        {/* Row 5 - Bottom */}
        <div className="absolute top-[70%] left-[12%] text-5xl animate-float" style={{ animationDelay: '1.2s', animationDuration: '28s' }}>🥙</div>
        <div className="absolute top-[75%] left-[55%] text-4xl animate-float-slow" style={{ animationDelay: '4.2s', animationDuration: '26s' }}>🌯</div>
        <div className="absolute top-[72%] right-[15%] text-5xl animate-float" style={{ animationDelay: '3.2s', animationDuration: '29s' }}>🥪</div>
        
        {/* Additional scattered emojis */}
        <div className="absolute top-[18%] left-[35%] text-4xl animate-float-slow" style={{ animationDelay: '5.5s', animationDuration: '27s' }}>🌭</div>
        <div className="absolute top-[48%] left-[80%] text-5xl animate-float" style={{ animationDelay: '2.2s', animationDuration: '31s' }}>🍖</div>
        <div className="absolute top-[35%] left-[5%] text-4xl animate-float-slow" style={{ animationDelay: '4.8s', animationDuration: '25s' }}>🍗</div>
        <div className="absolute top-[65%] left-[40%] text-5xl animate-float" style={{ animationDelay: '1.8s', animationDuration: '30s' }}>🥓</div>
        <div className="absolute top-[82%] left-[30%] text-4xl animate-float-slow" style={{ animationDelay: '3.8s', animationDuration: '28s' }}>🍤</div>
        
        {/* Desserts & Drinks */}
        <div className="absolute top-[22%] right-[25%] text-5xl animate-float" style={{ animationDelay: '0.8s', animationDuration: '32s' }}>🦞</div>
        <div className="absolute top-[50%] right-[35%] text-4xl animate-float-slow" style={{ animationDelay: '5.2s', animationDuration: '26s' }}>🍩</div>
        <div className="absolute top-[85%] left-[68%] text-5xl animate-float" style={{ animationDelay: '2.5s', animationDuration: '29s' }}>🧁</div>
        <div className="absolute top-[12%] left-[75%] text-4xl animate-float-slow" style={{ animationDelay: '4.5s', animationDuration: '27s' }}>🍪</div>
        <div className="absolute top-[68%] right-[45%] text-5xl animate-float" style={{ animationDelay: '1.5s', animationDuration: '31s' }}>🎂</div>
        <div className="absolute top-[38%] left-[88%] text-4xl animate-float-slow" style={{ animationDelay: '3.5s', animationDuration: '25s' }}>🍦</div>
        <div className="absolute top-[78%] right-[28%] text-5xl animate-float" style={{ animationDelay: '0.2s', animationDuration: '30s' }}>🥤</div>
        <div className="absolute top-[88%] left-[15%] text-4xl animate-float-slow" style={{ animationDelay: '5.8s', animationDuration: '28s' }}>☕</div>
        <div className="absolute top-[92%] right-[8%] text-5xl animate-float" style={{ animationDelay: '2.8s', animationDuration: '26s' }}>🧃</div>
        <div className="absolute top-[8%] left-[58%] text-4xl animate-float-slow" style={{ animationDelay: '4.2s', animationDuration: '33s' }}>🍵</div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
