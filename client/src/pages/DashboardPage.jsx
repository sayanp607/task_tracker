import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchStats } from '../api';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="empty-state"><div className="spinner">Loading Analytics...</div></div>;
  }

  if (!stats || !stats.byStatus || !stats.byPriority) {
    return <div className="empty-state">No data available to display charts.</div>;
  }

  // Formatting data for Recharts
  const statusData = stats.byStatus.map(s => ({ name: s._id, value: s.count }));
  const priorityData = stats.byPriority.map(s => ({ name: s._id, value: s.count }));

  const COLORS = ['#10b981', '#f59e0b', '#6366f1']; // Success, Warning, Primary
  const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#10b981']; // High, Medium, Low

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-analytics animate-fade-in"
    >
      <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-main)' }}>Task Analytics</h2>
      
      <div className="charts-grid">
        
        {/* Pie Chart: Tasks by Status */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Tasks by Status</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--card-border)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Tasks by Priority */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Tasks by Priority</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--card-border)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => {
                    let color = PRIORITY_COLORS[1];
                    if(entry.name === 'High') color = PRIORITY_COLORS[0];
                    if(entry.name === 'Low') color = PRIORITY_COLORS[2];
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default DashboardPage;
