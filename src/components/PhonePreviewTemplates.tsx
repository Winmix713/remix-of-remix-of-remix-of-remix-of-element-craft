import { 
  Paintbrush, User, Settings, Bell, CreditCard, TrendingUp, 
  BarChart3, Calendar, Mail, Star, Heart, MessageCircle, 
  Share2, MoreHorizontal, Image as ImageIcon, Play
} from 'lucide-react';

export type PreviewTemplate = 'onboarding' | 'dashboard' | 'profile' | 'cards';

interface TemplateProps {
  getNeomorphShadow: () => React.CSSProperties;
  getClayStyle: () => React.CSSProperties;
}

// Helper to safely merge styles
const mergeStyles = (neo: React.CSSProperties, clay: React.CSSProperties): React.CSSProperties => {
  return { ...neo, ...clay }; 
};

export const OnboardingTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute bottom-0 w-full p-8 pb-12 flex flex-col gap-6 z-10">
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
      style={mergeStyles(getNeomorphShadow(), getClayStyle())}
    >
      <Paintbrush className="w-5 h-5 text-white/80" />
    </div>
    <div>
      <div className="text-xs font-medium tracking-widest uppercase mb-2 text-white/60">Collaboration Hub</div>
      <h1 className="text-3xl font-bold leading-tight mb-4 text-white">Get More Done Together</h1>
      <p className="text-sm leading-relaxed text-white/60">Stay aligned, share ideas, and keep every project moving smoothly.</p>
    </div>
    <div className="flex flex-col gap-3 mt-4">
      <button 
        className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-medium text-black transition-colors"
        style={{ ...mergeStyles(getNeomorphShadow(), getClayStyle()), background: 'white' }}
      >
        <span>Continue With Google</span>
      </button>
      <button 
        className="w-full h-12 rounded-full flex items-center justify-center font-medium text-white/80 transition-colors"
        style={mergeStyles(getNeomorphShadow(), getClayStyle())}
      >
        Skip
      </button>
    </div>
  </div>
);

export const DashboardTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute inset-0 w-full h-full p-4 pt-12 flex flex-col gap-4 z-10 overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-white/50">Good morning</p>
        <h2 className="text-lg font-semibold text-white">Dashboard</h2>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Bell className="w-4 h-4 text-white/70" /></div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Settings className="w-4 h-4 text-white/70" /></div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="p-4 rounded-2xl" style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /></div>
          <span className="text-[10px] text-white/50">Revenue</span>
        </div>
        <p className="text-xl font-bold text-white">$24,560</p>
        <span className="text-[10px] text-emerald-400">+12.5%</span>
      </div>
      <div className="p-4 rounded-2xl" style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center"><BarChart3 className="w-3.5 h-3.5 text-violet-400" /></div>
          <span className="text-[10px] text-white/50">Orders</span>
        </div>
        <p className="text-xl font-bold text-white">1,847</p>
        <span className="text-[10px] text-violet-400">+8.2%</span>
      </div>
    </div>

    <div className="flex-1 rounded-2xl p-4" style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-white/70">Performance</span>
        <span className="text-[10px] text-white/40">Last 7 days</span>
      </div>
      <div className="flex items-end gap-2 h-32">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-md bg-gradient-to-t from-violet-500/50 to-cyan-500/50" style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-4 gap-2 pb-4">
      {[{ icon: Calendar, label: 'Calendar' }, { icon: Mail, label: 'Messages' }, { icon: CreditCard, label: 'Payments' }, { icon: MoreHorizontal, label: 'More' }].map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
            <Icon className="w-5 h-5 text-white/60" />
          </div>
          <span className="text-[9px] text-white/40">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export const ProfileTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute inset-0 w-full h-full flex flex-col z-10 overflow-hidden">
    <div className="h-40 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 relative">
      <div className="absolute inset-0 bg-black/20" />
    </div>
    <div className="flex-1 px-6 -mt-16">
      <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 border-4 border-black" style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
        <User className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-xl font-bold text-white mb-1">Alex Morgan</h2>
      <p className="text-xs text-white/50 mb-1">@alexmorgan</p>
      <p className="text-sm text-white/70 mb-4">Digital designer & creative director. Making beautiful things since 2015.</p>
      <div className="flex gap-6 mb-6">
        <div className="text-center"><p className="text-lg font-bold text-white">248</p><p className="text-[10px] text-white/40">Posts</p></div>
        <div className="text-center"><p className="text-lg font-bold text-white">12.4k</p><p className="text-[10px] text-white/40">Followers</p></div>
        <div className="text-center"><p className="text-lg font-bold text-white">892</p><p className="text-[10px] text-white/40">Following</p></div>
      </div>
      <div className="flex gap-3 mb-6">
        <button className="flex-1 h-10 rounded-full font-medium text-sm text-black" style={{...mergeStyles(getNeomorphShadow(), getClayStyle()), background: 'white'}}>Follow</button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center" style={mergeStyles(getNeomorphShadow(), getClayStyle())}><MessageCircle className="w-4 h-4 text-white/70" /></button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center" style={mergeStyles(getNeomorphShadow(), getClayStyle())}><Share2 className="w-4 h-4 text-white/70" /></button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square rounded-lg bg-white/5 flex items-center justify-center border border-white/5"><ImageIcon className="w-6 h-6 text-white/20" /></div>
        ))}
      </div>
    </div>
  </div>
);

export const CardsTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute inset-0 w-full h-full p-4 pt-12 flex flex-col gap-4 z-10 overflow-auto scrollbar-dark">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-white">Discover</h2>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Bell className="w-4 h-4 text-white/70" /></div>
    </div>
    <div className="rounded-2xl p-4" style={{...mergeStyles(getNeomorphShadow(), getClayStyle()), background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(8, 145, 178, 0.3))'}}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Star className="w-5 h-5 text-amber-400" /></div>
        <div className="flex-1"><h3 className="text-sm font-semibold text-white">Featured</h3><p className="text-xs text-white/50">Top picks for you</p></div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Play className="w-4 h-4 text-white/70" /></div>
      </div>
      <p className="text-xs text-white/60 line-clamp-2">Explore curated content tailored to your interests and preferences.</p>
    </div>
    {[
      { title: 'Design Systems', subtitle: '24 articles', color: 'from-rose-500/20 to-orange-500/20' },
      { title: 'Motion Design', subtitle: '18 tutorials', color: 'from-emerald-500/20 to-cyan-500/20' },
      { title: 'Typography', subtitle: '32 resources', color: 'from-blue-500/20 to-violet-500/20' },
    ].map((card, i) => (
      <div key={i} className={`rounded-2xl bg-gradient-to-br ${card.color} p-4 flex items-center gap-4`} style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
        <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-white/30" /></div>
        <div className="flex-1"><h3 className="text-sm font-semibold text-white mb-0.5">{card.title}</h3><p className="text-[10px] text-white/50">{card.subtitle}</p></div>
        <div className="flex flex-col items-center gap-1"><Heart className="w-5 h-5 text-white/40" /><span className="text-[9px] text-white/30">142</span></div>
      </div>
    ))}
    <div className="grid grid-cols-2 gap-3 pb-4">
      {['Animations', 'Colors', 'Layouts', 'Icons'].map((label) => (
        <div key={label} className="p-4 rounded-xl" style={mergeStyles(getNeomorphShadow(), getClayStyle())}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2"><Paintbrush className="w-4 h-4 text-white/50" /></div>
          <p className="text-xs font-medium text-white">{label}</p>
          <p className="text-[9px] text-white/40">12 items</p>
        </div>
      ))}
    </div>
  </div>
);
