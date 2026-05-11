import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { Brain, Zap, TrendingUp, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import './Dashboard.css';

const SKILL_DATA = [
  { subject: 'Attention', A: 120, fullMark: 150 },
  { subject: 'Memory', A: 98, fullMark: 150 },
  { subject: 'Logic', A: 86, fullMark: 150 },
  { subject: 'Switching', A: 99, fullMark: 150 },
  { subject: 'Planning', A: 85, fullMark: 150 },
  { subject: 'Deduction', A: 65, fullMark: 150 },
];

const PERFORMANCE_DATA = [
  { day: 'Mon', score: 400 },
  { day: 'Tue', score: 300 },
  { day: 'Wed', score: 600 },
  { day: 'Thu', score: 800 },
  { day: 'Fri', score: 500 },
  { day: 'Sat', score: 900 },
  { day: 'Sun', score: 1100 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold mb-2"
          >
            Welcome back, <span className="text-primary">Engineer</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60"
          >
            Your cognitive performance is trending upwards. Keep it up!
          </motion.p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 bg-muted rounded-2xl border border-border flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Current Streak</div>
              <div className="text-xl font-bold">12 Days</div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-2xl border border-border flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Total Points</div>
              <div className="text-xl font-bold">12,450</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 p-8 rounded-[2rem] bg-muted border border-border flex flex-col items-center"
        >
          <h3 className="text-lg font-bold mb-6 self-start">Cognitive Profile</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                <PolarGrid stroke="#262626" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="p-3 bg-background/50 rounded-xl border border-border">
              <div className="text-[10px] font-bold text-foreground/40 uppercase">Top Skill</div>
              <div className="text-sm font-bold">Attention</div>
            </div>
            <div className="p-3 bg-background/50 rounded-xl border border-border">
              <div className="text-[10px] font-bold text-foreground/40 uppercase">Needs Focus</div>
              <div className="text-sm font-bold">Deduction</div>
            </div>
          </div>
        </motion.div>

        {/* Performance Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-8 rounded-[2rem] bg-muted border border-border"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Performance Trends</h3>
            <select className="bg-background/50 border border-border rounded-lg px-3 py-1 text-xs font-bold outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Attempts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2rem] bg-muted border border-border"
        >
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { game: 'Grid Challenge', score: '2,400', time: '2m 30s', trend: 'up' },
              { game: 'Scales CLX', score: '1,850', time: '4m 12s', trend: 'down' },
              { game: 'Motion Challenge', score: '3,200', time: '5m 00s', trend: 'up' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-foreground/40" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{item.game}</div>
                    <div className="text-[10px] text-foreground/40 font-bold uppercase">{item.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.score}</div>
                  <div className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-accent' : 'text-red-500'}`}>
                    {item.trend === 'up' ? '+12%' : '-4%'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Games */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-[2rem] bg-muted border border-border"
        >
          <h3 className="text-lg font-bold mb-6">Recommended for You</h3>
          <div className="space-y-4">
            {[
              { game: 'Switch Challenge', skill: 'Cognitive Switching', color: '#f59e0b' },
              { game: 'Gap Challenge', skill: 'Deductive Reasoning', color: '#ef4444' },
            ].map((item, i) => (
              <div key={i} className="group flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <Zap className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{item.game}</div>
                    <div className="text-[10px] text-foreground/40 font-bold uppercase">{item.skill}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="rounded-xl">Start</Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
