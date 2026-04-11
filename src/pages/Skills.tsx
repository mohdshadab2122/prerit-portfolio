import { motion } from 'motion/react';
import { Settings, Code, Monitor, Zap } from 'lucide-react';

export default function Skills() {
  const categories = [
    {
      title: 'Engineering Disciplines',
      icon: <Settings className="w-5 h-5 text-[#FF6B00]" />,
      description: 'Core technical foundations and theoretical expertise.',
      skills: [
        'Electromechanical Energy Conversion',
        'Electric Machines Electromagnetic Design',
        'Motor Control Algorithms',
        'Power Electronics',
        'Control Systems Engineering (Linear, Nonlinear, Stochastic)',
        'Physical System Modeling',
        'Rigid Body Dynamics',
        'Battery Systems',
        'Thermal Modeling',
        'Estimation and Control',
        'Digital (Embedded) Control Systems',
        'Digital Signal Processing',
        'Optimization',
        'Digital Electronics',
        'Electric Circuits',
        'PCB Layout',
        'Embedded System Electrical Architecture',
        'Microcontrollers & DSPs',
        'Acoustics and Vibration (NVH)',
        'Hybrid Electric Vehicle Powertrain Systems',
        'Automotive Engineering',
        'Multi-physics Simulation',
        'Finite Element Analysis',
        'Model Based Design',
        'Systems Architecture',
        'Software Architecture',
        'Functional Safety (ISO 26262)',
        'Safety Management & Architecture',
        'Automotive Safety Integrity Levels (ASIL)',
        'Risk Assessment and Mitigation',
        'Failure Analysis',
        'Fault Tolerant Design',
        'Requirements Engineering',
        'Product Development and Validation',
        'Manufacturing'
      ]
    },
    {
      title: 'Products & Technologies',
      icon: <Zap className="w-5 h-5 text-[#0A5CE6]" />,
      description: 'Applied engineering across specialized industrial domains.',
      skills: [
        'Electric Power Steering',
        'Advanced Driver Assistance Systems (ADAS)',
        'Steer-by-Wire',
        'Vehicle Chassis Systems (Brake-Booster, Brake-by-Wire, Active Suspension)',
        'Autonomous Vehicles',
        'Hybrid Electric Vehicle Traction',
        'Powertrain Electrification',
        'Automotive Domain Controllers',
        'Industrial Servomotors',
        'Exoskeletons'
      ]
    },
    {
      title: 'Programming & Rapid Prototyping',
      icon: <Code className="w-5 h-5 text-[#FF6B00]" />,
      description: 'Languages and environments for technical implementation.',
      skills: [
        'C',
        'C++',
        'Python',
        'Visual Basic',
        'MATLAB',
        'Simulink',
        'dSPACE',
        'National Instruments LabVIEW'
      ]
    },
    {
      title: 'Application Software',
      icon: <Monitor className="w-5 h-5 text-[#0A5CE6]" />,
      description: 'Specialized tools for simulation, design, and validation.',
      skills: [
        'Simulink',
        'Stateflow',
        'OrCAD PSpice',
        'Plexim PLECS',
        'Powersim PSIM',
        'Altair Flux 2D',
        'Ansys Motor-CAD',
        'Ansys Maxwell',
        'CarSim',
        'Microsoft Office Suite',
        'IBM DOORS',
        'IBM Rhapsody',
        'IBM Synergy',
        'Vector CANape',
        'Vector CANoe',
        'Vector CANalyzer'
      ]
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen py-24 px-6 font-sans selection:bg-[#FF6B00]/10 selection:text-[#FF6B00]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 bg-[#FF6B00]" />
            <span className="text-[#FF6B00] font-mono text-xs font-bold uppercase tracking-[0.3em]">Technical Inventory</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#0D0D0D] mb-6 leading-none">
            TECHNICAL <br />
            <span className="text-[#0A5CE6]">PROFICIENCIES</span>
          </h1>
          <p className="text-xl text-[#0D0D0D]/50 max-w-2xl leading-relaxed font-light">
            A comprehensive taxonomy of engineering expertise, spanning theoretical disciplines, industrial products, and specialized technical tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col bg-[#F4F4F5] border border-[#E5E7EB] p-8 transition-all duration-300 hover:border-[#FF6B00]/30 hover:shadow-xl hover:shadow-[#FF6B00]/5"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-[#E5E7EB] group-hover:bg-white group-hover:border-[#FF6B00]/30 transition-colors duration-300">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0D0D0D] tracking-tight group-hover:text-[#FF6B00] transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-xs text-[#0D0D0D]/40 mt-1 font-light tracking-wide">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#0D0D0D]/20 group-hover:text-[#FF6B00]/40 transition-colors">
                  SEC_{String(index + 1).padStart(2, '0')}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 bg-white text-[#0D0D0D]/60 text-[11px] font-mono uppercase tracking-wider border border-[#E5E7EB] hover:border-[#0A5CE6]/50 hover:text-[#0A5CE6] hover:bg-[#0A5CE6]/5 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-[#E5E7EB] flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#0D0D0D]/20 uppercase tracking-widest">System Status</span>
              <span className="text-xs text-[#0A5CE6] font-mono">ALL_SYSTEMS_OPERATIONAL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#0D0D0D]/20 uppercase tracking-widest">Last Updated</span>
              <span className="text-xs text-[#0D0D0D]/40 font-mono">2026.04.05</span>
            </div>
          </div>
          <p className="text-[#0D0D0D]/20 text-[10px] font-mono uppercase tracking-widest">
            © PRERIT PRAMOD // TECHNICAL INVENTORY v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
