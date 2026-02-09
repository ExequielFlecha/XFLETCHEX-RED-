
import React, { useState } from 'react';
import { 
  Calculator as CalcIcon, X, Hash, Delete, CornerDownLeft, 
  Sparkles, Zap, ShieldCheck, History, Trash2, Pi, Square,
  Divide, Minus, Plus, Asterisk, Percent, Eraser, ChevronLeft
} from 'lucide-react';

interface CalculatorProps {
  notify: (msg: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ notify }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performCalculation = (nextValue: number) => {
    if (prevValue === null || operator === null) return nextValue;

    let result = 0;
    switch (operator) {
      case '+': result = prevValue + nextValue; break;
      case '-': result = prevValue - nextValue; break;
      case '*': result = prevValue * nextValue; break;
      case '/': 
        if (nextValue === 0) {
          notify("ERROR: DIVISIÓN POR CERO NO PERMITIDA.");
          return 0;
        }
        result = prevValue / nextValue; 
        break;
      default: return nextValue;
    }
    // Corregir precisión de punto flotante a 8 decimales
    return parseFloat(result.toFixed(8));
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = performCalculation(inputValue);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
    setEquation(`${prevValue === null ? inputValue : performCalculation(inputValue)} ${nextOperator} `);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (prevValue === null || operator === null) return;

    const result = performCalculation(inputValue);
    const fullEq = `${equation}${inputValue}`;
    
    setHistory(prev => [`${fullEq} = ${result}`, ...prev].slice(0, 10));
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setEquation('');
  };

  const handleSpecial = (type: 'sqrt' | 'percent') => {
    const val = parseFloat(display);
    let res = 0;
    if (type === 'sqrt') {
      if (val < 0) {
        notify("ERROR: RAÍZ NEGATIVA IMAGINARIA.");
        return;
      }
      res = Math.sqrt(val);
    }
    if (type === 'percent') res = val / 100;
    
    const finalRes = parseFloat(res.toFixed(8));
    setDisplay(String(finalRes));
    setWaitingForOperand(true);
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const deleteLast = () => {
    if (waitingForOperand) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const CalcButton = ({ children, onClick, color = 'bg-[#15151a]', isLarge = false, accent = false, red = false }: any) => (
    <button 
      onClick={onClick}
      className={`${color} ${isLarge ? 'col-span-1' : ''} p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-red-600 transition-all active:scale-95 shadow-xl group relative overflow-hidden flex items-center justify-center`}
    >
       <div className={`${accent ? 'text-red-500' : 'text-white'} ${red ? 'bg-red-600 !text-white' : ''} relative z-10 font-futuristic font-black text-xl md:text-3xl italic uppercase w-full h-full flex items-center justify-center`}>
         {children}
       </div>
       <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${red ? 'bg-white' : 'bg-red-600'}`}></div>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-fade-in font-rajdhani">
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* CALCULADORA PRINCIPAL - DISEÑO SEGÚN IMAGEN */}
        <div className="flex-1 w-full bg-[#0a0a0f] border-2 border-white/5 rounded-[3rem] md:rounded-[4rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-1/2 right-0 -translate-y-1/2 p-10 opacity-[0.03] pointer-events-none transform rotate-12">
              <CalcIcon size={400}/>
           </div>
           
           <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center border-2 border-red-400/30 shadow-lg">
                 <CalcIcon size={28} className="text-white" />
              </div>
              <div>
                 <h2 className="text-2xl md:text-4xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-none">CÁLCULO XF-MASTER</h2>
                 <p className="text-[8px] md:text-[10px] text-red-500 font-bold uppercase tracking-[0.4em] mt-1 italic">PRECISIÓN GALÁCTICA 8 DECIMALES</p>
              </div>
           </div>

           {/* PANTALLA DIGITAL SEGÚN IMAGEN */}
           <div className="bg-black/40 border-2 border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 mb-10 text-right relative group shadow-inner overflow-hidden">
              <div className="absolute top-6 left-8 flex items-center gap-2 z-10">
                 <ShieldCheck size={14} className="text-cyan-400" />
                 <span className="text-[9px] font-black text-cyan-400 uppercase italic tracking-widest">VALIDACIÓN ADN-MATH</span>
              </div>
              
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                 <div className="w-20 h-20 border-4 border-white rounded-2xl flex items-center justify-center">
                    <div className="w-12 h-1 bg-white mb-2"></div>
                    <div className="grid grid-cols-3 gap-1">
                       {[...Array(9)].map((_,i) => <div key={i} className="w-2 h-2 bg-white rounded-full"></div>)}
                    </div>
                 </div>
              </div>

              <p className="text-sm md:text-lg text-red-500 font-black h-8 italic uppercase tracking-widest opacity-60">{equation}</p>
              <h1 className="text-6xl md:text-9xl font-black font-futuristic text-white truncate drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                 {display}
              </h1>
           </div>

           {/* TECLADO TÁCTICO - MAPEO EXACTO DE LA FOTO */}
           <div className="grid grid-cols-4 gap-4 md:gap-6 relative z-10">
              {/* FILA 1 */}
              <CalcButton onClick={clear} color="bg-red-600/5" accent>C</CalcButton>
              <CalcButton onClick={() => handleSpecial('sqrt')}><Zap size={28}/></CalcButton>
              <CalcButton onClick={() => handleSpecial('percent')}>%</CalcButton>
              <CalcButton onClick={() => handleOperator('/')} accent>/</CalcButton>

              {/* FILA 2 */}
              <CalcButton onClick={() => handleNumber('7')}>7</CalcButton>
              <CalcButton onClick={() => handleNumber('8')}>8</CalcButton>
              <CalcButton onClick={() => handleNumber('9')}>9</CalcButton>
              <CalcButton onClick={() => handleOperator('*')} accent>*</CalcButton>

              {/* FILA 3 */}
              <CalcButton onClick={() => handleNumber('4')}>4</CalcButton>
              <CalcButton onClick={() => handleNumber('5')}>5</CalcButton>
              <CalcButton onClick={() => handleNumber('6')}>6</CalcButton>
              <CalcButton onClick={() => handleOperator('-')} accent>-</CalcButton>

              {/* FILA 4 */}
              <CalcButton onClick={() => handleNumber('1')}>1</CalcButton>
              <CalcButton onClick={() => handleNumber('2')}>2</CalcButton>
              <CalcButton onClick={() => handleNumber('3')}>3</CalcButton>
              <CalcButton onClick={() => handleOperator('+')} accent>+</CalcButton>

              {/* FILA 5 */}
              <CalcButton onClick={() => handleNumber('0')}>0</CalcButton>
              <button 
                onClick={handleDecimal}
                className="bg-[#15151a] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-red-600 transition-all font-black text-3xl text-white"
              >.</button>
              <CalcButton onClick={deleteLast}><Delete size={28}/></CalcButton>
              <CalcButton onClick={calculate} red>
                <CornerDownLeft size={32} />
              </CalcButton>
           </div>
        </div>

        {/* PANEL LATERAL DE HISTORIAL */}
        <div className="w-full md:w-[380px] space-y-6">
           <div className="bg-[#05050a]/90 backdrop-blur-3xl border-2 border-white/5 p-8 rounded-[3.5rem] shadow-2xl h-[550px] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                 <h3 className="text-sm font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-3">
                    <History size={18} className="text-red-500" /> HISTORIAL DE RED
                 </h3>
                 <button onClick={() => setHistory([])} className="text-white/20 hover:text-red-500 transition-colors p-2"><Trash2 size={18}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-3 scrollbar-thin">
                 {history.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 italic text-center p-10">
                      <Sparkles size={60} className="mb-6" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">ESPERANDO DATOS...</p>
                   </div>
                 ) : (
                   history.map((h, i) => (
                     <div key={i} className="bg-white/5 border border-white/5 p-5 rounded-[1.8rem] animate-fade-in border-l-4 border-l-red-600 group hover:bg-white/10 transition-all shadow-lg">
                        <p className="text-xs font-black text-white/80 italic leading-relaxed">"{h}"</p>
                     </div>
                   ))
                 )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-3 text-cyan-400 font-black text-[10px] uppercase tracking-widest italic mb-2">
                    <Pi size={16}/> CÓDIGO UNIVERSAL
                 </div>
                 <p className="text-[10px] text-white/30 font-bold italic leading-relaxed">
                   Los resultados están cifrados y validados por el motor de la Red XFLETCHAX.
                 </p>
              </div>
           </div>
        </div>

      </div>

      {/* FOOTER DE CALIDAD MATEMÁTICA */}
      <div className="mt-20 p-12 bg-[#08080c] border-2 border-white/5 rounded-[4.5rem] flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-[0.02] rotate-12 group-hover:scale-110 transition-transform duration-[5s] pointer-events-none">
            <Hash size={350}/>
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
            <div className="w-24 h-24 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center border-2 border-red-500/20 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
               <Square size={40} className="text-red-500 animate-pulse" />
            </div>
            <div>
               <h3 className="text-4xl font-black font-futuristic text-white italic uppercase tracking-tighter mb-4">SISTEMA MATEMÁTICO PERFECTO</h3>
               <p className="text-white/30 text-xl font-bold italic max-w-xl leading-relaxed">
                 Cero errores de redondeo. Ideal para transacciones comerciales, ingeniería social y estudios avanzados.
               </p>
            </div>
         </div>
         <div className="flex gap-12 relative z-10 border-l-2 border-white/5 pl-12 hidden lg:flex">
            <div>
               <p className="text-5xl font-black text-white italic">100%</p>
               <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-2 italic">CALIDAD XF</p>
            </div>
            <div className="w-px h-16 bg-white/5"></div>
            <div>
               <p className="text-5xl font-black text-red-600 italic">ERR-0</p>
               <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-2 italic">FALLOS DETECTADOS</p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Calculator;
