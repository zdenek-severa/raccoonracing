import { useState } from 'react';
import { questions } from '../data/content';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="faq-list">{questions.map((item, i) => <div className={`faq-item ${open === i ? 'expanded' : ''}`} key={item.question}>
    <h3><button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`answer-${i}`} id={`question-${i}`}><span>{item.question}</span><span className="faq-symbol" aria-hidden="true">{open === i ? '−' : '+'}</span></button></h3>
    <section id={`answer-${i}`} aria-labelledby={`question-${i}`} hidden={open !== i}><p>{item.answer}</p></section>
  </div>)}</div>;
}
