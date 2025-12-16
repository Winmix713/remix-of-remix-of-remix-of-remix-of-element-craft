import { useEffects } from '@/contexts/EffectContext';
import { 
  Paintbrush, 
  User, 
  Settings, 
  Bell, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Mail,
  Star,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Play
} from 'lucide-react';

export type PreviewTemplate = 'onboarding' | 'dashboard' | 'profile' | 'cards';

interface TemplateProps {
  getNeomorphShadow: () => React.CSSProperties;
  getClayStyle: () => React.CSSProperties;
}

export const OnboardingTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute bottom-0 w-full p-8 pb-12 flex flex-col gap-6 z-10">
    {/* Icon with effects */}
    <div 
      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
      style={{ ...getNeomorphShadow(), ...getClayStyle() }}
    >
      <Paintbrush className="w-5 h-5 text-white/80" />
    </div>

    {/* Text */}
    <div>
      <div className="text-xs font-medium tracking-widest uppercase mb-2 text-white/60">
        Collaboration Hub
      </div>
      <h1 className="text-3xl font-bold leading-tight mb-4 text-white">
        Get More Done Together
      </h1>
      <p className="text-sm leading-relaxed text-white/60">
        Stay aligned, share ideas, and keep every project moving smoothly.
      </p>
    </div>

    {/* Buttons with effects */}
    <div className="flex flex-col gap-3 mt-4">
      <button 
        className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-medium bg-white text-black hover:bg-white/90 transition-colors"
        style={{ ...getNeomorphShadow(), ...getClayStyle() }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M16.92 9.1875C16.92 8.6025 16.8675 8.04 16.77 7.5H9V10.695H13.44C13.245 11.7225 12.66 12.5925 11.7825 13.1775V15.255H14.46C16.02 13.815 16.92 11.7 16.92 9.1875Z" fill="#4285F4"/>
          <path d="M9 17.25C11.2275 17.25 13.095 16.515 14.46 15.255L11.7825 13.1775C11.0475 13.6725 10.11 13.9725 9 13.9725C6.855 13.9725 5.0325 12.525 4.38 10.575H1.635V12.705C2.9925 15.3975 5.775 17.25 9 17.25Z" fill="#34A853"/>
          <path d="M4.38 10.5675C4.215 10.0725 4.1175 9.5475 4.1175 9C4.1175 8.4525 4.215 7.9275 4.38 7.4325V5.3025H1.635C1.0725 6.4125 0.75 7.665 0.75 9C0.75 10.335 1.0725 11.5875 1.635 12.6975L3.7725 11.0325L4.38 10.5675Z" fill="#FBBC05"/>
          <path d="M9 4.035C10.215 4.035 11.295 4.455 12.1575 5.265L14.52 2.9025C13.0875 1.5675 11.2275 0.75 9 0.75C5.775 0.75 2.9925 2.6025 1.635 5.3025L4.38 7.4325C5.0325 5.4825 6.855 4.035 9 4.035Z" fill="#EA4335"/>
        </svg>
        Continue With Google
      </button>
      <button 
        className="w-full h-12 rounded-full flex items-center justify-center font-medium bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
        style={{ ...getNeomorphShadow(), ...getClayStyle() }}
      >
        Skip
      </button>
    </div>
  </div>
);

export const DashboardTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute inset-0 w-full h-full p-4 pt-12 flex flex-col gap-4 z-10 overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-white/50">Good morning</p>
        <h2 className="text-lg font-semibold text-white">Dashboard</h2>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Bell className="w-4 h-4 text-white/70" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Settings className="w-4 h-4 text-white/70" />
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-2 gap-3">
      <div 
        className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
        style={{ ...getNeomorphShadow(), ...getClayStyle() }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-white/50">Revenue</span>
        </div>
        <p className="text-xl font-bold text-white">$24,560</p>
        <span className="text-[10px] text-emerald-400">+12.5%</span>
      </div>
      
      <div 
        className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
        style={{ ...getNeomorphShadow(), ...getClayStyle() }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <span className="text-[10px] text-white/50">Orders</span>
        </div>
        <p className="text-xl font-bold text-white">1,847</p>
        <span className="text-[10px] text-violet-400">+8.2%</span>
      </div>
    </div>

    {/* Chart placeholder */}
    <div 
      className="flex-1 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4"
      style={{ ...getNeomorphShadow(), ...getClayStyle() }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-white/70">Performance</span>
        <span className="text-[10px] text-white/40">Last 7 days</span>
      </div>
      <div className="flex items-end gap-2 h-32">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full rounded-t-md bg-gradient-to-t from-violet-500/50 to-cyan-500/50"
              style={{ height: `${h}%` }}
            />
            <span className="text-[8px] text-white/30">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Quick actions */}
    <div className="grid grid-cols-4 gap-2 pb-4">
      {[
        { icon: Calendar, label: 'Calendar' },
        { icon: Mail, label: 'Messages' },
        { icon: CreditCard, label: 'Payments' },
        { icon: MoreHorizontal, label: 'More' },
      ].map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div 
            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
            style={{ ...getNeomorphShadow(), ...getClayStyle() }}
          >
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
    {/* Cover */}
    <div className="h-40 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 relative">
      <div className="absolute inset-0 bg-black/20" />
    </div>

    {/* Profile info */}
    <div className="flex-1 px-6 -mt-16">
      {/* Avatar */}
      <div 
        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 border-4 border-black flex items-center justify-center mb-4"
        style={{ ...getNeomorphShadow(), ...getClayStyle() }}
      >
        <User className="w-12 h-12 text-white" />
      </div>

      {/* Name and bio */}
      <h2 className="text-xl font-bold text-white mb-1">Alex Morgan</h2>
      <p className="text-xs text-white/50 mb-1">@alexmorgan</p>
      <p className="text-sm text-white/70 mb-4">Digital designer & creative director. Making beautiful things since 2015.</p>

      {/* Stats */}
      <div className="flex gap-6 mb-6">
        <div className="text-center">
          <p className="text-lg font-bold text-white">248</p>
          <p className="text-[10px] text-white/40">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">12.4k</p>
          <p className="text-[10px] text-white/40">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">892</p>
          <p className="text-[10px] text-white/40">Following</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <button 
          className="flex-1 h-10 rounded-full bg-white text-black font-medium text-sm"
          style={{ ...getNeomorphShadow(), ...getClayStyle() }}
        >
          Follow
        </button>
        <button 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10"
          style={{ ...getNeomorphShadow(), ...getClayStyle() }}
        >
          <MessageCircle className="w-4 h-4 text-white/70" />
        </button>
        <button 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10"
          style={{ ...getNeomorphShadow(), ...getClayStyle() }}
        >
          <Share2 className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="aspect-square rounded-lg bg-white/5 flex items-center justify-center border border-white/5"
          >
            <ImageIcon className="w-6 h-6 text-white/20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CardsTemplate = ({ getNeomorphShadow, getClayStyle }: TemplateProps) => (
  <div className="absolute inset-0 w-full h-full p-4 pt-12 flex flex-col gap-4 z-10 overflow-auto scrollbar-dark">
    {/* Header */}
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-white">Discover</h2>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
        <Bell className="w-4 h-4 text-white/70" />
      </div>
    </div>

    {/* Featured card */}
    <div 
      className="rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-600/30 p-4 border border-white/10"
      style={{ ...getNeomorphShadow(), ...getClayStyle() }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">Featured</h3>
          <p className="text-xs text-white/50">Top picks for you</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Play className="w-4 h-4 text-white/70" />
        </div>
      </div>
      <p className="text-xs text-white/60 line-clamp-2">Explore curated content tailored to your interests and preferences.</p>
    </div>

    {/* Content cards */}
    {[
      { title: 'Design Systems', subtitle: '24 articles', color: 'from-rose-500/20 to-orange-500/20' },
      { title: 'Motion Design', subtitle: '18 tutorials', color: 'from-emerald-500/20 to-cyan-500/20' },
      { title: 'Typography', subtitle: '32 resources', color: 'from-blue-500/20 to-violet-500/20' },
    ].map((card, i) => (
      <div 
        key={i}
        className={`rounded-2xl bg-gradient-to-br ${card.color} p-4 border border-white/10 flex items-center gap-4`}
        style={{ ...getNeomorphShadow(), ...getClayStyle() }}
      >
        <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-white/30" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white mb-0.5">{card.title}</h3>
          <p className="text-[10px] text-white/50">{card.subtitle}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Heart className="w-5 h-5 text-white/40" />
          <span className="text-[9px] text-white/30">142</span>
        </div>
      </div>
    ))}

    {/* Small cards */}
    <div className="grid grid-cols-2 gap-3 pb-4">
      {['Animations', 'Colors', 'Layouts', 'Icons'].map((label) => (
        <div 
          key={label}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
          style={{ ...getNeomorphShadow(), ...getClayStyle() }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
            <Paintbrush className="w-4 h-4 text-white/50" />
          </div>
          <p className="text-xs font-medium text-white">{label}</p>
          <p className="text-[9px] text-white/40">12 items</p>
        </div>
      ))}
    </div>
  </div>
);