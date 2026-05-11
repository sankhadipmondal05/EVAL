import { motion } from 'framer-motion';
import { Trophy, Medal, Search, Filter, ArrowUpRight } from 'lucide-react';

const TOP_PLAYERS = [
  { rank: 1, name: 'Alex Sterling', score: '24,850', accuracy: '98.2%', time: '1m 45s', avatar: 'AS' },
  { rank: 2, name: 'Elena Vance', score: '22,400', accuracy: '96.5%', time: '2m 10s', avatar: 'EV' },
  { rank: 3, name: 'Marcus Kane', score: '21,900', accuracy: '94.8%', time: '2m 15s', avatar: 'MK' },
];

const RANKINGS = [
  { rank: 4, name: 'Sarah Chen', score: '20,500', accuracy: '95.1%', time: '2m 30s', streak: 12 },
  { rank: 5, name: 'David Miller', score: '19,800', accuracy: '93.4%', time: '2m 45s', streak: 8 },
  { rank: 6, name: 'Jason Reed', score: '19,200', accuracy: '92.8%', time: '3m 00s', streak: 15 },
  { rank: 7, name: 'Emma Watson', score: '18,500', accuracy: '91.2%', time: '3m 15s', streak: 5 },
  { rank: 8, name: 'Leo Turner', score: '17,900', accuracy: '90.5%', time: '3m 30s', streak: 3 },
  { rank: 9, name: 'Olivia Pope', score: '17,200', accuracy: '89.8%', time: '3m 45s', streak: 10 },
  { rank: 10, name: 'Chris Evans', score: '16,500', accuracy: '88.1%', time: '4m 00s', streak: 7 },
];

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold mb-4"
        >
          Global <span className="text-primary">Rankings</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-foreground/60 max-w-2xl mx-auto"
        >
          Compare your cognitive bandwidth with the top engineering talent worldwide. 
          Rankings are updated in real-time.
        </motion.p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="order-2 md:order-1 p-8 rounded-[2rem] bg-muted border border-border flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-400 opacity-30" />
          <div className="w-16 h-16 rounded-full bg-slate-400/20 flex items-center justify-center text-xl font-bold mb-4 border-2 border-slate-400/30">
            {TOP_PLAYERS[1].avatar}
          </div>
          <Medal className="w-6 h-6 text-slate-400 mb-2" />
          <h3 className="text-lg font-bold mb-1">{TOP_PLAYERS[1].name}</h3>
          <div className="text-2xl font-display font-bold text-slate-400">{TOP_PLAYERS[1].score}</div>
          <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-2">Points</div>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-1 md:order-2 p-10 rounded-[2.5rem] bg-muted border border-primary/30 flex flex-col items-center relative overflow-hidden transform md:scale-110 z-10 shadow-[0_0_50px_rgba(59,130,246,0.1)]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold mb-4 border-2 border-primary/30">
            {TOP_PLAYERS[0].avatar}
          </div>
          <Trophy className="w-8 h-8 text-primary mb-2 animate-bounce" />
          <h3 className="text-xl font-bold mb-1">{TOP_PLAYERS[0].name}</h3>
          <div className="text-3xl font-display font-bold text-primary">{TOP_PLAYERS[0].score}</div>
          <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-2">Points</div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="order-3 p-8 rounded-[2rem] bg-muted border border-border flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-700 opacity-30" />
          <div className="w-16 h-16 rounded-full bg-amber-700/20 flex items-center justify-center text-xl font-bold mb-4 border-2 border-amber-700/30">
            {TOP_PLAYERS[2].avatar}
          </div>
          <Medal className="w-6 h-6 text-amber-700 mb-2" />
          <h3 className="text-lg font-bold mb-1">{TOP_PLAYERS[2].name}</h3>
          <div className="text-2xl font-display font-bold text-amber-700">{TOP_PLAYERS[2].score}</div>
          <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-2">Points</div>
        </motion.div>
      </div>

      {/* Table Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search players..." 
            className="w-full bg-muted border border-border rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-muted border border-border rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <select className="flex-1 md:flex-none bg-muted border border-border rounded-xl px-6 py-3 text-sm font-bold outline-none">
            <option>All Time</option>
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-muted border border-border rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-white/[0.02]">
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground/40">Rank</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground/40">Player</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Score</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Accuracy</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Time</th>
              <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {RANKINGS.map((player, i) => (
              <motion.tr 
                key={player.rank}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group border-b border-border/50 hover:bg-white/[0.01] transition-colors"
              >
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-foreground/40">#{player.rank}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{player.name}</div>
                      <div className="text-[10px] text-accent font-bold uppercase">🔥 {player.streak} Streak</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right text-sm font-bold">{player.score}</td>
                <td className="px-8 py-5 text-right text-sm font-bold text-foreground/60">{player.accuracy}</td>
                <td className="px-8 py-5 text-right text-sm font-bold text-foreground/60">{player.time}</td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors group/btn">
                    <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover/btn:text-primary transition-colors" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
